import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { uploadFile } from '../services/api';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nim: '', nama: '', nomorHp: '', password: '', confirmPassword: '', file: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const setField = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nim || !form.nama || !form.nomorHp || !form.password || !form.file) {
      setError('Semua field termasuk foto KTM wajib diisi.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Password tidak cocok.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // 1. Upload file first
      const fileRes = await uploadFile(form.file);
      const fotoKtmPath = fileRes.data.path;

      // 2. Register
      await register({ nim: form.nim, nama: form.nama, nomorHp: form.nomorHp, password: form.password, fotoKtmPath });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Registrasi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#0D0D0D' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-2xl font-black text-white mb-3">Pendaftaran Berhasil!</h2>
          <p className="mb-6" style={{ color: '#8C8C8C' }}>
            Akun kamu sudah dibuat. Tunggu verifikasi dari Admin sebelum bisa login.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/login')}
            className="btn-lime px-8 py-3"
          >
            Ke Halaman Login →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#0D0D0D' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black"
            style={{ background: '#C8FF00', color: '#0D0D0D' }}>L</div>
          <span className="font-bold text-white">Lost & Found PNL</span>
        </div>

        <h1 className="text-3xl font-black text-white mb-2">Buat Akun Baru</h1>
        <p className="mb-8" style={{ color: '#8C8C8C' }}>Isi data diri kamu dengan lengkap</p>

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
            <label className="block text-sm font-semibold text-white mb-2">NIM *</label>
            <input id="reg-nim" type="text" placeholder="Nomor Induk Mahasiswa" className="input-field"
              value={form.nim} onChange={(e) => setField('nim', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Nama Lengkap *</label>
            <input id="reg-nama" type="text" placeholder="Nama sesuai KTM" className="input-field"
              value={form.nama} onChange={(e) => setField('nama', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Nomor HP *</label>
            <input id="reg-hp" type="tel" placeholder="08xxxxxxxxxx" className="input-field"
              value={form.nomorHp} onChange={(e) => setField('nomorHp', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Password *</label>
            <input id="reg-password" type="password" placeholder="Minimal 6 karakter" className="input-field"
              value={form.password} onChange={(e) => setField('password', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Konfirmasi Password *</label>
            <input id="reg-confirm" type="password" placeholder="Ulangi password" className="input-field"
              value={form.confirmPassword} onChange={(e) => setField('confirmPassword', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Foto KTM (Bukti Mahasiswa) *</label>
            <input id="reg-ktm" type="file" accept="image/*" className="input-field"
              onChange={(e) => setField('file', e.target.files[0])} />
          </div>

          <div className="p-4 rounded-xl mt-2" style={{ background: 'rgba(200,255,0,0.05)', border: '1px solid rgba(200,255,0,0.15)' }}>
            <p className="text-xs" style={{ color: '#C8FF00' }}>
              ℹ️ Setelah mendaftar, akun kamu akan menunggu verifikasi dari Admin sebelum dapat digunakan.
            </p>
          </div>

          <motion.button
            id="btn-register"
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="btn-lime w-full py-4 text-base font-bold"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Mendaftar...
              </span>
            ) : 'Daftar Sekarang 🚀'}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: '#8C8C8C' }}>
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: '#C8FF00' }}>
            Masuk di sini
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
