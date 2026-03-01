import { db } from '../../firebase';
import {
  doc, setDoc, deleteDoc,
  collection, addDoc,
  query, orderBy, onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

const sub = (uid, col) => collection(db, 'dogs', uid, col);
const subDoc = (uid, col, id) => doc(db, 'dogs', uid, col, id);

// ─── Dog Profile ──────────────────────────────────────────────────────────────
export const subscribeDog = (uid, cb) =>
  onSnapshot(doc(db, 'dogs', uid), (snap) =>
    cb(snap.exists() ? { id: snap.id, ...snap.data() } : null)
  );

export const saveDog = (uid, data) =>
  setDoc(doc(db, 'dogs', uid), data, { merge: true });

// ─── Care Team ────────────────────────────────────────────────────────────────
export const subscribeCareTeam = (uid, cb) =>
  onSnapshot(query(sub(uid, 'careTeam')), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );

export const addCareTeamMember = (uid, data) =>
  addDoc(sub(uid, 'careTeam'), { ...data, createdAt: serverTimestamp() });

export const removeCareTeamMember = (uid, id) =>
  deleteDoc(subDoc(uid, 'careTeam', id));

// ─── Vaccinations ─────────────────────────────────────────────────────────────
export const subscribeVaccinations = (uid, cb) =>
  onSnapshot(
    query(sub(uid, 'vaccinations'), orderBy('createdAt', 'desc')),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );

export const addVaccination = (uid, data) =>
  addDoc(sub(uid, 'vaccinations'), { ...data, createdAt: serverTimestamp() });

export const deleteVaccination = (uid, id) =>
  deleteDoc(subDoc(uid, 'vaccinations', id));

// ─── Allergies ────────────────────────────────────────────────────────────────
export const subscribeAllergies = (uid, cb) =>
  onSnapshot(query(sub(uid, 'allergies')), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );

export const addAllergy = (uid, data) =>
  addDoc(sub(uid, 'allergies'), { ...data, createdAt: serverTimestamp() });

export const deleteAllergy = (uid, id) =>
  deleteDoc(subDoc(uid, 'allergies', id));

// ─── Weight History ───────────────────────────────────────────────────────────
export const subscribeWeightHistory = (uid, cb) =>
  onSnapshot(
    query(sub(uid, 'weight'), orderBy('createdAt', 'desc')),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );

export const addWeight = (uid, data) =>
  addDoc(sub(uid, 'weight'), { ...data, createdAt: serverTimestamp() });

export const deleteWeight = (uid, id) =>
  deleteDoc(subDoc(uid, 'weight', id));

// ─── Medications ──────────────────────────────────────────────────────────────
export const subscribeMedications = (uid, cb) =>
  onSnapshot(query(sub(uid, 'medications')), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );

export const addMedication = (uid, data) =>
  addDoc(sub(uid, 'medications'), { ...data, createdAt: serverTimestamp() });

export const deleteMedication = (uid, id) =>
  deleteDoc(subDoc(uid, 'medications', id));

// ─── Vets ─────────────────────────────────────────────────────────────────────
export const subscribeVets = (uid, cb) =>
  onSnapshot(query(sub(uid, 'vets')), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );

export const addVet = (uid, data) =>
  addDoc(sub(uid, 'vets'), { ...data, createdAt: serverTimestamp() });

export const deleteVet = (uid, id) =>
  deleteDoc(subDoc(uid, 'vets', id));

// ─── Memories ─────────────────────────────────────────────────────────────────
export const subscribeMemories = (uid, cb) =>
  onSnapshot(
    query(sub(uid, 'memories'), orderBy('createdAt', 'desc')),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );

export const addMemory = async (uid, data, imageBase64) => {
  return addDoc(sub(uid, 'memories'), {
    ...data,
    imageUrl: imageBase64 || null,
    createdAt: serverTimestamp(),
  });
};

export const deleteMemory = (uid, id) =>
  deleteDoc(subDoc(uid, 'memories', id));

// ─── Feedings ─────────────────────────────────────────────────────────────────
export const subscribeFeedings = (uid, cb) =>
  onSnapshot(
    query(sub(uid, 'feedings'), orderBy('createdAt', 'desc')),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );

export const addFeeding = (uid, data) =>
  addDoc(sub(uid, 'feedings'), { ...data, createdAt: serverTimestamp() });

export const deleteFeeding = (uid, id) =>
  deleteDoc(subDoc(uid, 'feedings', id));

// ─── Walks ────────────────────────────────────────────────────────────────────
export const subscribeWalks = (uid, cb) =>
  onSnapshot(
    query(sub(uid, 'walks'), orderBy('createdAt', 'desc')),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );

export const addWalk = (uid, data) =>
  addDoc(sub(uid, 'walks'), { ...data, createdAt: serverTimestamp() });

// ─── Reminders ───────────────────────────────────────────────────────────────
export const subscribeReminders = (uid, cb) =>
  onSnapshot(
    query(sub(uid, 'reminders'), orderBy('createdAt', 'desc')),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );

export const addReminder = (uid, data) =>
  addDoc(sub(uid, 'reminders'), { ...data, createdAt: serverTimestamp() });

export const deleteReminder = (uid, id) =>
  deleteDoc(subDoc(uid, 'reminders', id));
