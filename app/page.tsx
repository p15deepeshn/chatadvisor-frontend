"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [conversation, setConversation] = useState("");
  const router = useRouter();

  function handleContinue() {
    sessionStorage.setItem("conversation", conversation);
    router.push("/context");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-xl flex flex-col">

        {/* HERO COPY */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Think before you reply.
          </h1>

          <p className="mt-3 text-base md:text-lg text-gray-600">
            Paste any message. Get clarity, risks, and a clean reply—before you send it.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Built for important chats: work, dating, awkward situations.
          </p>
        </div>

        {/* INPUT */}
        <textarea
          className="flex-1 border rounded-xl p-4 mb-4 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste a WhatsApp message, email, or chat text here…"
          value={conversation}
          onChange={(e) => setConversation(e.target.value)}
        />

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={!conversation}
          className="bg-blue-600 text-white py-3 rounded-xl text-base font-medium disabled:opacity-50"
        >
          Get reply
        </button>
      </div>
    </main>
  );
}
