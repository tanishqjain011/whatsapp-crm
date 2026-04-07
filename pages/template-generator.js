import { useState } from "react";
import Link from "next/link";

export default function TemplateGenerator() {
  const [purpose, setPurpose] = useState("");
  const [category, setCategory] = useState("Marketing");
  const [template, setTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateTemplate = async () => {
    if (!purpose.trim()) {
      alert("Please enter a purpose!");
      return;
    }

    setLoading(true);
    setTemplate("");

    try {
      const response = await fetch("/api/generate-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose, category }),
      });

      const data = await response.json();
      if (data.template) {
        setTemplate(data.template);
      } else {
        alert("Error generating template.");
      }
    } catch (error) {
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Link href="/" style={styles.backBtn}>← Back</Link>
        <h1 style={styles.title}>✨ AI Template Generator</h1>
        <p style={styles.subtitle}>Create WhatsApp-ready messages instantly</p>
      </div>

      {/* Input Card */}
      <div style={styles.card}>
        <label style={styles.label}>📝 Message Purpose</label>
        <input
          type="text"
          placeholder="e.g. Reminder for appointment tomorrow"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>📂 Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option>📣 Marketing</option>
          <option>🔧 Utility</option>
          <option>🔐 Authentication</option>
        </select>

        <button
          onClick={generateTemplate}
          disabled={loading}
          style={loading ? styles.btnDisabled : styles.btn}
        >
          {loading ? "⏳ Generating..." : "🚀 Generate Template"}
        </button>
      </div>

      {/* Output */}
      {template && (
        <div style={styles.card}>
          <div style={styles.outputHeader}>
            <h3>📱 Generated Template</h3>

            <button onClick={copyToClipboard} style={styles.copyBtn}>
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>

          <div style={styles.chatBubble}>
            {template}
          </div>

          <p style={styles.hint}>
            💡 Variables like {"{{1}}"} will be dynamically replaced
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "sans-serif",
    minHeight: "100vh",
    padding: "30px 20px",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "white",
  },

  header: {
    marginBottom: "30px",
  },

  backBtn: {
    color: "#25D366",
    textDecoration: "none",
  },

  title: {
    fontSize: "32px",
    margin: "10px 0",
  },

  subtitle: {
    color: "#ccc",
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "20px",
    transition: "0.3s",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "10px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "15px",
    outline: "none",
    fontSize: "14px",
  },

  select: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "20px",
    fontSize: "14px",
  },

  btn: {
    background: "linear-gradient(45deg, #25D366, #128C7E)",
    border: "none",
    padding: "14px",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    width: "100%",
    transition: "0.3s",
  },

  btnDisabled: {
    background: "#555",
    padding: "14px",
    borderRadius: "10px",
    color: "white",
    cursor: "not-allowed",
    width: "100%",
  },

  outputHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  copyBtn: {
    background: "#25D366",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    transition: "0.3s",
  },

  chatBubble: {
    background: "#25D366",
    color: "white",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "15px",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    marginBottom: "10px",
    animation: "fadeIn 0.5s ease-in-out",
  },

  hint: {
    color: "#ccc",
    fontSize: "13px",
  },
};