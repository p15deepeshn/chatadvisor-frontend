"use client";

import { useRouter } from "next/navigation";

const PRESETS = [
  { label: "Professional", type: "Professional", goal: "Be clear" },
  { label: "Dating", type: "Personal", goal: "Be confident" },
  { label: "Conflict", type: "Conflict", goal: "Be calm" },
  { label: "Sales", type: "Sales", goal: "Be persuasive" },
];

export default function ContextPage() {
  const router = useRouter();

  function handlePreset(type: string, goal: string) {
    sessionStorage.setItem("type", type);
    sessionStorage.setItem("goal", goal);
    router.push("/results");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Choose the context
      </h2>

      <div className="space-y-3">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => handlePreset(p.type, p.goal)}
            className="w-full bg-white border rounded-xl p-4 text-left hover:border-blue-500"
          >
            <div className="font-medium">{p.label}</div>
            <div className="text-sm text-gray-500">
              Goal: {p.goal}
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}
