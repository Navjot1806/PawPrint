import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import AccordionSection from '../components/AccordionSection';
import { useData } from '../contexts/DataContext';

const TABS = ['Records', 'Meds', 'Vets'];

// Modal types
const MODAL_TYPES = {
  VACCINATION: 'vaccination',
  ALLERGY: 'allergy',
  WEIGHT: 'weight',
  MEDICATION: 'medication',
  VET: 'vet',
};

export default function HealthScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [modal, setModal] = useState({ visible: false, type: null });
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const {
    vaccinations, addVaccination, deleteVaccination,
    allergies, addAllergy, deleteAllergy,
    weightHistory, addWeight, deleteWeight,
    medications, addMedication, deleteMedication,
    vets, addVet, deleteVet,
  } = useData();

  const openModal = (type) => {
    setForm({});
    setModal({ visible: true, type });
  };
  const closeModal = () => setModal({ visible: false, type: null });

  const handleSave = async () => {
    setSaving(true);
    try {
      switch (modal.type) {
        case MODAL_TYPES.VACCINATION:
          if (!form.name?.trim()) { Alert.alert('Required', 'Enter vaccine name.'); return; }
          await addVaccination({ name: form.name, nextDue: form.nextDue || '', status: form.status || 'valid' });
          break;
        case MODAL_TYPES.ALLERGY:
          if (!form.name?.trim()) { Alert.alert('Required', 'Enter allergy name.'); return; }
          await addAllergy({ name: form.name });
          break;
        case MODAL_TYPES.WEIGHT:
          if (!form.weight?.trim()) { Alert.alert('Required', 'Enter weight.'); return; }
          await addWeight({ weight: form.weight, date: form.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) });
          break;
        case MODAL_TYPES.MEDICATION:
          if (!form.name?.trim()) { Alert.alert('Required', 'Enter medication name.'); return; }
          await addMedication({ name: form.name, dosage: form.dosage || '', schedule: form.schedule || '', nextDue: form.nextDue || '' });
          break;
        case MODAL_TYPES.VET:
          if (!form.name?.trim()) { Alert.alert('Required', 'Enter vet name.'); return; }
          await addVet({ name: form.name, clinic: form.clinic || '', phone: form.phone || '', address: form.address || '' });
          break;
      }
      closeModal();
    } catch {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (label, onConfirm) => {
    Alert.alert('Delete', `Remove this ${label}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onConfirm },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Health Hub</Text>

      <View style={styles.segmented}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.segBtn, activeTab === i && styles.segBtnActive]}
            onPress={() => setActiveTab(i)}
          >
            <Text style={[styles.segText, activeTab === i && styles.segTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 0 && (
          <RecordsTab
            vaccinations={vaccinations}
            allergies={allergies}
            weightHistory={weightHistory}
            onAddVaccination={() => openModal(MODAL_TYPES.VACCINATION)}
            onAddAllergy={() => openModal(MODAL_TYPES.ALLERGY)}
            onAddWeight={() => openModal(MODAL_TYPES.WEIGHT)}
            onDeleteVaccination={(id) => confirmDelete('vaccination', () => deleteVaccination(id))}
            onDeleteAllergy={(id) => confirmDelete('allergy', () => deleteAllergy(id))}
            onDeleteWeight={(id) => confirmDelete('weight entry', () => deleteWeight(id))}
          />
        )}
        {activeTab === 1 && (
          <MedsTab
            medications={medications}
            onAdd={() => openModal(MODAL_TYPES.MEDICATION)}
            onDelete={(id) => confirmDelete('medication', () => deleteMedication(id))}
          />
        )}
        {activeTab === 2 && (
          <VetsTab
            vets={vets}
            onAdd={() => openModal(MODAL_TYPES.VET)}
            onDelete={(id) => confirmDelete('vet', () => deleteVet(id))}
          />
        )}
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={modal.visible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>{getModalTitle(modal.type)}</Text>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {renderModalForm(modal.type, form, setForm)}
            </ScrollView>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving
                  ? <ActivityIndicator color={Colors.WHITE} />
                  : <Text style={styles.saveBtnText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Tab Components ─────────────────────────────────────────────────────────────

function RecordsTab({ vaccinations, allergies, weightHistory, onAddVaccination, onAddAllergy, onAddWeight, onDeleteVaccination, onDeleteAllergy, onDeleteWeight }) {
  return (
    <>
      <AccordionSection title="Vaccinations" icon="shield-checkmark-outline" defaultOpen onAdd={onAddVaccination}>
        {vaccinations.length === 0
          ? <EmptyState text="No vaccinations added yet" />
          : vaccinations.map((vax) => (
            <TouchableOpacity
              key={vax.id}
              style={styles.recordRow}
              onLongPress={() => onDeleteVaccination(vax.id)}
              activeOpacity={0.7}
            >
              <View style={styles.recordLeft}>
                <Ionicons
                  name={vax.status === 'valid' ? 'checkmark-circle' : 'alert-circle'}
                  size={20}
                  color={vax.status === 'valid' ? Colors.SUCCESS : Colors.WARNING}
                />
                <Text style={styles.recordName}>{vax.name}</Text>
              </View>
              {vax.nextDue ? (
                <Text style={[styles.recordDate, vax.status === 'expired' && styles.expiredDate]}>
                  Due: {vax.nextDue}
                </Text>
              ) : null}
            </TouchableOpacity>
          ))}
      </AccordionSection>

      <AccordionSection title="Allergies" icon="warning-outline" onAdd={onAddAllergy}>
        {allergies.length === 0
          ? <EmptyState text="No allergies added yet" />
          : (
            <View style={styles.chipsRow}>
              {allergies.map((a) => (
                <TouchableOpacity
                  key={a.id}
                  style={styles.allergyChip}
                  onLongPress={() => onDeleteAllergy(a.id)}
                >
                  <Text style={styles.allergyText}>{a.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
      </AccordionSection>

      <AccordionSection title="Weight History" icon="scale-outline" onAdd={onAddWeight}>
        {weightHistory.length === 0
          ? <EmptyState text="No weight entries yet" />
          : weightHistory.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.recordRow}
              onLongPress={() => onDeleteWeight(entry.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.recordName}>{entry.date}</Text>
              <Text style={styles.weightValue}>{entry.weight}</Text>
            </TouchableOpacity>
          ))}
      </AccordionSection>
    </>
  );
}

function MedsTab({ medications, onAdd, onDelete }) {
  return (
    <>
      <TouchableOpacity style={styles.addRowBtn} onPress={onAdd}>
        <Ionicons name="add-circle-outline" size={20} color={Colors.PRIMARY} />
        <Text style={styles.addRowText}>Add Medication</Text>
      </TouchableOpacity>

      {medications.length === 0
        ? <EmptyCard icon="medical-outline" text="No medications added yet" />
        : medications.map((med) => (
          <TouchableOpacity
            key={med.id}
            style={styles.medCard}
            onLongPress={() => onDelete(med.id)}
            activeOpacity={0.8}
          >
            <View style={styles.medHeader}>
              <Ionicons name="medical-outline" size={20} color={Colors.SECONDARY} />
              <Text style={styles.medName}>{med.name}</Text>
            </View>
            {med.dosage ? <Text style={styles.medDetail}>Dosage: {med.dosage}</Text> : null}
            {med.schedule ? <Text style={styles.medDetail}>Schedule: {med.schedule}</Text> : null}
            {med.nextDue ? (
              <View style={styles.medDue}>
                <Ionicons name="calendar-outline" size={14} color={Colors.PRIMARY} />
                <Text style={styles.medDueText}>Next due: {med.nextDue}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ))}
    </>
  );
}

function VetsTab({ vets, onAdd, onDelete }) {
  return (
    <>
      <TouchableOpacity style={styles.addRowBtn} onPress={onAdd}>
        <Ionicons name="add-circle-outline" size={20} color={Colors.PRIMARY} />
        <Text style={styles.addRowText}>Add Vet</Text>
      </TouchableOpacity>

      {vets.length === 0
        ? <EmptyCard icon="person-outline" text="No vets added yet" />
        : vets.map((vet) => (
          <TouchableOpacity
            key={vet.id}
            style={styles.vetCard}
            onLongPress={() => onDelete(vet.id)}
            activeOpacity={0.8}
          >
            <View style={styles.vetHeader}>
              <View style={styles.vetIcon}>
                <Ionicons name="person-outline" size={20} color={Colors.PRIMARY} />
              </View>
              <View>
                <Text style={styles.vetName}>{vet.name}</Text>
                {vet.clinic ? <Text style={styles.vetClinic}>{vet.clinic}</Text> : null}
              </View>
            </View>
            {vet.phone ? (
              <View style={styles.vetInfo}>
                <Ionicons name="call-outline" size={14} color={Colors.TEXT_SECONDARY} />
                <Text style={styles.vetInfoText}>{vet.phone}</Text>
              </View>
            ) : null}
            {vet.address ? (
              <View style={styles.vetInfo}>
                <Ionicons name="location-outline" size={14} color={Colors.TEXT_SECONDARY} />
                <Text style={styles.vetInfoText}>{vet.address}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ))}
    </>
  );
}

function EmptyState({ text }) {
  return (
    <Text style={styles.emptyState}>{text}</Text>
  );
}

function EmptyCard({ icon, text }) {
  return (
    <View style={styles.emptyCard}>
      <Ionicons name={icon} size={40} color={Colors.TEXT_LIGHT} />
      <Text style={styles.emptyCardText}>{text}</Text>
    </View>
  );
}

// ─── Modal Helpers ──────────────────────────────────────────────────────────────

function getModalTitle(type) {
  switch (type) {
    case MODAL_TYPES.VACCINATION: return 'Add Vaccination';
    case MODAL_TYPES.ALLERGY: return 'Add Allergy';
    case MODAL_TYPES.WEIGHT: return 'Log Weight';
    case MODAL_TYPES.MEDICATION: return 'Add Medication';
    case MODAL_TYPES.VET: return 'Add Vet';
    default: return 'Add';
  }
}

function Field({ label, placeholder, value, onChangeText, keyboardType = 'default' }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        placeholder={placeholder}
        placeholderTextColor={Colors.TEXT_LIGHT}
        value={value || ''}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function StatusToggle({ value, onChange }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.fieldLabel}>Status</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, value !== 'expired' && styles.toggleBtnActive]}
          onPress={() => onChange('valid')}
        >
          <Text style={[styles.toggleText, value !== 'expired' && styles.toggleTextActive]}>Valid</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, value === 'expired' && styles.toggleBtnExpired]}
          onPress={() => onChange('expired')}
        >
          <Text style={[styles.toggleText, value === 'expired' && styles.toggleTextActive]}>Expired</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function renderModalForm(type, form, setForm) {
  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));
  switch (type) {
    case MODAL_TYPES.VACCINATION:
      return (
        <>
          <Field label="Vaccine Name *" placeholder="e.g. Rabies" value={form.name} onChangeText={set('name')} />
          <Field label="Next Due Date" placeholder="e.g. Jun 15, 2027" value={form.nextDue} onChangeText={set('nextDue')} />
          <StatusToggle value={form.status || 'valid'} onChange={set('status')} />
        </>
      );
    case MODAL_TYPES.ALLERGY:
      return (
        <Field label="Allergy *" placeholder="e.g. Chicken, Grass pollen" value={form.name} onChangeText={set('name')} />
      );
    case MODAL_TYPES.WEIGHT:
      return (
        <>
          <Field label="Weight *" placeholder="e.g. 28 kg" value={form.weight} onChangeText={set('weight')} />
          <Field label="Date" placeholder="e.g. Feb 2026" value={form.date} onChangeText={set('date')} />
        </>
      );
    case MODAL_TYPES.MEDICATION:
      return (
        <>
          <Field label="Medication Name *" placeholder="e.g. Heartgard Plus" value={form.name} onChangeText={set('name')} />
          <Field label="Dosage" placeholder="e.g. 1 chewable tablet" value={form.dosage} onChangeText={set('dosage')} />
          <Field label="Schedule" placeholder="e.g. Monthly" value={form.schedule} onChangeText={set('schedule')} />
          <Field label="Next Due" placeholder="e.g. Mar 1, 2026" value={form.nextDue} onChangeText={set('nextDue')} />
        </>
      );
    case MODAL_TYPES.VET:
      return (
        <>
          <Field label="Vet Name *" placeholder="e.g. Dr. Sarah Johnson" value={form.name} onChangeText={set('name')} />
          <Field label="Clinic" placeholder="e.g. Happy Paws Vet Clinic" value={form.clinic} onChangeText={set('clinic')} />
          <Field label="Phone" placeholder="e.g. (555) 123-4567" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
          <Field label="Address" placeholder="e.g. 123 Pet Care Lane" value={form.address} onChangeText={set('address')} />
        </>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  screenTitle: {
    fontSize: 24, fontWeight: '700', color: Colors.TEXT_PRIMARY,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  segmented: {
    flexDirection: 'row', marginHorizontal: 20,
    backgroundColor: Colors.WHITE, borderRadius: 12,
    padding: 4, marginBottom: 16,
  },
  segBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  segBtnActive: { backgroundColor: Colors.PRIMARY },
  segText: { fontSize: 14, fontWeight: '600', color: Colors.TEXT_SECONDARY },
  segTextActive: { color: Colors.WHITE },
  scroll: { paddingHorizontal: 20, paddingBottom: 100 },
  // Records
  recordRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.BACKGROUND,
  },
  recordLeft: { flexDirection: 'row', alignItems: 'center' },
  recordName: { fontSize: 14, fontWeight: '500', color: Colors.TEXT_PRIMARY, marginLeft: 8 },
  recordDate: { fontSize: 12, color: Colors.TEXT_SECONDARY },
  expiredDate: { color: Colors.WARNING, fontWeight: '600' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  allergyChip: {
    backgroundColor: Colors.WARNING + '15', paddingHorizontal: 14,
    paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8,
  },
  allergyText: { fontSize: 13, fontWeight: '600', color: Colors.WARNING },
  weightValue: { fontSize: 15, fontWeight: '700', color: Colors.TEXT_PRIMARY },
  emptyState: { fontSize: 13, color: Colors.TEXT_LIGHT, paddingVertical: 12, paddingLeft: 4 },
  // Meds
  addRowBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.WHITE, borderRadius: 12,
    padding: 14, marginBottom: 12, gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  addRowText: { fontSize: 15, fontWeight: '600', color: Colors.PRIMARY },
  medCard: {
    backgroundColor: Colors.WHITE, borderRadius: 14,
    padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  medHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  medName: { fontSize: 16, fontWeight: '700', color: Colors.TEXT_PRIMARY, marginLeft: 8 },
  medDetail: { fontSize: 13, color: Colors.TEXT_SECONDARY, marginBottom: 4 },
  medDue: {
    flexDirection: 'row', alignItems: 'center', marginTop: 8,
    backgroundColor: Colors.PRIMARY + '15', paddingHorizontal: 10,
    paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start',
  },
  medDueText: { fontSize: 12, fontWeight: '600', color: Colors.PRIMARY_DARK, marginLeft: 4 },
  // Vets
  vetCard: {
    backgroundColor: Colors.WHITE, borderRadius: 14,
    padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  vetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  vetIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.PRIMARY + '20',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  vetName: { fontSize: 16, fontWeight: '700', color: Colors.TEXT_PRIMARY },
  vetClinic: { fontSize: 13, color: Colors.TEXT_SECONDARY, marginTop: 2 },
  vetInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  vetInfoText: { fontSize: 13, color: Colors.TEXT_SECONDARY, marginLeft: 8 },
  // Empty
  emptyCard: {
    backgroundColor: Colors.WHITE, borderRadius: 14,
    padding: 40, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  emptyCardText: { fontSize: 14, color: Colors.TEXT_LIGHT, marginTop: 12 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: Colors.OVERLAY, justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: Colors.WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40, maxHeight: '85%',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.TEXT_PRIMARY, marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.TEXT_SECONDARY, marginBottom: 6 },
  fieldInput: {
    backgroundColor: Colors.BACKGROUND, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: Colors.TEXT_PRIMARY,
  },
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    backgroundColor: Colors.BACKGROUND, alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: Colors.SUCCESS },
  toggleBtnExpired: { backgroundColor: Colors.WARNING },
  toggleText: { fontSize: 14, fontWeight: '600', color: Colors.TEXT_SECONDARY },
  toggleTextActive: { color: Colors.WHITE },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn: {
    flex: 1, backgroundColor: Colors.BACKGROUND,
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  cancelBtnText: { fontSize: 16, fontWeight: '600', color: Colors.TEXT_SECONDARY },
  saveBtn: {
    flex: 1, backgroundColor: Colors.PRIMARY,
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: Colors.WHITE },
});
