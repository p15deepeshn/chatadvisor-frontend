import { AnalysisResult } from "@/types/analysis";

const API_URL = "https://chatadvisor-backend.onrender.com/analyze";

export async function analyzeConversation(
  content: string,
  conversationType: string,
  goal: string,
  rewriteStyle?: string | null
): Promise<AnalysisResult> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store", // important: avoid stale replies
    },
    body: JSON.stringify({
      content,
      conversation_type: conversationType,
      goal,
      rewrite_style: rewriteStyle ?? null,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to analyze conversation");
  }

  const data = (await response.json()) as AnalysisResult;
  return data;
}
