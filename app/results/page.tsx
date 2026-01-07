"use client";

import { useEffect, useState } from "react";
import { analyzeConversation } from "@/services/analyze";
import { AnalysisResult } from "@/types/analysis";

/* =====================
   LOADING STEPS
===================== */

const loadingSteps = [
  "Reading the conversation",
  "Understanding intent & tone",
  "Identifying potential risks",
  "Drafting best replies",
];

export default function ResultsPage() {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [showRisk, setShowRisk] = useState(false);
  const [error, setError] = useState<null | {
    message: string;
    hint?: string;
  }>(null);

  async function runAnalysis(rewriteStyle?: string) {
    try {
      setLoading(true);
      setError(null);
      setStepIndex(0);

      const content = sessionStorage.getItem("conversation");
      const type = sessionStorage.getItem("type");
      const goal = sessionStorage.getItem("goal");

      if (!content || !type || !goal) {
        setError({
          message: "Conversation context missing.",
          hint: "Please go back and paste the conversation again.",
        });
        return;
      }

      const stepTimer = setInterval(() => {
        setStepIndex((prev) =>
          prev < loadingSteps.length - 1 ? prev + 1 : prev
        );
      }, 800);

      const result = await analyzeConversation(
        content,
        type,
        goal,
        rewriteStyle
      );

      clearInterval(stepTimer);
      setData(result);
    } catch {
      setError({
        message: "We couldn’t analyze this conversation.",
        hint: "Try again or paste fewer messages.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runAnalysis();
  }, []);

  /* =====================
     ERROR STATE
  ===================== */

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 max-w-sm w-full">
          <h2 className="text-lg font-semibold">{error.message}</h2>
          {error.hint && (
            <p className="text-sm text-gray-600">{error.hint}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => runAnalysis()}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 border py-2 rounded-lg text-sm"
            >
              Refresh
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Your conversation is not saved.
          </p>
        </div>
      </main>
    );
  }

  /* =====================
     LOADING STATE
  ===================== */

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 max-w-sm w-full">
          <h2 className="text-lg font-semibold">
            Analyzing your conversation…
          </h2>

          <ul className="space-y-2 text-sm">
            {loadingSteps.map((step, index) => (
              <li
                key={step}
                className={`flex gap-2 ${
                  index <= stepIndex
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {index <= stepIndex ? "✓" : "•"} {step}
              </li>
            ))}
          </ul>

          <p className="text-xs text-gray-500">
            This usually takes a few seconds.
          </p>
        </div>
      </main>
    );
  }

  if (!data) return null;

  /* =====================
     RESULTS
  ===================== */

  return (
    <main className="min-h-screen bg-gray-50 p-4 space-y-6 max-w-2xl mx-auto">

      {/* WHAT’S HAPPENING */}
      <Section title="What’s happening">
        <p className="text-base leading-relaxed">
          {truncate(data.summary, 2)}
        </p>
      </Section>

      {/* RISK */}
      {data.risk && (
        <Section title="Potential Risk">
          <button
            onClick={() => setShowRisk(!showRisk)}
            className="text-sm text-blue-600"
          >
            {showRisk ? "Hide risk ▲" : "Show risk ▼"}
          </button>

          {showRisk && (
            <p className="text-base leading-relaxed mt-2">
              {truncate(data.risk, 3)}
            </p>
          )}
        </Section>
      )}

      {/* BEST REPLY */}
      <section className="bg-blue-50 border border-blue-400 rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-lg">Best Reply</h3>

        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {truncate(data.best_reply, 4)}
        </p>

        <button
          onClick={() =>
            navigator.clipboard.writeText(data.best_reply)
          }
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-base sticky bottom-4"
        >
          ✅ Copy this reply & send
        </button>

        <RewriteButtons onRewrite={runAnalysis} />
      </section>

      {/* ALTERNATIVE */}
      <Section title="Alternative Reply">
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {truncate(data.alternative_reply, 4)}
        </p>
      </Section>

      {/* AVOID SAYING */}
      <Section title="Avoid Saying">
        <p className="text-base">{data.avoid_saying}</p>
      </Section>
    </main>
  );
}

/* =====================
   HELPERS
===================== */

function truncate(text: string, lines = 4) {
  return text.split("\n").slice(0, lines).join("\n");
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
    <div className="flex flex-wrap gap-2 pt-2">
      {styles.map((style) => (
        <button
          key={style}
          onClick={() => handleRewrite(style)}
          className={`text-sm px-3 py-1 rounded-full border ${
            active === style
              ? "border-blue-500 bg-blue-100 text-blue-700"
              : "border-gray-300"
          }`}
        >
          {style}
        </button>
      ))}
    </div>
  );
}

/* =====================
   SECTION
===================== */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl p-4 space-y-2">
      <h3 className="font-semibold text-base">{title}</h3>
      {children}
    </section>
  );
}
