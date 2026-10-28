import React from 'react';
import '../dash/dashboard.css'; // Link your unchanged CSS here
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { supabase } from '../../../supabase';
import { apiFetch } from '../../../api';
const Dashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [alerts, setAlerts] = useState([]);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        let active = true;
        const loadDashboard = async () => {
            try {
                if (supabase) {
                    const { data: { user }, error } = await supabase.auth.getUser();
                    if (error) throw error;
                    if (active) {
                        setUserName(user?.user_metadata?.name || user?.email || 'Guest');
                    }
                }

                const response = await apiFetch('/api/dependabot-alerts');
                const data = await response.json();
                if (active) {
                    setAlerts(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Could not load dashboard data.', error);
                if (active) {
                    setLoadError(error.message || 'Could not load dashboard data.');
                }
            }
        };

        loadDashboard();
        return () => {
            active = false;
        };
    }, []);

    const repositorySummary = Object.values(alerts.reduce((summary, alert) => {
        const repository = alert.repoUrl || 'Unknown repository';
        const severity = (alert.severity || '').toLowerCase();
        if (!summary[repository]) {
            summary[repository] = { repository, critical: 0, high: 0, medium: 0, low: 0 };
        }
        if (severity === 'critical') summary[repository].critical += 1;
        if (severity === 'high') summary[repository].high += 1;
        if (severity === 'moderate' || severity === 'medium') summary[repository].medium += 1;
        if (severity === 'low') summary[repository].low += 1;
        return summary;
    }, {}));

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Could not sign out.', error);
            return;
        }
        navigate('/');
    };

    return (
        <div className="container">
            {/* Sidebar */}
            <div className="sidebar_dash">
                <h1>VulnScan</h1>
                <nav>
                    <button onClick={() => navigate('/landing')}>Home</button>
                    <button onClick={() => navigate('/repositories')}>Repositories</button>
                    <button onClick={() => navigate('/history')}>Scan History</button>
                    <button onClick={() => navigate('/scanrepo')}>Quick Scan</button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <div className="header">
                    <h2>Welcome back, {userName}!</h2>
                    <div>
                        <button className="quick-scan" onClick={() => navigate('/scanrepo')}>Quick Scan</button>
                        <button className="login" onClick={handleLogout}>Logout</button>
                    </div>
                </div>

                {loadError && <p role="alert">{loadError}</p>}

                {/* Stats */}
                <div className="stats">
                    <div className="stat">
                        <h3>Total Repositories</h3>
                        <p>{repositorySummary.length}</p>
                    </div>
                    <div className="stat">
                        <h3>Total Vulnerabilities</h3>
                        <p>{alerts.length}</p>
                    </div>
                    <div className="stat">
                        <h3>Critical Issues</h3>
                        <p>{alerts.filter((alert) => alert.severity?.toLowerCase() === 'critical').length}</p>
                    </div>
                </div>

                {/* Heatmap */}
                <div className="heatmap">
                    <div className="heatmap-chart">
                        <h3>Repository Vulnerability Heatmap</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Repository</th>
                                    <th>Critical</th>
                                    <th>High</th>
                                    <th>Medium</th>
                                    <th>Low</th>
                                </tr>
                            </thead>
                            <tbody>
                                {repositorySummary.map((summary) => (
                                    <tr key={summary.repository}>
                                        <td>{summary.repository}</td>
                                        <td className="bg-red">{summary.critical}</td>
                                        <td className="bg-orange">{summary.high}</td>
                                        <td className="bg-yellow">{summary.medium}</td>
                                        <td className="bg-green">{summary.low}</td>
                                    </tr>
                                ))}
                                {repositorySummary.length === 0 && (
                                    <tr><td colSpan="5">No scan results yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Scans */}
                <div className="recent-scans">
                    <h3>Recent Vulnerability Alerts</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Repository</th>
                                <th>Package</th>
                                <th>Severity</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.slice(0, 5).map((alert) => (
                                <tr key={alert.id}>
                                    <td>{alert.repoUrl}</td>
                                    <td>{alert.packageName || 'Unknown package'}</td>
                                    <td>{alert.severity || 'Unknown'}</td>
                                    <td>{alert.state || 'Unknown'}</td>
                                </tr>
                            ))}
                            {alerts.length === 0 && (
                                <tr><td colSpan="4">No vulnerability alerts yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;