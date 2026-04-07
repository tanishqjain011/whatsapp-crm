import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Simple knowledge base
const knowledgeBase = [
  { question: "what are your working hours", answer: "We're available Monday to Friday, 9 AM to 6 PM." },
  { question: "working hours", answer: "We're available Monday to Friday, 9 AM to 6 PM." },
  { question: "how do i track my order", answer: "You can track your order by visiting our website and entering your order ID." },
  { question: "track order", answer: "You can track your order by visiting our website and entering your order ID." },
  { question: "return policy", answer: "We have a 30-day return policy. Items must be unused and in original packaging." },
  { question: "how to return", answer: "We have a 30-day return policy. Items must be unused and in original packaging." },
  { question: "contact support", answer: "You can reach our support team at support@company.com or call +1-800-000-0000." },
  { question: "speak to human", answer: "ESCALATE" },
  { question: "talk to human", answer: "ESCALATE" },
  { question: "human support", answer: "ESCALATE" },
  { question: "agent", answer: "ESCALATE" },
];

function checkKnowledgeBase(message) {
  const lower = message.toLowerCase();
  for (const item of knowledgeBase) {
    if (lower.includes(item.question)) {
      return item.answer;
    }
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Check knowledge base first
  const kbAnswer = checkKnowledgeBase(message);

  if (kbAnswer === "ESCALATE") {
    return res.status(200).json({
      reply: "I'm connecting you to a human support agent now. Please wait a moment... 👨‍💼",
      escalated: true,
    });
  }

  if (kbAnswer) {
    return res.status(200).json({ reply: kbAnswer, escalated: false });
  }

  // AI fallback
  try {
    const messages = [
      {
        role: "system",
        content: `You are a friendly WhatsApp customer support chatbot. 
Keep responses short (2-3 sentences max). 
Be helpful, polite and conversational.
If you cannot help, suggest the user type "speak to human" to get human support.`,
      },
      ...(history || []),
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 256,
    });

    const reply = completion.choices[0].message.content;
    return res.status(200).json({ reply, escalated: false });
  } catch (error) {
    console.error("Full error:", error);
    return res.status(500).json({ error: error.message || "Failed to get response" });
  }
}