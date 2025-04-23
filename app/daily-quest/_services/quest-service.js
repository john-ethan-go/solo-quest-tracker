import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../_utils/firebase';

export async function getUserQuestStatus(userId) {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().completed || [] : [];
}

export async function markQuestComplete(userId, questId) {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data().completed || [] : [];
  if (!existing.includes(questId)) {
    await setDoc(ref, { completed: [...existing, questId] }, { merge: true });
  }
}

export function getDailyQuests() {
  return ['pushups', 'situps', 'squats', 'running'];
}
