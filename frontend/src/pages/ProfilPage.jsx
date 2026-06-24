import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getLaporanHilangSaya, getLaporanTemuanSaya } from '../services/api';
import Layout from '../components/Layout';

const KATEGORI_META = {
  DOKUMEN:    { bg: '#EFF6FF', text: '#2563EB', icon: '📄' },
  ELEKTRONIK: { bg: '#F5F3FF', text: '#7C3AED', icon: '📱' },
  UMUM:       { bg: '#F0FDF4', text: '#16A34A', icon: '📦' },
};
const STATUS_META = {
  ACTIVE:    { bg: '#EFF6FF', text: '#2563EB', label: 'Aktif' },
  TERSEDIA:  { bg: '#F0FDF4', text: '#16A34A', label: 'Tersedia' },
  MATCHED:   { bg: '#FFFBEB', text: '#D97706', label: 'Matched' },
  RESOLVED:  { bg: '#F0FDF4', text: '#16A34A', label: 'Selesai' },
  CANCELLED: { bg: '#FEF2F2', text: '#DC2626', label: 'Dibatalkan' },
};
const AKUN_STATUS = {
  ACTIVE:               { bg: '#F0FDF4', text: '#16A34A', label: 'Aktif' },
  PENDING_VERIFICATION: { bg: '#FFFBEB', text: '#D97706', label: 'Menunggu Verifikasi' },
  SUSPENDED:            { bg: '#FEF2F2', text: '#DC2626', label: 'Ditangguhkan' },
};

function LaporanMiniCard({ item }) {
  const barang   = item.barang || {};
  const kategori = barang.kategori || 'UMUM';
  const kMeta    = KATEGORI_META[kategori] || KATEGORI_META.UMUM;
  const sMeta    = STATUS_META[item.status]  || STATUS_META.ACTIVE;

  return (
    <div className="p-3.5 rounded-xl flex items-center gap-3 border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-all">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: kMeta.bg }}>
        {kMeta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-800 text-sm font-semibold truncate">{barang.deskripsi || '—'}</p>
        <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1">
          <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
          {barang.lokasiDeskripsi || '—'}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
          style={{ background: kMeta.bg, color: kMeta.text }}>{kategori}</span>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
          style={{ background: sMeta.bg, color: sMeta.text }}>{sMeta.label}</span>
      </div>
    </div>
  );
}

export default function ProfilPage() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [tabLaporan, setTabLaporan] = useState('hilang');
  const [hilang, setHilang]   = useState([]);
  const [temuan, setTemuan]   = useState([]);
  const [loadingL, setLoadingL] = useState(true);

  const statusInfo = AKUN_STATUS[user?.statusAkun] || AKUN_STATUS.PENDING_VERIFICATION;

  useEffect(() => {
    Promise.all([getLaporanHilangSaya(), getLaporanTemuanSaya()])
      .then(([rH, rT]) => {
        setHilang(Array.isArray(rH.data) ? rH.data : []);
        setTemuan(Array.isArray(rT.data) ? rT.data : []);
      })
      .catch(() => {})
      .finally(() => setLoadingL(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const dataLaporan  = tabLaporan === 'hilang' ? hilang : temuan;

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="page-title mb-1">Profil Saya</h1>
        <p className="text-sm text-slate-500">Informasi akun dan riwayat laporan kamu.</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="panel mb-5">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user?.nama?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 truncate">{user?.nama || '—'}</h2>
            <p className="text-sm text-slate-400 mb-2">{user?.nim || '—'}</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: statusInfo.bg, color: statusInfo.text }}>
                {statusInfo.label}
              </span>
              {user?.role && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  {user.role}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pending Warning */}
      {user?.statusAkun === 'PENDING_VERIFICATION' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="mb-5 p-4 rounded-xl flex items-start gap-3 bg-amber-50 border border-amber-200">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#D97706" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
          <p className="text-sm text-amber-700 leading-relaxed">
            <strong>Akun belum diverifikasi.</strong> Admin sedang memproses verifikasi KTM kamu.
          </p>
        </motion.div>
      )}

      {/* Info Detail */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="panel mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Detail Akun</h3>
        <div className="divide-y divide-slate-100">
          {[
            { label: 'Nama Lengkap', value: user?.nama },
            { label: 'NIM',          value: user?.nim },
            { label: 'Nomor HP',     value: user?.nomorHp },
            { label: 'Role',         value: user?.role },
            { label: 'Status Akun',  value: statusInfo.label },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-500">{label}</span>
              <span className="text-sm font-semibold text-slate-800">{value || '—'}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Laporan Saya */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="panel mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Laporan Saya</h3>
            <p className="text-xs text-slate-400 mt-0.5">Riwayat laporan yang pernah dibuat</p>
          </div>
          <div className="flex p-1 gap-1 bg-slate-100 rounded-xl">
            {[
              { key: 'hilang', label: `Hilang (${hilang.length})` },
              { key: 'temuan', label: `Temuan (${temuan.length})` },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setTabLaporan(key)}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                style={{
                  background: tabLaporan === key ? '#FFFFFF' : 'transparent',
                  color: tabLaporan === key ? '#0F172A' : '#64748B',
                  boxShadow: tabLaporan === key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {loadingL ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-slate-200 border-t-blue-600 rounded-full animate-spin" style={{ borderWidth: '2.5px' }} />
          </div>
        ) : dataLaporan.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">{tabLaporan === 'hilang' ? '📭' : '📬'}</div>
            <p className="text-sm text-slate-400">Belum ada laporan {tabLaporan === 'hilang' ? 'kehilangan' : 'temuan'}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={tabLaporan} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              {dataLaporan.map((item) => (
                <LaporanMiniCard key={item.id} item={item} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Logout */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <motion.button id="btn-logout" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
          Keluar dari Akun
        </motion.button>
      </motion.div>
    </Layout>
  );
}
