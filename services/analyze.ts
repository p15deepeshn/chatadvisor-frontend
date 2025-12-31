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
    },
    body: JSON.stringify({
      content,
      conversation_type: conversationType,
      goal,
      rewrite_style: rewriteStyle ?? null,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze conversation");
  }

  return response.json();
}
