import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { purpose, category } = req.body;

  if (!purpose || !category) {
    return res.status(400).json({ error: "Purpose and category are required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are a WhatsApp Business template expert. Generate a professional WhatsApp message template with the following details:

Purpose: ${purpose}
Category: ${category}

Rules:
- Use {{1}}, {{2}}, {{3}} for dynamic variables
- Keep it concise and professional
- Follow WhatsApp Business template guidelines
- For Marketing: include a clear CTA
- For Utility: be informative and clear
- For Authentication: be brief and secure

Return ONLY the template text, nothing else. No explanations.`,
        },
      ],
      max_tokens: 1024,
    });

    const template = completion.choices[0].message.content;
    return res.status(200).json({ template });
  } catch (error) {
    console.error("Full error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate template" });
  }
}