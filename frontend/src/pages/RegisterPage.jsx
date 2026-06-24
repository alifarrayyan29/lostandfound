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
      const fileRes = await uploadFile(form.file);
      const fotoKtmPath = fileRes.data.path;
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-white">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">🎉</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Akun kamu sudah dibuat dan sedang menunggu verifikasi Admin sebelum bisa digunakan.
          </p>
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => navigate('/login')}
            className="w-full py-3 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
            Ke Halaman Login →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left branding (only desktop) */}
      <div className="hidden lg:flex w-[380px] flex-col justify-between p-12 bg-blue-600 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-white text-sm">L</div>
          <span className="font-bold text-white text-base">Lost & Found PNL</span>
        </div>
        <div>
          <h2 className="text-white text-2xl font-bold leading-tight mb-3">Bergabung bersama kami</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Buat akun dan mulai laporkan barang hilang atau temuan di lingkungan kampus PNL.
          </p>
          <div className="mt-6 space-y-3">
            {['Verifikasi akun oleh Admin', 'Notifikasi match otomatis', 'Live Chat dengan penemu'].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-white/80 text-sm">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-xs">© 2026 Politeknik Negeri Lhokseumawe</p>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-start justify-center p-8 py-12 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm">L</div>
            <span className="font-bold text-slate-900 text-base">Lost & Found PNL</span>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">Buat akun baru</h1>
            <p className="text-sm text-slate-500">Isi data diri dengan lengkap dan benar.</p>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">NIM <span className="text-red-500">*</span></label>
                <input id="reg-nim" type="text" placeholder="221..." className="input-field"
                  value={form.nim} onChange={(e) => setField('nim', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor HP <span className="text-red-500">*</span></label>
                <input id="reg-hp" type="tel" placeholder="08xx..." className="input-field"
                  value={form.nomorHp} onChange={(e) => setField('nomorHp', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
              <input id="reg-nama" type="text" placeholder="Nama sesuai KTM" className="input-field"
                value={form.nama} onChange={(e) => setField('nama', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                <input id="reg-password" type="password" placeholder="Min. 6 karakter" className="input-field"
                  value={form.password} onChange={(e) => setField('password', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Konfirmasi <span className="text-red-500">*</span></label>
                <input id="reg-confirm" type="password" placeholder="Ulangi password" className="input-field"
                  value={form.confirmPassword} onChange={(e) => setField('confirmPassword', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Foto KTM <span className="text-red-500">*</span></label>
              <div className="relative">
                <input id="reg-ktm" type="file" accept="image/*" className="input-field cursor-pointer text-sm text-slate-500
                  file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0
                  file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 file:transition-colors"
                  onChange={(e) => setField('file', e.target.files[0])} />
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-amber-600 mt-0.5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <p className="text-xs text-amber-700 leading-relaxed">
                Akun kamu akan menunggu verifikasi Admin sebelum dapat digunakan.
              </p>
            </div>

            <motion.button
              id="btn-register"
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
                  Mendaftar...
                </>
              ) : 'Daftar Sekarang'}
            </motion.button>
          </form>

          <p className="text-center mt-5 text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Masuk di sini
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
