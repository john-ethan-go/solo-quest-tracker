"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import Link from "next/link";

export default function DailyQuestPage() {
  const { user } = useUserAuth();
  const userId = user?.uid;
  const router = useRouter();
  const [xp, setXp] = useState(0);
  const [questIds, setQuestIds] = useState([]);
  const [checked, setChecked] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (user) setAuthLoading(false);
    else router.push("/");
  }, [user]);

  useEffect(() => {
    if (!userId) return;
    async function fetchData() {
      try {
        const todayQuests = getDailyQuests();
        const completedQuests = await getUserQuestStatus(userId);
        setQuestIds(todayQuests);
        setChecked(completedQuests);
        setXp(completedQuests.length * 25);
        if (completedQuests.length === todayQuests.length) {
          setSubmitted(true);
        }
      } catch (err) {
        console.error("Error loading quests:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end - now);
      setTimeLeft(diff);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleQuest = (id) => {
    if (submitted) return;
    setChecked(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmitProgress = async () => {
    if (!userId || submitted) return;
    if (questIds.some(q => !checked.includes(q))) return;

    try {
      for (const questId of checked) {
        await markQuestComplete(userId, questId);
      }
      setXp(checked.length * 25);
      setSubmitted(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-white animate-pulse">
        Redirecting to sign-in...
      </div>
    );
  }

  if (loading) return <div className="p-8 text-white">Loading quests...</div>;

  const displayQuests = questsData.filter(q => questIds.includes(q.id));
  const optionalQuests = questsData.filter(q => !questIds.includes(q.id));
  const progress = calculateProgressToNext(xp);

  const hours = Math.floor(timeLeft / 1000 / 60 / 60);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  const timeColor = timeLeft < 10800000 ? (timeLeft < 3600000 ? "text-red-400" : "text-yellow-400") : "text-green-400";

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-8 font-mono relative">
      {showToast && (
        <div className="fixed left-1/2 top-6 transform -translate-x-1/2 animate-fadeInScale z-50 bg-cyan-800 border border-cyan-400 text-cyan-200 px-6 py-3 rounded shadow-md">
          [System] Progress Submitted.
        </div>
      )}

      <div className="max-w-xl mx-auto">
        <HeaderBar />

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-cyan-300 tracking-wide drop-shadow">
            📋 Daily Quests
          </h1>
          <Link
            href="/daily-quest/history"
            className="text-sm text-blue-400 underline hover:text-blue-300"
          >
            View History
          </Link>
        </div>

        <div className="mb-6 bg-gray-800 p-4 border border-cyan-500 rounded">
          <div className="text-sm text-cyan-200">Rank: <span className="text-yellow-300 font-semibold">{progress.current}</span></div>
          <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
            <div
              className="bg-green-500 h-3 rounded-full shadow-md transition-all"
              style={{ width: `${progress.percent}%` }}
            ></div>
          </div>
          <div className="text-xs text-cyan-300 mt-1">{progress.percent}% to {progress.next}</div>
          <div className={`mt-2 text-sm font-semibold ${timeColor}`}>
            ⏳ Time left today: {hours}h {minutes}m {seconds}s
          </div>
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
                  checked={checked.includes(q.id)}
                  onChange={() => toggleQuest(q.id)}
                  disabled={submitted}
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
                  <input type="checkbox" id={`opt-${idx}`} className="w-4 h-4" disabled={submitted} />
                  <label htmlFor={`opt-${idx}`}>{q.label} ({q.goal})</label>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSubmitProgress}
            disabled={submitted || questIds.some(q => !checked.includes(q))}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded font-bold tracking-wide shadow-md"
          >
            Submit Progress
          </button>
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded font-bold tracking-wide shadow-md">
            Claim Rewards
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8) translateX(-50%);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateX(-50%);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.4s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
