"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const INTENTS = [
  {
    id: "professional",
    title: "💼 Work / Professional",
    desc: "Boss, colleague, client, email or Slack replies",
    type: "Professional",
    goal: "Be clear",
  },
  {
    id: "dating",
    title: "💬 Dating / Personal",
    desc: "Crush, partner, emotional or awkward chats",
    type: "Personal",
    goal: "Be confident",
  },
  {
    id: "social",
    title: "🧍 Social / Friends",
    desc: "Friends, family, casual conversations",
    type: "Personal",
    goal: "Be respectful",
  },
  {
    id: "conflict",
    title: ⚠️ Sensitive / Conflict",
    desc: "Tension, boundaries, rejection, misunderstandings",
    type: "Conflict",
    goal: "Be calm",
  },
];

export default function ContextPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  function handleContinue() {
    if (!selected) return;

    const intent = INTENTS.find((i) => i.id === selected);
    if (!intent) return;

    sessionStorage.setItem("type", intent.type);
    sessionStorage.setItem("goal", intent.goal);

    router.push("/results");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            What kind of reply do you need help with?
          </h1>
          <p className="text-sm text-gray-600">
            This helps us understand the situation and suggest safer replies.
          </p>
        </div>

        {/* INTENT CARDS */}
        <div className="grid grid-cols-1 gap-3">
          {INTENTS.map((intent) => (
            <button
              key={intent.id}
              onClick={() => setSelected(intent.id)}
              className={`w-full rounded-xl border bg-white p-4 text-left transition
                ${
                  selected === intent.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                }
              `}
            >
              <div className="font-medium text-gray-900">
                {intent.title}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {intent.desc}
              </div>
            </button>
          ))}
        </div>

        {/* CONTINUE CTA */}
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`w-full mt-4 px-6 py-3 rounded-xl font-medium transition
            ${
              selected
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Continue →
        </button>

        {/* TRUST LINE */}
        <p className="text-xs text-gray-400 text-center">
          Nothing is stored. This is only to understand context.
        </p>
      </div>
    </main>
  );
}
