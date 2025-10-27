import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import MarketingPage from './pages/MarketingPage';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppTheme from './components/shared-theme/AppTheme';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Router>
          <Routes>
            <Route path="/" element={<MarketingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppTheme>
    </AuthProvider>
  );
};

export default App;
