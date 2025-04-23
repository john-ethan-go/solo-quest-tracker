"use client";

import { useUserAuth } from "../daily-quest/_utils/auth-context";

export default function HeaderBar() {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

  return (
    <header className="w-full bg-gray-900 px-6 py-3 flex justify-between items-center text-white shadow">
      <h1 className="text-2xl font-bold text-blue-400">Solo Quest Tracker</h1>
      <div>
        {user ? (
          <div className="flex gap-3 items-center">
            <span className="text-green-300 text-sm">Signed in as: {user.displayName || user.email}</span>
            <button
              onClick={firebaseSignOut}
              className="text-red-400 hover:text-red-300 text-sm underline"
            >Sign Out</button>
          </div>
        ) : (
          <button
            onClick={gitHubSignIn}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
          >Sign in with GitHub</button>
        )}
      </div>
    </header>
  );
}