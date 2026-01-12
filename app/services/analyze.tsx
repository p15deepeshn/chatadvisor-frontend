import { AnalysisResult } from "@/types/analysis";

const API_URL = "https://chatadvisor-backend.onrender.com/analyze";

export async function analyzeConversation(
  content: string,
  conversationType: string,
  goal: string,
  rewriteStyle?: string
): Promise<AnalysisResult> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content,
      conversation_type: conversationType,
      goal,
      rewrite_style: rewriteStyle ?? null,
    }),
  });

  if (!res.ok) {
    throw new Error("Analysis failed");
  }

  return res.json();
}
