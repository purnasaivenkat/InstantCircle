import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Matching from './pages/Matching';
import Circle from './pages/Circle';
import Feedback from './pages/Feedback';

import Verify from './pages/Verify';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0B1120]">
        <div className="w-full max-w-[450px] h-full min-h-screen md:min-h-[850px] md:h-[850px] bg-[#0F172A] relative overflow-hidden border-x border-[#1E293B] shadow-2xl">
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify" element={<Verify />} />

              {/* Protected Routes */}
              <Route 
                path="/home" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/matching" 
                element={
                  <ProtectedRoute>
                    <Matching />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/circle" 
                element={
                  <ProtectedRoute>
                    <Circle />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/feedback" 
                element={
                  <ProtectedRoute>
                    <Feedback />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
