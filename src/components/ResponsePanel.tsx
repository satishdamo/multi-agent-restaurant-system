interface ResponsePanelProps {
  response: string;
}

function ResponsePanel({ response }: ResponsePanelProps) {
  const agentMatch = response.match(/Supervisor decision:\s*(\w+)/i);
  const agent = agentMatch ? agentMatch[1].toLowerCase() : null;

  return (
    <div className="card">
      <h2>Supervisor Response</h2>
      {agent && (
        <span className={`agent-badge ${agent}`}>{agent.toUpperCase()}</span>
      )}
      <pre style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}>
        {response}
      </pre>
    </div>
  );
}

export default ResponsePanel;
