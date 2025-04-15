import "./css/Generate.css";
import { useState } from "react";
import axios from "axios";

export default function Generate() {
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [outputURL, setOutputURL] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setOutputURL(null);
    setError(null);

    try {
      const response = await axios.post("http://localhost:4600/api/visualize", {
        code,
        language: language.toLowerCase(), // ensure lowercase for backend
      });

      if (response.data?.url && response.data?.type) {
        setOutputURL({
          type: response.data.type,
          url: `http://localhost:4600${response.data.url}`,
        });
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="generate-page">
      <div className="generate-container">
        {/* Left Column - Controls + Code */}
        <div className="code-panel">
          <div className="code-controls">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="Python">Python</option>
              <option value="R">R</option>
            </select>
            <button onClick={handleGenerate}>Generate</button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Write your ${language} code here...`}
          />
        </div>

        {/* Right Column - Output / Image / HTML */}
        <div className="output-panel">
          {isLoading ? (
            <div className="spinner-container">
              <div className="spinner" />
            </div>
          ) : error ? (
            <p className="error">⚠️ {error}</p>
          ) : (
            outputURL?.type === "image" && (
              <img src={outputURL.url} alt="Visualization Output" />
            )
          )}
          {outputURL?.type === "html" && (
            <iframe
              src={outputURL.url}
              title="Interactive 3D Visualization"
              width="100%"
              height="500"
              frameBorder="0"
            />
          )}
          {!outputURL && !isLoading && (
            <p className="preview-placeholder">
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
