"use client";

import { useEffect, useState } from "react";
import { analyzeConversation } from "@/services/analyze";
import { AnalysisResult } from "@/types/analysis";

const loadingSteps = [
  "Reading the conversation",
  "Understanding intent and tone",
  "Identifying potential risks",
  "Drafting the best reply",
];

export default function ResultsPage() {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [showRisk, setShowRisk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rewriting, setRewriting] = useState(false);

  /* ---------- INITIAL FULL ANALYSIS ---------- */

  async function runInitialAnalysis() {
    try {
      setLoading(true);
      setError(null);
      setStepIndex(0);

      const content = sessionStorage.getItem("conversation");
      const type = sessionStorage.getItem("type");
      const goal = sessionStorage.getItem("goal");

      if (!content || !type || !goal) {
        setError("Conversation context missing. Please start again.");
        return;
      }

      const timer = setInterval(() => {
        setStepIndex((p) =>
          p < loadingSteps.length - 1 ? p + 1 : p
        );
      }, 800);

      const result = await analyzeConversation(content, type, goal);
      clearInterval(timer);
      setData(result);
    } catch {
      setError("Couldn’t analyze this conversation. Try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- FAST REWRITE (NO LOADER) ---------- */

  async function rewrite(style: string) {
    if (!data) return;
    try {
      setRewriting(true);

      const content = sessionStorage.getItem("conversation");
      const type = sessionStorage.getItem("type");
      const goal = sessionStorage.getItem("goal");

      if (!content || !type || !goal) return;

      const result = await analyzeConversation(
        content,
        type,
        goal,
        style
      );

      setData(result);
    } finally {
      setRewriting(false);
    }
  }

  useEffect(() => {
    runInitialAnalysis();
  }, []);

  /* ---------- ERROR ---------- */

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-xl p-6 space-y-4 max-w-sm w-full">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm text-gray-600">{error}</p>
          <button
            onClick={runInitialAnalysis}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  /* ---------- LOADING (ONLY ON FIRST LOAD) ---------- */

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-xl p-6 space-y-4 max-w-sm w-full">
          <h2 className="text-lg font-semibold">
            Analyzing your conversation…
          </h2>
          <ul className="text-sm space-y-2">
            {loadingSteps.map((s, i) => (
              <li
                key={s}
                className={i <= stepIndex ? "text-gray-900" : "text-gray-400"}
              >
                {i <= stepIndex ? "✓" : "•"} {s}
              </li>
            ))}
          </ul>
        </div>
      </main>
    );
  }

  if (!data) return null;

  /* ---------- RESULTS ---------- */

  return (
    <main className="min-h-screen bg-gray-50 p-4 space-y-6 max-w-2xl mx-auto">

      {/* WHAT’S HAPPENING */}
      <Section title="What’s happening">
        <p>{truncate(data.summary, 2)}</p>
      </Section>

      {/* RISK */}
      {data.risk && (
        <Section title="Potential risk">
          <button
            onClick={() => setShowRisk(!showRisk)}
            className="text-sm text-blue-600"
          >
            {showRisk ? "Hide risk" : "Show risk"}
          </button>
          {showRisk && <p className="mt-2">{truncate(data.risk, 3)}</p>}
        </Section>
      )}

      {/* BEST REPLY (PRIMARY) */}
      <section className="bg-blue-50 border border-blue-400 rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-lg">Best reply</h3>

        <p className="text-lg whitespace-pre-wrap">
          {truncate(data.best_reply, 4)}
        </p>

        <button
          onClick={() => navigator.clipboard.writeText(data.best_reply)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
        >
          ✅ Copy this reply & send
        </button>

        <RewriteButtons onRewrite={rewrite} loading={rewriting} />
      </section>

      {/* ALTERNATIVE */}
      <Section title="Alternative reply">
        <p className="whitespace-pre-wrap">
          {truncate(data.alternative_reply, 4)}
        </p>
        <button
          onClick={() =>
            navigator.clipboard.writeText(data.alternative_reply)
          }
          className="mt-2 text-sm text-blue-600"
        >
          Copy alternative
        </button>
      </Section>

      {/* AVOID */}
      <Section title="Avoid saying">
        <p>{data.avoid_saying}</p>
      </Section>
    </main>
  );
}

/* ---------- HELPERS ---------- */

function truncate(text: string, lines = 4) {
  return text.split("\n").slice(0, lines).join("\n");
}

function RewriteButtons({
  onRewrite,
  loading,
}: {
  onRewrite: (style: string) => void;
  loading: boolean;
}) {
  const styles = ["Softer", "More confident", "More expressive", "Shorter"];

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {styles.map((s) => (
        <button
          key={s}
          onClick={() => onRewrite(s)}
          disabled={loading}
          className="text-sm px-3 py-1 rounded-full border border-gray-300 hover:border-blue-400 disabled:opacity-50"
        >
          {s}
        </button>
      ))}
      {loading && (
        <span className="text-xs text-gray-500 ml-2">
          Updating reply…
        </span>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl p-4 space-y-2">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </section>
  );
}
