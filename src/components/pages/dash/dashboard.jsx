import React from 'react';
import '../dash/dashboard.css'; // Link your unchanged CSS here
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { auth, db } from '../../../firebase';
const Dashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

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
                    <h2>Welcome back, ${userName}!</h2>
                    <div>
                        <button className="quick-scan" onClick={() => navigate('/scanrepo')}>Quick Scan</button>
                        <button className="login" onClick={() => navigate('/')}>Login</button>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats">
                    <div className="stat">
                        <h3>Total Repositories</h3>
                        <p>15</p>
                    </div>
                    <div className="stat">
                        <h3>Total Vulnerabilities</h3>
                        <p>42</p>
                    </div>
                    <div className="stat">
                        <h3>Critical Issues</h3>
                        <p>4</p>
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
                                <tr>
                                    <td>repo1</td>
                                    <td className="bg-red">5</td>
                                    <td className="bg-orange">3</td>
                                    <td className="bg-yellow">2</td>
                                    <td className="bg-green">1</td>
                                </tr>
                                <tr>
                                    <td>repo2</td>
                                    <td className="bg-red">4</td>
                                    <td className="bg-orange">2</td>
                                    <td className="bg-yellow">3</td>
                                    <td className="bg-green">2</td>
                                </tr>
                                <tr>
                                    <td>repo3</td>
                                    <td className="bg-red">3</td>
                                    <td className="bg-orange">4</td>
                                    <td className="bg-yellow">1</td>
                                    <td className="bg-green">3</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Scans */}
                <div className="recent-scans">
                    <h3>Recent Scans</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Repository</th>
                                <th>Date</th>
                                <th>Vulnerabilities</th>
                                <th>Critical</th>
                                <th>High</th>
                                <th>Medium</th>
                                <th>Low</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>repo1</td>
                                <td>2023-09-01</td>
                                <td>10</td>
                                <td>5</td>
                                <td>3</td>
                                <td>2</td>
                                <td>1</td>
                            </tr>
                            <tr>
                                <td>repo2</td>
                                <td>2023-09-02</td>
                                <td>11</td>
                                <td>4</td>
                                <td>2</td>
                                <td>3</td>
                                <td>2</td>
                            </tr>
                            <tr>
                                <td>repo3</td>
                                <td>2023-09-03</td>
                                <td>12</td>
                                <td>3</td>
                                <td>4</td>
                                <td>1</td>
                                <td>3</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;