"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CONTEXTS = [
  {
    value: "dating",
    title: "Dating / Personal",
    desc: "Texting, flirting, reassurance, emotional moments",
  },
  {
    value: "work",
    title: "Work / Professional",
    desc: "Colleagues, clients, managers, formal chats",
  },
  {
    value: "conflict",
    title: "Sensitive / Conflict",
    desc: "Disagreements, boundaries, difficult conversations",
  },
  {
    value: "sales",
    title: "Sales / Persuasion",
    desc: "Convincing, negotiating, follow-ups",
  },
];

const GOALS = [
  { value: "confident", label: "Sound confident" },
  { value: "romantic", label: "Sound romantic / affirming" },
  { value: "playful", label: "Sound playful" },
  { value: "calm", label: "Keep it calm" },
  { value: "short", label: "Keep it short" },
];

export default function ContextPage() {
  const router = useRouter();
  const [context, setContext] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);

  function handleContinue() {
    if (!context || !goal) return;
    sessionStorage.setItem("type", context);
    sessionStorage.setItem("goal", goal);
    router.push("/results");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-xl space-y-8">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Choose the situation
          </h1>
          <p className="text-sm text-gray-600">
            This helps tailor the wording — not judge the conversation.
          </p>
        </div>

        {/* CONTEXT OPTIONS */}
        <div className="space-y-3">
          {CONTEXTS.map((c) => (
            <button
              key={c.value}
              onClick={() => setContext(c.value)}
              className={`w-full text-left p-4 rounded-xl border transition
                ${
                  context === c.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }
              `}
            >
              <div className="font-medium text-gray-900">{c.title}</div>
              <div className="text-sm text-gray-500">{c.desc}</div>
            </button>
          ))}
        </div>

        {/* GOAL */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-700">
            How do you want it to sound?
          </h2>

          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <button
                key={g.value}
                onClick={() => setGoal(g.value)}
                className={`px-4 py-2 rounded-full text-sm border transition
                  ${
                    goal === g.value
                      ? "border-blue-500 bg-blue-100 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }
                `}
              >
                {g.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500">
            You can change the tone later before sending.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={!context || !goal}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-blue-700"
        >
          Show me better wording →
        </button>
      </div>
    </main>
  );
}
