import { useState } from "react";
import "./App.css";

interface AgentResponse {
  agent: string;
  text: string;
}

interface Toast {
  id: number;
  message: string;
  agent: string;
}

function App() {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<AgentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const sampleQueries = [
    {
      text: "🍕 Can you suggest me healthy Italian dishes and order a pizza?",
    },
    {
      text: "🥗 Can you order me Hyderbad Briyani and suggest me some tasty side dishes?",
    },
    {
      text: "🛒 Check my order status and update me on the delivery timeline, may I know why it has taken long?",
    },
    { text: "🍲 Show today's special menu and order a dish" },
    { text: "⚠️ Report a complaint about delivery and order me a replacement" },
  ];

  const sendQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://satmultiagents.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data: { response: string } = await res.json();

      const matches = [
        ...data.response.matchAll(
          /(\w+)\s*Agent:\s*(.+?)(?=\n\w+\s*Agent:|$)/gs,
        ),
      ];
      const parsed = matches.map((m) => ({
        agent: m[1].toLowerCase(),
        text: m[2].trim(),
      }));
      setResponses(parsed);

      parsed.forEach((r) => {
        const newToast: Toast = {
          id: Date.now() + Math.random(),
          message: `Supervisor routed to: ${r.agent.toUpperCase()} AGENT`,
          agent: r.agent,
        };
        setToasts((prev) => [...prev, newToast]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, 5000);
      });
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearQuery = () => {
    setQuery("");
  };

  return (
    <div className="container">
      {/* Floating corner SVG icons */}
      <div className="corner-icon corner-top-left">
        <img src="/images/plate-svgrepo-com.svg" alt="Plate" />
      </div>
      <div className="corner-icon corner-top-right">
        <img src="/images/juice-svgrepo-com.svg" alt="Juice" />
      </div>
      <div className="corner-icon corner-bottom-left">
        <img src="/images/salad-svgrepo-com.svg" alt="Salad" />
      </div>
      <div className="corner-icon corner-bottom-right">
        <img src="/images/pizza-svgrepo-com.svg" alt="Pizza" />
      </div>

      <div className="sticky-top">
        <header className="header">
          <h1>🤖🍽️ Multi‑Agentic Restaurant Assistant</h1>
          <p>Serving smart orchestration with LangGraph</p>
        </header>

        <section className="query-section">
          <h2>💬 Submit a Query</h2>
          <div className="query-box">
            <textarea
              aria-label="Query input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🥘 Ask: 'Suggest dishes and check my order status'"
            />
            <div className="query-actions">
              <button
                aria-label="Send query"
                onClick={sendQuery}
                disabled={loading}
                className="send-btn"
              >
                {loading ? "🍕 Preparing..." : "🍴 Send"}
              </button>
              <button
                aria-label="Clear query"
                className="clear-btn"
                onClick={clearQuery}
              >
                ❌ Clear
              </button>
            </div>
          </div>

          {/* Sample Queries as Cards */}
          <div className="sample-cards">
            {sampleQueries.map((q, i) => (
              <div
                key={i}
                className="sample-card"
                onClick={() => setQuery(q.text)}
              >
                <p>{q.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="response-section">
        {responses.length > 0 && <h2>Supervisor Response</h2>}
        <div className="agent-grid">
          {responses.map((r, i) => (
            <div key={i} className={`agent-card ${r.agent} glow`}>
              <div className="agent-header">
                <span className={`agent-badge ${r.agent}`}>
                  {r.agent === "menu" && "🍲 MENU AGENT"}
                  {r.agent === "ordering" && "🛒 ORDERING AGENT"}
                  {r.agent === "grievance" && "⚠️ GRIEVANCE AGENT"}
                </span>
              </div>
              <pre className="agent-text">{r.text}</pre>
            </div>
          ))}
        </div>
      </section>

      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.agent} fade-in`}>
            {toast.agent === "menu" && "🍲 "}
            {toast.agent === "ordering" && "🛒 "}
            {toast.agent === "grievance" && "⚠️ "}
            {toast.message}
          </div>
        ))}
      </div>

      <footer className="footer">
        <p>🍕 Powered by LangGraph • Restaurant AI Assistant 🍴</p>
      </footer>
    </div>
  );
}

export default App;
