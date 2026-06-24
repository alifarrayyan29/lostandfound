import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nim: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nim || !form.password) {
      setError('NIM dan password wajib diisi.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userData = await login(form.nim, form.password);
      if (userData?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'NIM atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0D0D0D' }}>
      {/* Left Panel — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between p-12 w-1/2"
        style={{ background: '#111111', borderRight: '1px solid #1f1f1f' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl"
            style={{ background: '#C8FF00', color: '#0D0D0D' }}>L</div>
          <span className="font-bold text-white text-lg">Lost & Found PNL</span>
        </div>

        {/* Illustration text */}
        <div>
          <div className="text-7xl mb-8">🔍</div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Temukan barang<br />yang hilang<br />
            <span style={{ color: '#C8FF00' }}>dengan mudah.</span>
          </h2>
          <p style={{ color: '#8C8C8C' }} className="text-base leading-relaxed">
            Platform digital Lost & Found Politeknik Negeri Lhokseumawe.
            Laporkan dan temukan barang hilang di lingkungan kampus.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { num: '500+', label: 'Laporan' },
            { num: '80%', label: 'Match Rate' },
            { num: '300+', label: 'Pengguna' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-2xl text-center"
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-2xl font-black" style={{ color: '#C8FF00' }}>{stat.num}</p>
              <p className="text-xs mt-1" style={{ color: '#8C8C8C' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right Panel — Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black"
              style={{ background: '#C8FF00', color: '#0D0D0D' }}>L</div>
            <span className="font-bold text-white">Lost & Found PNL</span>
          </div>

          <h1 className="text-3xl font-black text-white mb-2">Selamat datang 👋</h1>
          <p className="mb-8" style={{ color: '#8C8C8C' }}>Masuk dengan NIM dan password kamu</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">NIM</label>
              <input
                id="nim"
                type="text"
                placeholder="Contoh: 2211234567"
                className="input-field"
                value={form.nim}
                onChange={(e) => setForm({ ...form, nim: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Masukkan password"
                className="input-field"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <motion.button
              id="btn-login"
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="btn-lime w-full py-4 text-base font-bold mt-2"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Masuk...
                </span>
              ) : 'Masuk →'}
            </motion.button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: '#8C8C8C' }}>
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: '#C8FF00' }}>
              Daftar di sini
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
