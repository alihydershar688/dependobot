import React, { useState, useEffect } from "react";
import "./history.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:8081" : "");

export default function ScanHistory() {
  const [alerts, setAlerts] = useState([]);
  const [expandedAlertId, setExpandedAlertId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadError, setLoadError] = useState("");
  const navigate = useNavigate();
  // Fetch alerts from the backend API
  useEffect(() => {
    if (!API_BASE_URL) {
      setLoadError("Alert history requires a deployed backend API.");
      return;
    }

    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dependabot-alerts`);
        if (!response.ok) {
          throw new Error(`Failed to fetch alerts: ${response.status}`);
        }
        const data = await response.json();
        setAlerts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching alerts:", error);
        setLoadError("Could not load alerts from the backend API.");
      }
    };

    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.repoUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.severity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.state.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const toggleExpand = (id) => {
    setExpandedAlertId((prev) => (prev === id ? null : id));
  };

 

  const renderVulnerabilitySummary = (alert) => {
    if (!alert.securityAdvisory) return null;

    const severityClass =
      alert.severity === "critical" ? "severity-critical" : "severity-safe";

    return (
      <div className={`vulnerability-summary ${severityClass}`}>
        <span>{alert.securityAdvisory.description}</span>
      </div>
    );
  };

  return (
    <div className="history">
      <div className="sidebar_dash">
        <h1>VulnScan</h1>
        <nav>
          <button onClick={() => navigate("/landing")}>Home</button>
          
          <button onClick={() => navigate("/history")}>Scan History</button>
          <button onClick={() => navigate("/scanrepo")}>Quick Scan</button>
        </nav>
      </div>

      <div className="scan-history-container">
        <header className="scan-history-header">
          <h1>Dependabot Alerts History </h1>
          <p>View security vulnerability alerts for your repositories</p>
        </header>

        <div className="controls-container">
          <input
            type="text"
            placeholder="Search by repository, severity or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

         
        </div>

        <div className="scan-list-container">
          {loadError ? (
            <div className="no-results">
              <p>{loadError}</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="no-results">
              <p>No alerts found matching your criteria</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className="scan-item">
                <div
                  className="scan-item-header"
                  onClick={() => toggleExpand(alert.id)}
                >
                  <div className="scan-item-main">
                    <strong>{alert.repoUrl}</strong>{" "}
                    <span>{alert.severity}</span>
                  </div>
                  <div className="scan-item-meta">
                    {renderVulnerabilitySummary(alert)}
                  </div>
                </div>

                {expandedAlertId === alert.id && (
                  <div className="scan-item-details">
                    <div className="details-section">
                      <h4>Alert Details</h4>
                      <p>
                        <strong>Repository:</strong> {alert.repoUrl}
                      </p>
                      <p>
                        <strong>State:</strong> {alert.state}
                      </p>
                      <p>
                        <strong>Severity:</strong> {alert.severity}
                      </p>
                      <p>
                        <strong>Package:</strong> {alert.packageName}
                      </p>
                      <p>
                        <strong>Ecosystem:</strong> {alert.ecosystem}
                      </p>
                      <p>
                        <strong>Description:</strong> {alert.description}
                      </p>
                      <p>
                        <strong>GHSA ID:</strong> {alert.ghsa_id}
                      </p>
                      <p>
                        <strong>CVE ID:</strong> {alert.cve_id}
                      </p>
                      <p>
                        <strong>Fixed In Version:</strong>{" "}
                        {alert.fixedInVersion}
                      </p>
                      <p>
                        <strong>Created At:</strong> {alert.created_at}
                      </p>
                      <p>
                        <strong>Updated At:</strong> {alert.updated_at}
                      </p>
                      <p>
                        <strong>Dismissed At:</strong> {alert.dismissedAt}
                      </p>
                      <p>
                        <strong>Alert URL:</strong>{" "}
                        <a
                          href={alert.alertUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {alert.alertUrl}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
