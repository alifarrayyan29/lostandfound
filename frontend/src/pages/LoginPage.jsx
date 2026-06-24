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
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex w-[420px] flex-col justify-between p-12 bg-blue-600 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-white text-sm">L</div>
          <span className="font-bold text-white text-base">Lost & Found PNL</span>
        </div>

        <div>
          <blockquote className="text-white/90 text-xl font-semibold leading-relaxed mb-6">
            "Kehilangan barang bukan akhir dari segalanya. Platform ini membantu kamu menemukannya kembali."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">P</div>
            <div>
              <p className="text-white text-sm font-semibold">Tim Lost & Found</p>
              <p className="text-white/60 text-xs">Politeknik Negeri Lhokseumawe</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { num: '500+', label: 'Laporan' },
            { num: '80%',  label: 'Match Rate' },
            { num: '300+', label: 'User' },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-white font-extrabold text-lg">{s.num}</p>
              <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm">L</div>
            <span className="font-bold text-slate-900 text-base">Lost & Found PNL</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">Selamat datang kembali</h1>
            <p className="text-sm text-slate-500">Masuk dengan NIM dan password kamu.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-5 p-3.5 rounded-xl text-sm font-medium flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">NIM</label>
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
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
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
              whileHover={{ scale: loading ? 1 : 1.01, y: loading ? 0 : -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 text-sm font-semibold rounded-xl mt-2 text-white flex justify-center items-center gap-2 transition-all"
              style={{
                background: loading ? '#93C5FD' : '#2563EB',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(37,99,235,0.3)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : 'Masuk'}
            </motion.button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Daftar sekarang
            </Link>
          </p>
          <p className="text-center mt-2 text-sm text-slate-500">
            <Link to="/" className="text-slate-400 hover:text-slate-500 transition-colors text-xs">
              ← Kembali ke halaman utama
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
