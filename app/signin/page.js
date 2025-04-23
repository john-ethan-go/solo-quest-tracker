"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../daily-quest/_utils/auth-context";

export default function SignInPage() {
  const { user, gitHubSignIn } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/daily-quest");
  }, [user]);

  return (
    <main className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-cyan-400 mb-6 tracking-wide drop-shadow">
          📜 Welcome, Hunter
        </h1>
        <p className="text-gray-300 text-md mb-10">
          You've awakened your powers.
          <br />Log in to begin your daily quests.
        </p>
        <button
          onClick={gitHubSignIn}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded text-lg font-bold tracking-wide shadow-md transition-all duration-200"
        >
          Sign In with GitHub
        </button>
      </div>
    </main>
  );
}
