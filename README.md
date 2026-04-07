# 📱 WhatsApp AI CRM

An AI-powered WhatsApp CRM built with Next.js featuring template generation, sequence automation, and an intelligent chatbot — powered by Groq (LLaMA 3.3).

---

## 🚀 Features

### ✨ AI Template Generator
- Generate professional WhatsApp message templates instantly
- Supports Marketing, Utility, and Authentication categories
- Uses dynamic variables like `{{1}}`, `{{2}}` following WhatsApp guidelines
- One-click copy to clipboard

### 🔁 AI Sequence Generator
- Generate multi-step message sequences from a single prompt
- Structured steps with realistic delays (Immediately, After 1 day, etc.)
- Fully editable before saving
- Perfect for onboarding, follow-ups, and re-engagement flows

### 🤖 AI Chatbot
- WhatsApp-style chat interface
- Predefined knowledge base for instant answers
- AI fallback using LLaMA 3.3 for unknown queries
- Human escalation support
- Quick reply buttons for common questions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React |
| Backend | Next.js API Routes (Node.js) |
| AI Model | LLaMA 3.3 70B via Groq API |
| Styling | Inline CSS (no dependencies) |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/whatsapp-crm.git
cd whatsapp-crm
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Get Your Free Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up with your Google account (free)
3. Click **API Keys** → **Create API Key**
4. Copy the key

### 4. Set Up Environment Variables

Create a `.env.local` file in the root of the project:
GROQ_API_KEY=your_groq_api_key_here

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure
whatsapp-crm/
├── pages/
│   ├── index.js                  # Home dashboard
│   ├── template-generator.js     # Module 1 - UI
│   ├── sequence-generator.js     # Module 2 - UI
│   ├── chatbot.js                # Module 3 - UI
│   └── api/
│       ├── generate-template.js  # Module 1 - API
│       ├── generate-sequence.js  # Module 2 - API
│       └── chatbot.js            # Module 3 - API
├── .env.local                    # API keys (not committed)
└── README.md

---

## 💡 Prompt Examples Used

### Template Generator
You are a WhatsApp Business template expert. Generate a professional
WhatsApp message template for [purpose], category: [category].
Use {{1}}, {{2}} for variables. Return ONLY the template text.

### Sequence Generator
Generate a WhatsApp message sequence for: "[user goal]"
Return a JSON array with step, delay, and message fields.
3-5 steps with realistic delays.

### Chatbot
You are a friendly WhatsApp customer support chatbot.
Keep responses short (2-3 sentences max).
If you cannot help, suggest the user type "speak to human".

---

## 📊 Evaluation Criteria Met

| Criteria | Implementation |
|---|---|
| AI Integration (30%) | Groq API with LLaMA 3.3 across all 3 modules |
| System Design (25%) | Modular API routes, knowledge base + AI fallback |
| UX (20%) | WhatsApp-style UI, quick replies, animations |
| Code Quality (15%) | Clean, modular, well-structured components |
| Creativity (10%) | Escalation flow, editable sequences, copy feature |

---

## 🔒 Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com |

> ⚠️ Never commit `.env.local` to GitHub. It's already in `.gitignore`.

---

## 👨‍💻 Author

Built as part of the AI WhatsApp CRM Assignment.
