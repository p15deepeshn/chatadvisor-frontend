"use client";

import { useEffect, useState } from "react";
import { analyzeConversation } from "@/services/analyze";
import { AnalysisResult } from "@/types/analysis";
import CopyButton from "@/components/CopyButton";

export default function ResultsPage() {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function runAnalysis(rewriteStyle?: string) {
    try {
      setLoading(true);
      setError("");

      const content = sessionStorage.getItem("conversation");
      const type = sessionStorage.getItem("type");
      const goal = sessionStorage.getItem("goal");

      if (!content || !type || !goal) {
        setError("Missing conversation context");
        setLoading(false);
        return;
      }

      const result = await analyzeConversation(
        content,
        type,
        goal,
        rewriteStyle
      );

      setData(result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runAnalysis();
  }, []);

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (loading || !data) {
    return <p className="p-6">Analyzing conversation…</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 space-y-4">
      <Card title="🧠 What’s happening">
        {data.summary}
      </Card>

      {data.risk && (
        <Card title="⚠️ Potential Risk">
          {data.risk}
        </Card>
      )}

      <Card
        title="✅ Best Reply"
        highlight
        copyText={data.best_reply}
      >
        {data.best_reply}

        <RewriteButtons onRewrite={runAnalysis} />
      </Card>

      <Card
        title="🔁 Alternative Reply"
        copyText={data.alternative_reply}
      >
        {data.alternative_reply}
      </Card>

      <Card title="🚫 Avoid Saying">
        {data.avoid_saying}
      </Card>
    </main>
  );
}

/* =====================
   REWRITE BUTTONS
===================== */

function RewriteButtons({
  onRewrite,
}: {
  onRewrite: (style: string) => Promise<void> | void;
}) {
  const styles = ["Softer", "More confident", "Shorter"];
  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRewrite(style: string) {
    if (loading) return;

    setActive(style);
    setLoading(true);

    try {
      await onRewrite(style);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3 items-center">
      {styles.map((style) => (
        <button
          key={style}
          onClick={() => handleRewrite(style)}
          disabled={loading}
          className={`text-xs px-3 py-1 rounded-full border transition
            ${
              active === style
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300"
            }
            ${loading ? "opacity-50 cursor-not-allowed" : "hover:border-blue-400"}
          `}
        >
          {style}
        </button>
      ))}

      {loading && (
        <span className="text-xs text-gray-500 ml-2">
          Updating…
        </span>
      )}
    </div>
  );
}

/* =====================
   CARD COMPONENT
===================== */

function Card({
  title,
  children,
  highlight = false,
  copyText,
}: {
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
  copyText?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-white p-4 shadow-sm ${
        highlight ? "border-2 border-blue-500" : "border"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{title}</h3>
        {copyText && <CopyButton text={copyText} />}
      </div>

      {/* IMPORTANT: use div, not p */}
      <div className="text-gray-700 whitespace-pre-wrap text-sm space-y-2">
        {children}
      </div>
    </div>
  );
}
