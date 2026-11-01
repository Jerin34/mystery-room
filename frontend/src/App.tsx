import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CreateCasePage } from './pages/CreateCasePage';
import { CaseHistoryPage } from './pages/CaseHistoryPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { Spinner } from './components/shared/Spinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-24">
        <Spinner size="lg" message="Verifying bureau credentials..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-detective-950 text-slate-100 selection:bg-amber-400 selection:text-black">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Detective Routes */}
              <Route
                path="/cases/new"
                element={
                  <ProtectedRoute>
                    <CreateCasePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cases"
                element={
                  <ProtectedRoute>
                    <CaseHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cases/:caseId"
                element={
                  <ProtectedRoute>
                    <WorkspacePage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback 404 */}
              <Route
                path="*"
                element={
                  <div className="py-24 text-center space-y-4">
                    <h2 className="font-cinzel text-3xl font-bold text-amber-400">404</h2>
                    <p className="font-mono text-xs text-slate-400">
                      This crime scene does not exist or has been cordoned off.
                    </p>
                    <a
                      href="/"
                      className="inline-block px-4 py-2 rounded bg-slate-800 text-xs font-mono text-slate-200"
                    >
                      Return to Bureau Headquarters
                    </a>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
