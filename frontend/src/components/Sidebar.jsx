import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/home',       icon: '🏠', label: 'Beranda' },
  { to: '/lapor',      icon: '📋', label: 'Buat Laporan' },
  { to: '/notifikasi', icon: '🔔', label: 'Notifikasi' },
  { to: '/pesan',      icon: '💬', label: 'Pesan' },
  { to: '/profil',     icon: '👤', label: 'Profil' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col"
      style={{
        width: '240px',
        background: '#111111',
        borderRight: '1px solid #1f1f1f',
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black"
            style={{ background: '#C8FF00', color: '#0D0D0D' }}>
            L
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Lost & Found</p>
            <p className="text-xs" style={{ color: '#8C8C8C' }}>PNL</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="mx-4 mb-6 p-3 rounded-xl" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: '#C8FF00', color: '#0D0D0D' }}>
            {user?.nama?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.nama || 'Mahasiswa'}</p>
            <p className="text-xs truncate" style={{ color: '#8C8C8C' }}>{user?.nim || '-'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {user?.role === 'ADMIN' && (
          <NavLink to="/admin">
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all mb-2"
                style={{
                  background: isActive ? 'rgba(239,68,68,0.1)' : 'transparent',
                  color: isActive ? '#F87171' : '#8C8C8C',
                  border: isActive ? '1px solid rgba(239,68,68,0.2)' : '1px solid transparent',
                }}
              >
                <span className="text-base">🛡️</span>
                Dashboard Admin
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#F87171' }} />
                )}
              </motion.div>
            )}
          </NavLink>
        )}

        {navItems.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: isActive ? 'rgba(200,255,0,0.1)' : 'transparent',
                  color: isActive ? '#C8FF00' : '#8C8C8C',
                  border: isActive ? '1px solid rgba(200,255,0,0.2)' : '1px solid transparent',
                }}
              >
                <span className="text-base">{icon}</span>
                {label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#C8FF00' }} />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all"
          style={{ background: '#1a1a1a', color: '#FF4D4D', border: '1px solid #2a2a2a' }}
        >
          <span>🚪</span>
          Keluar
        </motion.button>
      </div>
    </aside>
  );
}
