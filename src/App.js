import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage/LandingPage';
import Dashboard from './components/pages/dash/dashboard';
import VulnScan from './components/pages/scan/scanrepo';
import ScanHistory from './components/pages/history/scanhistory';
import AuthPages from './components/pages/login/login';
import { supabase } from './supabase';

function ProtectedRoute({ session, loading, children }) {
  if (loading) {
    return <p role="status">Checking your sign-in...</p>;
  }

  return session ? children : <Navigate to="/" replace />;
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Could not restore the Supabase session.', error);
      }
      if (active) {
        setSession(data.session);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={session ? <Navigate to="/landing" replace /> : <AuthPages />}
        />
        <Route path="/landing" element={<ProtectedRoute session={session} loading={loading}><LandingPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute session={session} loading={loading}><Dashboard /></ProtectedRoute>} />
        <Route path="/scanrepo" element={<ProtectedRoute session={session} loading={loading}><VulnScan /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute session={session} loading={loading}><ScanHistory /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
