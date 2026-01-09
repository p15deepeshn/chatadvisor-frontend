"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [conversation, setConversation] = useState("");
  const router = useRouter();

  function handleContinue() {
    if (!conversation.trim()) return;
    sessionStorage.setItem("conversation", conversation.trim());
    router.push("/context");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-xl flex flex-col">

        {/* HERO COPY */}
        <div className="mb-8 text-center space-y-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            Say it right.
          </h1>

          {/* ONE-LINE POSITIONING */}
          <p className="text-base md:text-lg text-gray-700">
            Paste a conversation. Get better word choices —
            confident, natural, and right for the moment.
          </p>

          {/* MICRO VALUE PROPS */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>• You already know what you want to say</p>
            <p>• ChatAdvisor helps you phrase it better</p>
            <p>• Choose the tone. Copy. Send.</p>
          </div>

          <p className="text-xs text-gray-400 pt-2">
            Works for dating, work chats, WhatsApp, and everyday conversations.
          </p>
        </div>

        {/* INPUT */}
        <div className="flex-1 flex flex-col">
          <textarea
            className="flex-1 min-h-[220px] border border-gray-300 rounded-xl
                       p-4 text-base leading-relaxed text-gray-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the full conversation or message here…"
            value={conversation}
            onChange={(e) => setConversation(e.target.value)}
          />

          <p className="mt-2 text-xs text-gray-400">
            Tip: Paste the full chat or message you’re replying to.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={!conversation.trim()}
          className="mt-6 bg-blue-600 text-white py-3 rounded-xl
                     text-base font-medium transition
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-blue-700"
        >
          Help me phrase this →
        </button>

        <p className="mt-3 text-xs text-gray-400 text-center">
          Hindi • English • Hinglish supported
        </p>
      </div>
    </main>
  );
}
