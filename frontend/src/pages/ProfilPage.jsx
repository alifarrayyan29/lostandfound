import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getLaporanHilangSaya, getLaporanTemuanSaya } from '../services/api';
import Layout from '../components/Layout';

const KATEGORI_COLORS = {
  DOKUMEN:    { bg: 'rgba(59,130,246,0.15)',  text: '#60A5FA' },
  ELEKTRONIK: { bg: 'rgba(139,92,246,0.15)', text: '#A78BFA' },
  UMUM:       { bg: 'rgba(16,185,129,0.15)', text: '#34D399' },
};

const STATUS_COLORS = {
  ACTIVE:    { bg: 'rgba(200,255,0,0.1)',    text: '#C8FF00', label: 'Aktif' },
  TERSEDIA:  { bg: 'rgba(200,255,0,0.1)',    text: '#C8FF00', label: 'Tersedia' },
  MATCHED:   { bg: 'rgba(59,130,246,0.1)',   text: '#60A5FA', label: 'Matched' },
  RESOLVED:  { bg: 'rgba(16,185,129,0.1)',   text: '#34D399', label: 'Selesai' },
  CANCELLED: { bg: 'rgba(239,68,68,0.1)',    text: '#F87171', label: 'Dibatalkan' },
};

function LaporanMiniCard({ item, jenis }) {
  const barang    = item.barang || {};
  const kategori  = barang.kategori || 'UMUM';
  const kColors   = KATEGORI_COLORS[kategori] || KATEGORI_COLORS.UMUM;
  const sStatus   = STATUS_COLORS[item.status]  || STATUS_COLORS.ACTIVE;

  return (
    <div className="p-4 rounded-xl flex items-center gap-3"
      style={{ background: '#111', border: '1px solid #1f1f1f' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: '#1a1a1a' }}>
        {kategori === 'DOKUMEN' ? '📄' : kategori === 'ELEKTRONIK' ? '📱' : '📦'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{barang.deskripsi || '—'}</p>
        <p className="text-xs truncate" style={{ color: '#555' }}>
          📍 {barang.lokasiDeskripsi || '—'}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: kColors.bg, color: kColors.text }}>
          {kategori}
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: sStatus.bg, color: sStatus.text }}>
          {sStatus.label}
        </span>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #1a1a1a' }}>
      <span className="text-sm" style={{ color: '#8C8C8C' }}>{label}</span>
      <span className="text-sm font-semibold text-white">{value || '—'}</span>
    </div>
  );
}

const AKUN_STATUS = {
  ACTIVE:               { bg: 'rgba(16,185,129,0.15)', text: '#34D399', label: 'Aktif' },
  PENDING_VERIFICATION: { bg: 'rgba(245,158,11,0.15)', text: '#FBBF24', label: 'Menunggu Verifikasi' },
  SUSPENDED:            { bg: 'rgba(239,68,68,0.15)',  text: '#F87171', label: 'Ditangguhkan' },
};

export default function ProfilPage() {
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const [tabLaporan, setTabLaporan] = useState('hilang');
  const [hilang, setHilang]  = useState([]);
  const [temuan, setTemuan]  = useState([]);
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

  const dataLaporan = tabLaporan === 'hilang' ? hilang : temuan;

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1">Profil</h1>
        <p className="text-sm" style={{ color: '#8C8C8C' }}>Informasi akun dan laporan kamu</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-8 mb-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 rounded-full flex items-center justify-center font-black text-4xl mx-auto mb-4"
          style={{ background: '#C8FF00', color: '#0D0D0D' }}>
          {user?.nama?.[0]?.toUpperCase() || 'U'}
        </motion.div>
        <h2 className="text-xl font-black text-white mb-1">{user?.nama || '—'}</h2>
        <p className="text-sm mb-4" style={{ color: '#8C8C8C' }}>{user?.nim || '—'}</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ background: statusInfo.bg, color: statusInfo.text }}>
            {statusInfo.label}
          </span>
          {user?.role && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(200,255,0,0.1)', color: '#C8FF00' }}>
              {user.role}
            </span>
          )}
        </div>
      </motion.div>

      {/* Info Detail */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="card p-6 mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#8C8C8C' }}>Detail Akun</h3>
        <InfoRow label="Nama Lengkap" value={user?.nama} />
        <InfoRow label="NIM"          value={user?.nim} />
        <InfoRow label="Nomor HP"     value={user?.nomorHp} />
        <InfoRow label="Role"         value={user?.role} />
        <InfoRow label="Status"       value={statusInfo.label} />
      </motion.div>

      {/* Peringatan pending */}
      {user?.statusAkun === 'PENDING_VERIFICATION' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="p-4 rounded-2xl mb-6"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <p className="text-sm" style={{ color: '#FBBF24' }}>
            ⏳ <strong>Akun belum diverifikasi.</strong> Admin sedang memproses verifikasi KTM kamu.
          </p>
        </motion.div>
      )}

      {/* Laporan Saya */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8C8C8C' }}>Laporan Saya</h3>
          <div className="flex gap-2">
            {[
              { key: 'hilang', label: `❌ Hilang (${hilang.length})` },
              { key: 'temuan', label: `✅ Temuan (${temuan.length})` },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setTabLaporan(key)}
                className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
                style={{
                  background: tabLaporan === key ? '#C8FF00' : '#1a1a1a',
                  color:      tabLaporan === key ? '#0D0D0D' : '#8C8C8C',
                  border:     `1px solid ${tabLaporan === key ? '#C8FF00' : '#2a2a2a'}`,
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {loadingL ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#C8FF00', borderTopColor: 'transparent' }} />
          </div>
        ) : dataLaporan.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">{tabLaporan === 'hilang' ? '📭' : '📬'}</p>
            <p className="text-sm" style={{ color: '#8C8C8C' }}>
              Belum ada laporan {tabLaporan === 'hilang' ? 'kehilangan' : 'temuan'}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={tabLaporan} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              {dataLaporan.map((item) => (
                <LaporanMiniCard key={item.id} item={item} jenis={tabLaporan} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Logout */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <motion.button id="btn-logout" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl text-sm font-bold"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1.5px solid rgba(239,68,68,0.2)' }}>
          🚪 Keluar dari Akun
        </motion.button>
      </motion.div>
    </Layout>
  );
}
