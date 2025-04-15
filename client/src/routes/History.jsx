import { useEffect, useState } from "react";
import { ClipboardCopy } from "lucide-react"; 
import "./css/History.css";

export default function History() {
  const [charts, setCharts] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null); // ✅ copy state

  useEffect(() => {
    fetch("http://localhost:4600/api/history")
      .then((res) => res.json())
      .then(setCharts);
  }, []);

  const handleCopy = (url, index) => {
    navigator.clipboard.writeText(`http://localhost:4600${url}`);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500); 
  };

  return (
    <div className="history-page">
      <h1 className="history-title">Your Chart History</h1>

      <div className="history-list">
        {charts.map((c, i) => (
          <div className="history-card" key={i}>
            <div className="card-row">
              <span className="label">Language:</span>
              <span className="value">
                {c.language?.charAt(0).toUpperCase() + c.language.slice(1)}
              </span>
            </div>
            <div className="card-row">
              <span className="label">Plot Engine:</span>
              <span className="value">
                {c.engine?.charAt(0).toUpperCase() + c.engine.slice(1) || "Unknown"}
              </span>
            </div>
            <div className="card-row">
              <span className="label">Share Link:</span>
              <div className="copy-row">
                <a
                  href={`http://localhost:4600${c.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-link"
                >
                  View Chart
                </a>
                <button
                  className="copy-button"
                  onClick={() => handleCopy(c.url, i)}
                  title="Copy Link"
                >
                  <ClipboardCopy size={16} />
                </button>
                {copiedIndex === i && <span className="copied-label">Copied!</span>}
              </div>
            </div>
          </div>
        ))}
        {charts.length === 0 && (
          <p className="history-empty">No charts found.</p>
        )}
      </div>
    </div>
  );
}
