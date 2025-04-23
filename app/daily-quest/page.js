"use client";

import { useEffect, useState } from "react";
import questsData from "./quests.json";
import HeaderBar from "../_components/HeaderBar";
import { useUserAuth } from "./_utils/auth-context";
import {
  getDailyQuests,
  markQuestComplete,
  getUserQuestStatus
} from "./_services/quest-service";
import {
  calculateProgressToNext,
  calculateRank
} from "./_utils/xp-utils";

export default function DailyQuestPage() {
  const { user } = useUserAuth();
  const userId = user?.uid;
  const [xp, setXp] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [questIds, setQuestIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function fetchData() {
      try {
        const todayQuests = getDailyQuests();
        const completedQuests = await getUserQuestStatus(userId);
        setQuestIds(todayQuests);
        setCompleted(completedQuests);
        setXp(completedQuests.length * 25);
      } catch (err) {
        console.error("Error loading quests:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const handleToggle = async (id) => {
    if (!completed.includes(id)) {
      await markQuestComplete(userId, id);
      const updated = [...completed, id];
      setCompleted(updated);
      setXp(updated.length * 25);
    }
  };

  if (!user) return <div className="p-8 text-white">Please sign in to continue.</div>;
  if (loading) return <div className="p-8 text-white">Loading quests...</div>;

  const displayQuests = questsData.filter(q => questIds.includes(q.id));
  const optionalQuests = questsData.filter(q => !questIds.includes(q.id));
  const progress = calculateProgressToNext(xp);

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-8 font-mono">
      <div className="max-w-xl mx-auto">
        <HeaderBar />

        <h1 className="text-3xl font-bold mb-4 text-cyan-300 tracking-wide drop-shadow">
          📋 Daily Quests
        </h1>

        <div className="mb-6 bg-gray-800 p-4 border border-cyan-500 rounded">
          <div className="text-sm text-cyan-200">Rank: <span className="text-yellow-300 font-semibold">{progress.current}</span></div>
          <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
            <div
              className="bg-green-500 h-3 rounded-full shadow-md transition-all"
              style={{ width: `${progress.percent}%` }}
            ></div>
          </div>
          <div className="text-xs text-cyan-300 mt-1">{progress.percent}% to {progress.next}</div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-yellow-300 mb-3">Main Quests</h2>
          <ul className="space-y-2">
            {displayQuests.map(q => (
              <li key={q.id} className="flex items-center gap-3 bg-gray-800 p-3 rounded border border-yellow-400">
                <input
                  type="checkbox"
                  id={q.id}
                  className="w-5 h-5"
                  checked={completed.includes(q.id)}
                  onChange={() => handleToggle(q.id)}
                />
                <label htmlFor={q.id} className="text-lg">{q.label} ({q.goal})</label>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-400 mb-3">Optional Add-ons</h2>
          <div className="bg-gray-800 border border-pink-400 p-4 rounded">
            <ul className="space-y-1">
              {optionalQuests.map((q, idx) => (
                <li key={q.id} className="flex items-center gap-3">
                  <input type="checkbox" id={`opt-${idx}`} className="w-4 h-4" />
                  <label htmlFor={`opt-${idx}`}>{q.label} ({q.goal})</label>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="flex gap-4 mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold tracking-wide shadow-md">
            Submit Progress
          </button>
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded font-bold tracking-wide shadow-md">
            Claim Rewards
          </button>
        </div>
      </div>
    </main>
  );
}