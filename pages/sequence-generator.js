import { useState } from "react";
import Link from "next/link";

export default function SequenceGenerator() {
  const [prompt, setPrompt] = useState("");
  const [sequence, setSequence] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const generateSequence = async () => {
    if (!prompt.trim()) {
      alert("Please enter a goal!");
      return;
    }

    setLoading(true);
    setSequence([]);
    setSaved(false);

    try {
      const response = await fetch("/api/generate-sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.sequence) {
        setSequence(data.sequence);
      } else {
        alert("Error: " + (data.error || "Please try again."));
      }
    } catch (error) {
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  const updateMessage = (index, newMessage) => {
    const updated = [...sequence];
    updated[index].message = newMessage;
    setSequence(updated);
  };

  const saveSequence = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Link href="/" style={styles.backBtn}>← Back</Link>
        <h1 style={styles.title}>🔁 AI Sequence Generator</h1>
        <p style={styles.subtitle}>Automate your WhatsApp workflows</p>
      </div>

      {/* Input Card */}
      <div style={styles.card}>
        <label style={styles.label}>🎯 What is your goal?</label>
        <input
          type="text"
          placeholder="e.g. Follow up with a lead over 1 week"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={generateSequence}
          disabled={loading}
          style={loading ? styles.btnDisabled : styles.btn}
        >
          {loading ? "⏳ Generating..." : "🚀 Generate Sequence"}
        </button>
      </div>

      {/* Sequence */}
      {sequence.length > 0 && (
        <div>
          <h3 style={styles.sectionTitle}>📋 Your Sequence</h3>

          {sequence.map((step, index) => (
            <div key={index} style={styles.stepCard}>
              <div style={styles.stepHeader}>
                <span style={styles.stepBadge}>Step {step.step}</span>
                <span style={styles.delayBadge}>⏰ {step.delay}</span>
              </div>

              <textarea
                value={step.message}
                onChange={(e) => updateMessage(index, e.target.value)}
                style={styles.textarea}
                rows={3}
              />
            </div>
          ))}

          <button onClick={saveSequence} style={styles.saveBtn}>
            {saved ? "✅ Saved!" : "💾 Save Sequence"}
          </button>
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
    marginBottom: "30px",
    transition: "0.3s",
  },

  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "20px",
    outline: "none",
    fontSize: "14px",
    transition: "0.3s",
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

  sectionTitle: {
    marginBottom: "15px",
  },

  stepCard: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "15px",
    transition: "0.3s",
  },

  stepHeader: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },

  stepBadge: {
    background: "#25D366",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  delayBadge: {
    background: "#333",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    resize: "vertical",
    fontFamily: "sans-serif",
  },

  saveBtn: {
    background: "linear-gradient(45deg, #128C7E, #075E54)",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    color: "white",
    fontWeight: "600",
    width: "100%",
    marginTop: "10px",
    cursor: "pointer",
    transition: "0.3s",
  },
};