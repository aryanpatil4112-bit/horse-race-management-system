import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Horses } from './pages/Horses';
import { Jockeys } from './pages/Jockeys';
import { Races } from './pages/Races';
import { Registrations } from './pages/Registrations';
import { Results } from './pages/Results';
import { Leaderboard } from './pages/Leaderboard';
import { Users } from './pages/Users';

const ProtectedLayout = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        {children}
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              }
            />

            <Route
              path="/horses"
              element={
                <ProtectedLayout>
                  <Horses />
                </ProtectedLayout>
              }
            />

            <Route
              path="/jockeys"
              element={
                <ProtectedLayout>
                  <Jockeys />
                </ProtectedLayout>
              }
            />

            <Route
              path="/races"
              element={
                <ProtectedLayout>
                  <Races />
                </ProtectedLayout>
              }
            />

            <Route
              path="/registrations"
              element={
                <ProtectedLayout>
                  <Registrations />
                </ProtectedLayout>
              }
            />

            <Route
              path="/results"
              element={
                <ProtectedLayout>
                  <Results />
                </ProtectedLayout>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedLayout>
                  <Leaderboard />
                </ProtectedLayout>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedLayout allowedRoles={['ADMIN']}>
                  <Users />
                </ProtectedLayout>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
