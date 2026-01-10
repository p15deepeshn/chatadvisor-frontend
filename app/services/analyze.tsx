export async function analyzeConversation(
  content: string,
  type: string,
  goal: string,
  rewriteStyle?: string
) {
  const res = await fetch(
    "https://chatadvisor-backend.onrender.com/analyze",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        conversation_type: type,
        goal,
        rewrite_style: rewriteStyle || null, // ✅ KEY LINE
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to analyze conversation");
  }

  return res.json();
}
