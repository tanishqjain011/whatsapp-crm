import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [hovered, setHovered] = useState(null);

  const cards = [
    {
      id: 1,
      title: "✨ Template Generator",
      desc: "Generate WhatsApp message templates using AI",
      link: "/template-generator",
    },
    {
      id: 2,
      title: "🔁 Sequence Generator",
      desc: "Create automated message sequences",
      link: "/sequence-generator",
    },
    {
      id: 3,
      title: "🤖 AI Chatbot",
      desc: "Chat with an AI-powered WhatsApp bot",
      link: "/chatbot",
    },
  ];

  return (
    <div style={container}>
      <h1 style={title}>📱 WhatsApp AI CRM</h1>
      <p style={subtitle}>Automate. Engage. Convert.</p>

      <div style={grid}>
        {cards.map((card) => (
          <Link href={card.link} key={card.id} style={{ textDecoration: "none" }}>
            <div
              style={{
                ...cardStyle,
                transform:
                  hovered === card.id
                    ? "translateY(-10px) scale(1.05)"
                    : "scale(1)",
                boxShadow:
                  hovered === card.id
                    ? "0 20px 40px rgba(0,0,0,0.2)"
                    : "0 8px 20px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <h2 style={cardTitle}>{card.title}</h2>
              <p style={cardDesc}>{card.desc}</p>

              <button style={button}>Open →</button>
            </div>
          </Link>
        ))}
      </div>
      <div style={ownerTag}>
  owner : tanishqjain3526@gmail.com
</div>
    </div>
  );
}

const container = {
  fontFamily: "sans-serif",
  minHeight: "100vh",
  padding: "40px",
  background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  textAlign: "center",
};

const title = {
  color: "#25D366",
  fontSize: "42px",
  marginBottom: "10px",
  animation: "fadeIn 1s ease-in-out",
};

const subtitle = {
  color: "#ddd",
  marginBottom: "50px",
};

const grid = {
  display: "flex",
  gap: "30px",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "stretch", // ✅ ADD THIS
};

const cardStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "20px",
  padding: "30px",
  width: "260px",
  minHeight: "230px", // ✅ ADD THIS
  cursor: "pointer",
  transition: "all 0.4s ease",
  color: "white",

  display: "flex",              // ✅ ADD THIS
  flexDirection: "column",      // ✅ ADD THIS
  justifyContent: "space-between", // ✅ ADD THIS
};

const cardTitle = {
  marginBottom: "12px",
};

const cardDesc = {
  fontSize: "14px",
  marginBottom: "20px",
  color: "#ccc",
};

const button = {
  background: "linear-gradient(45deg, #25D366, #128C7E)",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "0.3s",
};

const ownerTag = {
  position: "fixed",
  bottom: "15px",
  right: "20px",
  fontSize: "12px",
  color: "#ccc",
  background: "rgba(255,255,255,0.1)",
  padding: "6px 12px",
  borderRadius: "8px",
  backdropFilter: "blur(6px)",
};