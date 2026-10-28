
import "../scan/scanrepo.css";
import { useNavigate } from "react-router-dom";
import {updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:8081" : "");

function VulnScan() {
  const [repoUrl, setRepoUrl] = useState("");
  const [scanResult, setScanResult] = useState(null);

   const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  useEffect(() => {
        if (!auth || !db) {
            setUserName('Guest');
            return;
        }

        const fetchUserName = async () => {
            try {
                const user = auth.currentUser;

                if (user) {
                    const userDocRef = doc(db, 'user', user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        setUserName(userData.name || 'User'); // Fallback if name not found
                    } else {
                        console.error('No such user document!');
                        setUserName('User');
                    }
                } else {
                    console.error('No user is currently logged in');
                    setUserName('Guest');
                }
            } catch (error) {
                console.error('Error fetching user name:', error);
                setUserName('User');
            }
        };

        fetchUserName();
    }, []);

  const scanRepository = async () => {
    const url = repoUrl.trim();
    if (!url.startsWith("https://github.com/")) {
      alert("Please enter a valid GitHub repository URL");
      return;
    }

    if (!API_BASE_URL) {
      alert("Scanning requires a deployed backend. Configure REACT_APP_API_BASE_URL.");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await fetch(`${API_BASE_URL}/api/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url }),
      });

      if (!response.ok) throw new Error("Scan failed");

      const vulnerabilities = await response.json();

      const result = {
        repo: url,
        date: new Date().toLocaleString(),
        status: "Success",
        vulns: vulnerabilities,
        user: userName,
      };

      setScanResult(result);

      if (auth && db && auth.currentUser) {
        const userRef = doc(db, "user", auth.currentUser.uid);
        await updateDoc(userRef, {
          scans: arrayUnion(result),
        });
      } else {
        console.warn("User not logged in. Skipping Firebase write.");
      }
    } catch (error) {
      console.error("Error scanning repository:", error);
      alert("Scan failed. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const triggerQuickScan = () => {
    alert("Quick Scan initiated!");
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "red";
      case "moderate":
        return "orange";
      case "low":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <div className="container">
      <header>
        <h1>GitHub Repository Scanner</h1>
        <div className="actions">
          <button onClick={triggerQuickScan}>Quick Scan</button>
          <a href="/">Logout</a>
        </div>
      </header>

      <div className="main">
        <aside className="sidebar">
          <nav>
            <button onClick={() => navigate("/landing")}>Home</button>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/history")}>Scan History</button>
          </nav>
        </aside>

        <main className="content">
          <h1>Welcome, {userName}</h1>
          <div className="scan-box">
            <h2>Scan a GitHub Repository</h2>
            <input
              type="text"
              placeholder="https://github.com/user/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <button onClick={scanRepository}>Scan Now</button>
          </div>

          {loading && <div className="loader"></div>} {/* Loader when scanning */}

          {scanResult && !loading && (
            <div className="result-box">
              <h2>Scan Results</h2>
              <p><strong>Repository:</strong> {scanResult.repo}</p>
              <p><strong>Status:</strong> {scanResult.status}</p>

              {scanResult.vulns.length === 0 ? (
                <p>No vulnerabilities found 🎉</p>
              ) : (
                <table className="vuln-table">
                  <thead>
                    <tr>
                      <th>Package</th>
                      <th>State</th>
                      <th>Severity</th>
                      <th>GHSA ID</th>
                      <th>Created At</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanResult.vulns.map((vuln, index) => (
                      <tr key={index}>
                        <td>{vuln.packageName || vuln.dependency?.package?.name || "N/A"}</td>
                        <td>{vuln.state || "N/A"}</td>
                        <td style={{ color: getSeverityColor(vuln.security_advisory?.severity) }}>
                          {vuln.security_advisory?.severity || "N/A"}
                        </td>
                        <td>{vuln.security_advisory?.ghsa_id || "N/A"}</td>
                        <td>{vuln.created_at || "N/A"}</td>
                        <td>{vuln.security_advisory?.description?.slice(0, 100) || "No description"}...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <p><strong>Scanned On:</strong> {scanResult.date}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default VulnScan;
