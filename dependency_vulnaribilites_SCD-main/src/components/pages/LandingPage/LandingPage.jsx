import React from "react";
import "./landingpage.css";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
  const navigate = useNavigate();
  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:8080/api/auth/github";
};

  return (
    <div>
      <header>
        <div className="logo">
          <i className="fas fa-shield-alt"></i> VulnScan
        </div>
        <div className="login">
          <a href="/">Login</a>
        </div>
      </header>

      <main>
        <h1>Secure Your Dependencies</h1>
        <p>Scan your GitHub repositories for vulnerabilities in seconds.</p>

        <div className="buttons">
          <button onClick={() => navigate("/scanrepo")}>Scan a Repo</button>
          <button onClick={() => navigate("/dashboard")}>View Dashboard</button>
        </div>

        <div className="features">
          <div className="feature">
            <h2>Quick Scans</h2>
            <p>Analyze your repositories in seconds.</p>
          </div>
          <div className="feature">
            <h2>Detailed Reports</h2>
            <p>Get comprehensive vulnerability insights.</p>
          </div>
         
        </div>
      </main>

      <footer>© 2025 VulnScan. All rights reserved.</footer>
    </div>
  );
};

export default LandingPage;