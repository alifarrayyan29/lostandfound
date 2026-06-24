import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import HomePage       from './pages/HomePage';
import LaporPage      from './pages/LaporPage';
import NotifikasiPage from './pages/NotifikasiPage';
import PesanPage      from './pages/PesanPage';
import ProfilPage     from './pages/ProfilPage';
import ChatPage       from './pages/ChatPage';
import AdminPage      from './pages/AdminPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/home" element={
            <ProtectedRoute><HomePage /></ProtectedRoute>
          } />
          <Route path="/lapor" element={
            <ProtectedRoute><LaporPage /></ProtectedRoute>
          } />
          <Route path="/notifikasi" element={
            <ProtectedRoute><NotifikasiPage /></ProtectedRoute>
          } />
          <Route path="/pesan" element={
            <ProtectedRoute><PesanPage /></ProtectedRoute>
          } />
          <Route path="/profil" element={
            <ProtectedRoute><ProfilPage /></ProtectedRoute>
          } />
          <Route path="/chat/:matchId" element={
            <ProtectedRoute><ChatPage /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute><AdminPage /></ProtectedRoute>
          } />

          {/* Default routes */}
          <Route path="/"  element={<LandingPage />} />
          <Route path="*"  element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
