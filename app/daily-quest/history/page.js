"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../_utils/auth-context";
import { db } from "../_utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { format, subDays, isAfter } from "date-fns";
import Link from "next/link";

export default function HistoryPage() {
  const { user } = useUserAuth();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.push("/");
    } else if (user) {
      setAuthLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.uid) return;

    async function fetchHistory() {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        const completed = snap.exists() ? snap.data().completed || {} : {};

        const keys = Object.keys(completed).sort();
        const firstDate = keys.length > 0 ? new Date(keys[0]) : null;
        const days = [];

        for (let i = 0; i < 7; i++) {
          const dateObj = subDays(new Date(), i);
          if (!firstDate || isAfter(firstDate, dateObj)) continue;
          const date = format(dateObj, "yyyy-MM-dd");
          const isCompleted = completed[date]?.length > 0;
          days.push({ date, status: isCompleted ? "Completed" : "Failed" });
        }

        setHistory(days);
      } catch (err) {
        console.error("History load error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user, router]);

  if (authLoading) return <div className="p-8 text-white animate-pulse">Checking login...</div>;
  if (loading) return <div className="p-8 text-white">Loading history...</div>;

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10 font-mono">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-300">🧾 Quest History</h1>
          <Link
            href="/daily-quest"
            className="text-sm text-blue-400 underline hover:text-blue-300"
          >
            ← Back to Daily Quests
          </Link>
        </div>

        <ul className="space-y-3">
          {history.map((entry, idx) => (
            <li
              key={idx}
              className={`flex items-center justify-between p-4 border rounded-md ${
                entry.status === "Completed"
                  ? "border-green-500 bg-gray-800"
                  : "border-red-500 bg-gray-900"
              }`}
            >
              <span className="text-lg">{entry.date}</span>
              <span
                className={`px-3 py-1 rounded text-sm font-semibold ${
                  entry.status === "Completed"
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {entry.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
