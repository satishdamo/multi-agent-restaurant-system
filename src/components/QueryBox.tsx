import { useState } from "react";

interface QueryBoxProps {
  onSubmit: (query: string) => void;
}

function QueryBox({ onSubmit }: QueryBoxProps) {
  const [query, setQuery] = useState<string>("");

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query);
      setQuery("");
    }
  };

  return (
    <div className="card">
      <h2>💬 Submit a Query</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query..."
        style={{ width: "80%", padding: "10px", marginRight: "10px" }}
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
}

export default QueryBox;
