import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import * as svc from '../services/firestoreService';

const DataContext = createContext({});

export function DataProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.uid;

  const [dog, setDog] = useState(null);
  const [dogLoading, setDogLoading] = useState(true);
  const [careTeam, setCareTeam] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [weightHistory, setWeightHistory] = useState([]);
  const [medications, setMedications] = useState([]);
  const [vets, setVets] = useState([]);
  const [memories, setMemories] = useState([]);
  const [walks, setWalks] = useState([]);
  const [feedings, setFeedings] = useState([]);
  const [reminders, setReminders] = useState([]);

  const unsubs = useRef([]);

  useEffect(() => {
    unsubs.current.forEach((u) => u());
    unsubs.current = [];

    if (!uid) {
      setDog(null);
      setDogLoading(false);
      setCareTeam([]);
      setVaccinations([]);
      setAllergies([]);
      setWeightHistory([]);
      setMedications([]);
      setVets([]);
      setMemories([]);
      setWalks([]);
      setFeedings([]);
      setReminders([]);
      return;
    }

    setDogLoading(true);
    unsubs.current = [
      svc.subscribeDog(uid, (d) => { setDog(d); setDogLoading(false); }),
      svc.subscribeCareTeam(uid, setCareTeam),
      svc.subscribeVaccinations(uid, setVaccinations),
      svc.subscribeAllergies(uid, setAllergies),
      svc.subscribeWeightHistory(uid, setWeightHistory),
      svc.subscribeMedications(uid, setMedications),
      svc.subscribeVets(uid, setVets),
      svc.subscribeMemories(uid, setMemories),
      svc.subscribeWalks(uid, setWalks),
      svc.subscribeFeedings(uid, setFeedings),
      svc.subscribeReminders(uid, setReminders),
    ];

    return () => unsubs.current.forEach((u) => u());
  }, [uid]);

  return (
    <DataContext.Provider
      value={{
        dog,
        dogLoading,
        saveDog: (data) => svc.saveDog(uid, data),

        careTeam,
        addCareTeamMember: (d) => svc.addCareTeamMember(uid, d),
        removeCareTeamMember: (id) => svc.removeCareTeamMember(uid, id),

        vaccinations,
        addVaccination: (d) => svc.addVaccination(uid, d),
        deleteVaccination: (id) => svc.deleteVaccination(uid, id),

        allergies,
        addAllergy: (d) => svc.addAllergy(uid, d),
        deleteAllergy: (id) => svc.deleteAllergy(uid, id),

        weightHistory,
        addWeight: (d) => svc.addWeight(uid, d),
        deleteWeight: (id) => svc.deleteWeight(uid, id),

        medications,
        addMedication: (d) => svc.addMedication(uid, d),
        deleteMedication: (id) => svc.deleteMedication(uid, id),

        vets,
        addVet: (d) => svc.addVet(uid, d),
        deleteVet: (id) => svc.deleteVet(uid, id),

        memories,
        addMemory: (d, uri) => svc.addMemory(uid, d, uri),
        deleteMemory: (id) => svc.deleteMemory(uid, id),

        walks,
        addWalk: (d) => svc.addWalk(uid, d),

        feedings,
        addFeeding: (d) => svc.addFeeding(uid, d),
        deleteFeeding: (id) => svc.deleteFeeding(uid, id),

        reminders,
        addReminder: (d) => svc.addReminder(uid, d),
        deleteReminder: (id) => svc.deleteReminder(uid, id),
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
