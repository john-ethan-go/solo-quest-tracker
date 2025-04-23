"use client";

import { useUserAuth } from "./daily-quest/_utils/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { user, gitHubSignIn } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/daily-quest");
  }, [user]);

  return (
    <main className="h-screen bg-gray-950 flex items-center justify-center text-white text-center px-6">
      <div className="max-w-xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-400 drop-shadow">
          🗡️ Solo Quest Tracker
        </h1>

        <div className="bg-gray-800 border border-cyan-400 p-4 rounded shadow text-cyan-200 text-sm mb-8">
          <p>[System] Welcome to the Solo Leveling daily quest tracker.</p>
          <p>To continue, please log in using your Hunter ID.</p>
        </div>

        <button
          onClick={gitHubSignIn}
          className="bg-cyan-500 hover:bg-cyan-600 animate-pulse px-6 py-2 rounded text-white font-bold shadow-lg"
        >
          Sign in with GitHub
        </button>

        <p className="text-gray-500 text-xs mt-4">Powered by the System ©</p>
      </div>
    </main>
  );
}