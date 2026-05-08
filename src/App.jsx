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
import PrivateChat from './pages/PrivateChat';
import Companion from './pages/Companion';


import Verify from './pages/Verify';

function App() {
  return (
    <AuthProvider>
      <div className="h-screen w-full bg-[#020617] text-[#F8FAFC]">
        <div className="w-full h-full relative flex flex-col overflow-hidden">


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
              <Route 
                path="/private-chat/:chatId" 
                element={
                  <ProtectedRoute>
                    <PrivateChat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/companion" 
                element={
                  <ProtectedRoute>
                    <Companion />
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
