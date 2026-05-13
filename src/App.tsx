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

      // Extract all agent responses
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

      // Toasts for each agent
      parsed.forEach((r) => {
        const newToast: Toast = {
          id: Date.now() + Math.random(),
          message: `Supervisor routed to: ${r.agent.toUpperCase()}`,
          agent: r.agent,
        };
        setToasts((prev) => [...prev, newToast]);

        // Auto-remove after 5s
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

  return (
    <div className="container">
      {/* Sticky wrapper for heading + query */}
      <div className="sticky-top">
        <header className="header">
          <h1>🤖 Multi‑Agentic Restaurant Assistant</h1>
          <p>Visualizing LangGraph orchestration system</p>
        </header>

        <section className="query-section">
          <h2>💬 Submit a Query</h2>
          <div className="query-box">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask something like: 'Suggest dishes and check my order status'"
            />
            <button onClick={sendQuery} disabled={loading}>
              {loading ? "Routing..." : "Send"}
            </button>
          </div>
        </section>
      </div>

      {/* Scrollable responses below sticky block */}
      <section className="response-section">
        {responses.length > 0 && <h2>Supervisor Response</h2>}
        <div className="agent-grid">
          {responses.map((r, i) => (
            <div key={i} className={`agent-card ${r.agent} glow`}>
              <div className="agent-header">
                <span className={`agent-badge ${r.agent}`}>
                  {r.agent.toUpperCase()}
                </span>
              </div>
              <pre className="agent-text">{r.text}</pre>
            </div>
          ))}
        </div>
      </section>

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.agent}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
