"use client";

import { useEffect, useState } from "react";
import { analyzeConversation } from "@/services/analyze";
import { AnalysisResult } from "@/types/analysis";
import CopyButton from "@/components/CopyButton";

export default function ResultsPage() {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showRisk, setShowRisk] = useState(false);

  async function runAnalysis(rewriteStyle?: string) {
    try {
      setLoading(true);
      setError("");

      const content = sessionStorage.getItem("conversation");
      const type = sessionStorage.getItem("type");
      const goal = sessionStorage.getItem("goal");

      if (!content || !type || !goal) {
        setError("Missing conversation context");
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

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (loading || !data) return <p className="p-6">Analyzing conversation…</p>;

  return (
    <main className="min-h-screen bg-gray-50 p-4 space-y-6 max-w-2xl mx-auto">

      {/* WHAT’S HAPPENING */}
      <Section title="What’s happening">
        <p className="text-base leading-relaxed">
          {truncate(data.summary, 2)}
        </p>
      </Section>

      {/* RISK (COLLAPSIBLE) */}
      {data.risk && (
        <Section title="Potential Risk">
          <button
            onClick={() => setShowRisk(!showRisk)}
            className="text-sm text-blue-600 mb-2"
          >
            {showRisk ? "Hide risk ▲" : "Show risk ▼"}
          </button>

          {showRisk && (
            <p className="text-base leading-relaxed">
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

        {/* PRIMARY ACTION */}
        <button
          onClick={() => navigator.clipboard.writeText(data.best_reply)}
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
          className={`text-sm px-3 py-1 rounded-full border
            ${
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
   SECTION COMPONENT
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
