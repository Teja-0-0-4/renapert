import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Box, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Dashboard/Home';
import SubmitBiomarkers from './components/Dashboard/SubmitBiomarkers';
import ResultDashboard from './components/Dashboard/ResultDashboard';
import Recommendations from './components/Dashboard/Recommendations';
import History from './components/Dashboard/History';
import HistoryDetails from './components/Dashboard/HistoryDetails';
import DashboardLayout from './components/Layout/DashboardLayout';
import Profile from './components/Dashboard/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/submit"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SubmitBiomarkers />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/health-score"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ResultDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Recommendations />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <History />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history-details/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <HistoryDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Catch all route - redirect to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const App = () => (
  <ThemeProvider>
    <Router>
      <CssBaseline />
      <ToastContainer position="top-right" />
      <AppRoutes />
    </Router>
  </ThemeProvider>
);

export default App;
