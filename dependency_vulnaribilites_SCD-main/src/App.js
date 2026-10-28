import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage/LandingPage';
import Dashboard from './components/pages/dash/dashboard';
import VulnScan from './components/pages/scan/scanrepo';
import ScanHistory from './components/pages/history/scanhistory';
import AuthPages from './components/pages/login/login';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPages />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scanrepo" element={<VulnScan />} />
        <Route path="/history" element={<ScanHistory />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
