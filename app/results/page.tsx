"use client";

import { useEffect, useState } from "react";
import { analyzeConversation } from "@/services/analyze";
import { AnalysisResult } from "@/types/analysis";

/* =====================
   LOADING STEPS (INITIAL ONLY)
===================== */

const loadingSteps = [
  "Reading the conversation",
  "Understanding intent and tone",
  "Identifying potential risks",
  "Drafting the best reply",
];

/* =====================
   COPY HELPER (MOBILE SAFE)
===================== */

function copyToClipboard(text: string, onSuccess?: () => void) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      onSuccess?.();
    });
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    onSuccess?.();
  }
}

export default function ResultsPage() {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [showRisk, setShowRisk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  /* ---------- FULL ANALYSIS (ON LOAD) ---------- */

  async function runAnalysis() {
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
        setStepIndex((prev) =>
          prev < loadingSteps.length - 1 ? prev + 1 : prev
        );
      }, 900);

      const result = await analyzeConversation(content, type, goal);
      clearInterval(timer);
      setData(result);
    } catch {
      setError("We couldn’t analyze this conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- FAST REWRITE (NO LOADER) ---------- */

  async function rewriteReply(style: string) {
    if (!data) return;

    try {
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
    } catch {
      // silent fail
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
        <div className="bg-white rounded-xl p-6 space-y-4 max-w-sm w-full">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm text-gray-600">{error}</p>
          <button
            onClick={runAnalysis}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
          >
            Try again
          </button>
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
        <div className="bg-white rounded-xl p-6 space-y-4 max-w-sm w-full">
          <h2 className="text-lg font-semibold">
            Analyzing your conversation…
          </h2>

          <ul className="text-sm space-y-2">
            {loadingSteps.map((step, index) => (
              <li
                key={step}
                className={
                  index <= stepIndex ? "text-gray-900" : "text-gray-400"
                }
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

      <Section title="What’s happening">
        <p>{truncate(data.summary, 2)}</p>
      </Section>

      {data.risk && (
        <Section title="Potential risk">
          <button
            onClick={() => setShowRisk(!showRisk)}
            className="text-sm text-blue-600"
          >
            {showRisk ? "Hide risk" : "Show risk"}
          </button>

          {showRisk && (
            <p className="mt-2">{truncate(data.risk, 3)}</p>
          )}
        </Section>
      )}

      {/* BEST REPLY */}
      <section className="bg-blue-50 border border-blue-400 rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-lg">Best reply</h3>

        <p className="text-lg whitespace-pre-wrap">
          {truncate(data.best_reply, 4)}
        </p>

        <button
          onClick={() =>
            copyToClipboard(data.best_reply, () => {
              setCopied("best");
              setTimeout(() => setCopied(null), 1500);
            })
          }
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
        >
          {copied === "best" ? "Copied ✓" : "Copy this reply & send"}
        </button>

        <RewriteButtons onRewrite={rewriteReply} />
      </section>

      {/* ALTERNATIVE */}
      <section className="bg-white rounded-xl p-4 space-y-3">
        <h3 className="font-semibold">Alternative reply</h3>

        <p className="whitespace-pre-wrap">
          {truncate(data.alternative_reply, 4)}
        </p>

        <button
          onClick={() =>
            copyToClipboard(data.alternative_reply, () => {
              setCopied("alt");
              setTimeout(() => setCopied(null), 1500);
            })
          }
          className="w-full border border-gray-300 py-2 rounded-lg text-sm"
        >
          {copied === "alt" ? "Copied ✓" : "Copy alternative reply"}
        </button>
      </section>

      <Section title="Avoid saying">
        <p>{data.avoid_saying}</p>
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
  const styles = [
    "Softer",
    "More confident",
    "More expressive",
    "Shorter",
  ];

  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick(style: string) {
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
          onClick={() => handleClick(style)}
          className={`text-sm px-3 py-1 rounded-full border transition
            ${
              active === style
                ? "border-blue-500 bg-blue-100 text-blue-700"
                : "border-gray-300 text-gray-700"
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
      <h3 className="font-semibold">{title}</h3>
      {children}
    </section>
  );
}
