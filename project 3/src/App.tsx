import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import About from './components/About';
import LeagueTables from './components/LeagueTables';
import TeamDetails from './components/TeamDetails';
import Admin from './components/Admin';
import Login from './components/Login';
import PlayerLogin from './components/PlayerLogin';
import ResetPassword from './components/ResetPassword';
import Footer from './components/Footer';

// Protected Route component
const ProtectedRoute = ({ children, type = 'admin' }: { children: React.ReactNode, type?: 'admin' | 'player' }) => {
  const isAuthenticated = type === 'admin' 
    ? localStorage.getItem('isAuthenticated') === 'true'
    : localStorage.getItem('playerAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to={type === 'admin' ? '/login' : '/player-login'} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/register" 
            element={
              <ProtectedRoute type="player">
                <Register />
              </ProtectedRoute>
            } 
          />
          <Route path="/about" element={<About />} />
          <Route path="/tables" element={<LeagueTables />} />
          <Route path="/teams/:id" element={<TeamDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/player-login" element={<PlayerLogin />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute type="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;