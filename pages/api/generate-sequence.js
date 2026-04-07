import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are a WhatsApp CRM automation expert. Generate a message sequence based on this goal:

"${prompt}"

Return ONLY a valid JSON array, no explanation, no markdown, no backticks. Example format:
[
  { "step": 1, "delay": "Immediately", "message": "Hi {{1}}, welcome! We're glad to have you." },
  { "step": 2, "delay": "After 1 day", "message": "Hey {{1}}, just checking in. Need any help?" },
  { "step": 3, "delay": "After 3 days", "message": "Hi {{1}}, here's a tip to get started: {{2}}" }
]

Rules:
- Generate 3 to 5 steps
- Use {{1}}, {{2}} for variables
- Delays should be realistic (Immediately, After 1 hour, After 1 day, After 3 days, etc.)
- Messages should be short and conversational
- Return ONLY the JSON array, nothing else`,
        },
      ],
      max_tokens: 1024,
    });

    const raw = completion.choices[0].message.content;

    // Clean and parse JSON
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const sequence = JSON.parse(cleaned);

    return res.status(200).json({ sequence });
  } catch (error) {
    console.error("Full error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate sequence" });
  }
}