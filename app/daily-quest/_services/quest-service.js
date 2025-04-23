import { db } from "../_utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { format } from "date-fns";

export async function markQuestComplete(userId, questId) {
  const ref = doc(db, "users", userId);
  const today = format(new Date(), "yyyy-MM-dd");

  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data().completed || {} : {};
  const todayQuests = new Set(existing[today] || []);
  todayQuests.add(questId);

  await setDoc(ref, {
    completed: {
      ...existing,
      [today]: Array.from(todayQuests)
    }
  }, { merge: true });
}

export async function getUserQuestStatus(userId) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];

  const completed = snap.data().completed || {};
  const today = format(new Date(), "yyyy-MM-dd");
  return completed[today] || [];
}

export async function getUserCompletionMap(userId) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return {};
  return snap.data().completed || {};
}

export function getDailyQuests() {
  return ["pushups", "situps", "squats", "running"];
}
