import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm your WhatsApp AI assistant. How can I help you today?",
      escalated: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      * { box-sizing: border-box; }
      body { margin: 0; background: linear-gradient(135deg, #0f1923 0%, #0d2b3e 60%, #0f2318 100%); min-height: 100vh; }

      @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes popIn {
        0% { transform: scale(0.85); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes blink {
        0%, 100% { opacity: 0.2; transform: translateY(0px); }
        50% { opacity: 1; transform: translateY(-3px); }
      }
      .dot1 { animation: blink 1.2s infinite 0s; display: inline-block; }
      .dot2 { animation: blink 1.2s infinite 0.2s; display: inline-block; }
      .dot3 { animation: blink 1.2s infinite 0.4s; display: inline-block; }

      .quick-btn:hover {
        background: #25D366 !important;
        color: #fff !important;
        transform: translateY(-2px);
      }
      .send-btn:hover {
        transform: scale(1.08);
        box-shadow: 0 4px 20px rgba(37,211,102,0.5);
      }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading || escalated) return;
    const userMessage = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history }),
      });
      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply, escalated: data.escalated }]);
        if (data.escalated) setEscalated(true);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") sendMessage(); };

  const resetChat = () => {
    setMessages([{ role: "assistant", content: "👋 Hi! I'm your WhatsApp AI assistant. How can I help you today?" }]);
    setEscalated(false);
    setInput("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Top Nav */}
        <div style={styles.nav}>
          <Link href="/" style={styles.backBtn}>← Back</Link>
          <div style={styles.navCenter}>
            <span style={styles.navDot}></span> Live
          </div>
        </div>

        {/* Title */}
        <div style={styles.titleSection}>
          <h1 style={styles.title}>🤖 AI Chatbot</h1>
          <p style={styles.subtitle}>WhatsApp-powered customer support</p>
        </div>

        {/* Chat Card */}
        <div style={styles.chatCard}>

          {/* Chat Header */}
          <div style={styles.chatHeader}>
            <div style={styles.avatarWrap}>
              <span style={styles.avatarEmoji}>🤖</span>
              <span style={styles.onlineDot}></span>
            </div>
            <div style={styles.headerInfo}>
              <div style={styles.botName}>WhatsApp Support Bot</div>
              <div style={styles.botStatus}>
                {escalated ? "🔴 Escalated to Human" : "🟢 Online · replies instantly"}
              </div>
            </div>
            <button onClick={resetChat} style={styles.resetBtn}>↺ New Chat</button>
          </div>

          {/* Messages Area */}
          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div key={index} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", animation: "fadeSlideIn 0.3s ease" }}>
                {msg.role === "assistant" && (
                  <div style={styles.botAvatar}>🤖</div>
                )}
                <div style={msg.role === "user" ? styles.userBubble : msg.escalated ? styles.escalatedBubble : styles.botBubble}>
                  {msg.content}
                 <div style={styles.timestamp}>
  {msg.time}
</div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={styles.botAvatar}>🤖</div>
                <div style={styles.typingBubble}>
                  <span className="dot1">●</span>{" "}
                  <span className="dot2">●</span>{" "}
                  <span className="dot3">●</span>
                </div>
              </div>
            )}

            {escalated && (
              <div style={styles.escalatedBanner}>
                🧑‍💼 Connected to human agent · Chat paused
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          {!escalated && (
            <div style={styles.quickReplies}>
              {["Working hours", "Track order", "Return policy", "Speak to human"].map((q) => (
                <button key={q} className="quick-btn" onClick={() => setInput(q)} style={styles.quickBtn}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div style={styles.inputArea}>
            <input
              type="text"
              placeholder={escalated ? "Chat paused — escalated to human" : "Type a message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={escalated || loading}
              style={escalated ? styles.inputDisabled : styles.input}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={escalated || loading}
              style={escalated || loading ? styles.sendDisabled : styles.sendBtn}
            >
              ➤
            </button>
          </div>

        </div>

        {/* Footer */}
        <p style={styles.footer}>Powered by Groq AI · WhatsApp CRM</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f1923 0%, #0d2b3e 60%, #0f2318 100%)",
    padding: "20px",
  },
  container: {
    maxWidth: "680px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', sans-serif",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  backBtn: {
    color: "#25D366",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    padding: "6px 14px",
    border: "1px solid rgba(37,211,102,0.3)",
    borderRadius: "20px",
    transition: "0.2s",
  },
  navCenter: {
    color: "#25D366",
    fontSize: "13px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  navDot: {
    width: "8px",
    height: "8px",
    background: "#25D366",
    borderRadius: "50%",
    display: "inline-block",
    boxShadow: "0 0 8px #25D366",
  },
  titleSection: {
    marginBottom: "24px",
  },
  title: {
    fontSize: "32px",
    color: "#fff",
    margin: "0 0 6px",
    fontWeight: "700",
  },
  subtitle: {
    color: "#7fb5a0",
    margin: 0,
    fontSize: "15px",
  },
  chatCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    overflow: "hidden",
    backdropFilter: "blur(12px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },
  chatHeader: {
    background: "linear-gradient(90deg, #128C7E, #075E54)",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  avatarWrap: {
    position: "relative",
    width: "44px",
    height: "44px",
  },
  avatarEmoji: {
    fontSize: "36px",
    lineHeight: "44px",
  },
  onlineDot: {
    position: "absolute",
    bottom: "0",
    right: "0",
    width: "12px",
    height: "12px",
    background: "#25D366",
    borderRadius: "50%",
    border: "2px solid #128C7E",
    boxShadow: "0 0 6px #25D366",
  },
  headerInfo: {
    flex: 1,
  },
  botName: {
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
  },
  botStatus: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "12px",
    marginTop: "2px",
  },
  resetBtn: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "6px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
  messages: {
    padding: "20px",
    height: "400px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    background: "rgba(0,0,0,0.2)",
  },
  botAvatar: {
    fontSize: "22px",
    marginRight: "8px",
    alignSelf: "flex-end",
    marginBottom: "4px",
  },
  botBubble: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "4px 18px 18px 18px",
    maxWidth: "72%",
    fontSize: "14px",
    lineHeight: "1.5",
    backdropFilter: "blur(8px)",
  },
  userBubble: {
    background: "linear-gradient(135deg, #25D366, #128C7E)",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "18px 4px 18px 18px",
    maxWidth: "72%",
    fontSize: "14px",
    lineHeight: "1.5",
    boxShadow: "0 4px 12px rgba(37,211,102,0.25)",
  },
  escalatedBubble: {
    background: "rgba(255,193,7,0.15)",
    border: "1px solid rgba(255,193,7,0.4)",
    color: "#ffd54f",
    padding: "12px 16px",
    borderRadius: "4px 18px 18px 18px",
    maxWidth: "72%",
    fontSize: "14px",
  },
  timestamp: {
    fontSize: "10px",
    opacity: 0.5,
    marginTop: "6px",
    textAlign: "right",
  },
  typingBubble: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "4px 18px 18px 18px",
    fontSize: "18px",
    letterSpacing: "2px",
  },
  escalatedBanner: {
    textAlign: "center",
    background: "rgba(255,193,7,0.1)",
    border: "1px solid rgba(255,193,7,0.3)",
    color: "#ffd54f",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "13px",
  },
  quickReplies: {
    display: "flex",
    gap: "8px",
    padding: "12px 20px",
    flexWrap: "wrap",
    background: "rgba(0,0,0,0.15)",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  quickBtn: {
    background: "rgba(37,211,102,0.1)",
    border: "1px solid rgba(37,211,102,0.4)",
    color: "#25D366",
    padding: "6px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "0.2s",
  },
  inputArea: {
    display: "flex",
    padding: "14px 16px",
    gap: "10px",
    background: "rgba(0,0,0,0.2)",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "12px 18px",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  inputDisabled: {
    flex: 1,
    padding: "12px 18px",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(255,255,255,0.03)",
    color: "#555",
    fontSize: "14px",
  },
  sendBtn: {
    background: "linear-gradient(135deg, #25D366, #128C7E)",
    color: "#fff",
    border: "none",
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0 4px 14px rgba(37,211,102,0.3)",
    transition: "0.2s",
    flexShrink: 0,
  },
  sendDisabled: {
    background: "rgba(255,255,255,0.1)",
    color: "#555",
    border: "none",
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    cursor: "not-allowed",
    fontSize: "16px",
    flexShrink: 0,
  },
  footer: {
    textAlign: "center",
    color: "rgba(255,255,255,0.2)",
    fontSize: "12px",
    marginTop: "20px",
  },
};