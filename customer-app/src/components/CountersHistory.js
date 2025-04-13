import React, { useState } from "react";
import axios from "axios";

function CountersHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const fetchCountersHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/counters-history",
      );
      setHistory(response.data);
      setShowHistory(true);
    } catch (error) {
      console.error("Error fetching counters history:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div
      style={{ textAlign: "center", marginTop: "20px", marginBottom: "50px" }}
    >
      <h1 style={{ marginBottom: "20px" }}>Counter Stats</h1>
      {!showHistory ? (
        <button
          onClick={fetchCountersHistory}
          style={{ padding: "10px", margin: "10px" }}
        >
          Show Counters History
        </button>
      ) : (
        <button
          onClick={toggleHistory}
          style={{ padding: "10px", margin: "10px" }}
        >
          Hide Counters History
        </button>
      )}

      {loading && <p>Loading...</p>}

      {showHistory && history.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <table
            style={{
              marginTop: "20px",
              maxWidth: "800px",
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#007bff", textAlign: "center" }}>
                <th style={{ padding: "10px" }}>Month</th>
                <th style={{ padding: "10px" }}>Year</th>
                <th style={{ padding: "10px" }}>166c</th>
                <th style={{ padding: "10px" }}>153c</th>
                <th style={{ padding: "10px" }}>011c</th>
                <th style={{ padding: "10px" }}>1600c</th>
                
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    textAlign: "center",
                  }}
                >
                  <td style={{ padding: "10px" }}>{entry.month}</td>
                  <td style={{ padding: "10px" }}>{entry.year}</td>
                  <td style={{ padding: "10px" }}>{entry["166c"]}</td>
                  <td style={{ padding: "10px" }}>{entry["153c"]}</td>
                  <td style={{ padding: "10px" }}>{entry["011c"]}</td>
                  <td style={{ padding: "10px" }}>{entry["1600c"]}</td>
              
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showHistory && !loading && history.length === 0 && (
        <p>Δεν υπάρχει διαθέσιμο ιστορικό.</p>
      )}
    </div>
  );
}

export default CountersHistory;
