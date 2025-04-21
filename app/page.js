import Link from "next/link";

export default function HomePage() {
  const today = new Date().toDateString();

  const quests = [
    { id: 'pushups', label: 'Push-ups', goal: 100 },
    { id: 'situps', label: 'Sit-ups', goal: 100 },
    { id: 'squats', label: 'Squats', goal: 100 },
    { id: 'running', label: 'Run', goal: '10 km' },
  ];

  const optionals = [
    'Plank Hold',
    'Jump Rope',
    'Shadow Boxing'
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">Daily Quests – {today}</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-yellow-300 mb-2">Main Quests</h2>
          <ul className="space-y-2">
            {quests.map(q => (
              <li key={q.id} className="flex items-center gap-3">
                <input type="checkbox" id={q.id} className="w-5 h-5" />
                <label htmlFor={q.id} className="text-lg">{q.label} ({q.goal})</label>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-pink-400 mb-2">Optional Add-ons</h2>
          <ul className="space-y-1">
            {optionals.map((o, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <input type="checkbox" id={`opt-${idx}`} className="w-4 h-4" />
                <label htmlFor={`opt-${idx}`}>{o}</label>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex gap-4 mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Submit Progress</button>
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded">Claim Rewards</button>
        </div>
      </div>
    </main>
  );
}