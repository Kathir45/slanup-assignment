import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { NearbyEventsPage } from './components/NearbyEventsPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App';
import { useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!user ? <LoginForm /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/register" 
            element={!user ? <RegisterForm /> : <Navigate to="/" replace />} 
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={user ? <App /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/nearby"
            element={
              user ? (
                <ErrorBoundary>
                  <NearbyEventsPage />
                </ErrorBoundary>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default AppRoutes;
