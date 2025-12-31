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
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-center mb-1">ChatAdvisor</h1>
      <p className="text-center text-gray-500 mb-6">
        Think before you reply.
      </p>

      <textarea
        className="flex-1 border rounded-lg p-3 mb-4 text-sm"
        placeholder="Paste the conversation here…"
        value={conversation}
        onChange={(e) => setConversation(e.target.value)}
      />

      <button
        onClick={handleContinue}
        disabled={!conversation}
        className="bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
      >
        Continue
      </button>
    </main>
  );
}
