import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyMatches } from '../services/api';
import Layout from '../components/Layout';

const STATUS_INFO = {
  SUGGESTED: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA',  label: 'Potensi Cocok', icon: '🔍' },
  CLAIMED:   { bg: 'rgba(245,158,11,0.15)', text: '#FBBF24',  label: 'Diklaim',        icon: '📩' },
  CONFIRMED: { bg: 'rgba(200,255,0,0.15)',  text: '#C8FF00',  label: 'Dikonfirmasi',  icon: '✅' },
  REJECTED:  { bg: 'rgba(239,68,68,0.15)', text: '#F87171',   label: 'Ditolak',       icon: '❌' },
};

function MatchCard({ match, index, onChat }) {
  const skor = match.skorKecocokan || 0;
  const skorColor = skor >= 80 ? '#C8FF00' : skor >= 60 ? '#FBBF24' : '#F87171';
  const statusInfo = STATUS_INFO[match.status] || STATUS_INFO.SUGGESTED;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04 }}
      className="card p-5"
    >
      {/* Header: status + skor */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: statusInfo.bg, color: statusInfo.text }}>
            {statusInfo.icon} {statusInfo.label}
          </span>
          <span className="text-xs" style={{ color: '#555' }}>Match #{match.id}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm"
            style={{ background: `${skorColor}20`, color: skorColor }}>
            {Math.round(skor)}%
          </div>
          <p className="text-xs mt-0.5" style={{ color: '#555' }}>Cocok</p>
        </div>
      </div>

      {/* Pair laporan */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <p className="text-xs font-bold mb-1.5" style={{ color: '#F87171' }}>❌ Barang Hilang</p>
          <p className="text-white text-sm font-medium line-clamp-2 leading-snug">
            {match.laporanHilang?.barang?.deskripsi || '—'}
          </p>
          <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: '#666' }}>
            📍 {match.laporanHilang?.barang?.lokasiDeskripsi || '—'}
          </p>
        </div>
        <div className="p-3 rounded-xl" style={{ background: 'rgba(200,255,0,0.07)', border: '1px solid rgba(200,255,0,0.15)' }}>
          <p className="text-xs font-bold mb-1.5" style={{ color: '#C8FF00' }}>✅ Barang Temuan</p>
          <p className="text-white text-sm font-medium line-clamp-2 leading-snug">
            {match.laporanTemuan?.barang?.deskripsi || '—'}
          </p>
          <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: '#666' }}>
            📍 {match.laporanTemuan?.barang?.lokasiDeskripsi || '—'}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #1f1f1f' }}>
        <p className="text-xs" style={{ color: '#555' }}>
          {match.createdAt
            ? new Date(match.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            : '—'}
        </p>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => onChat(match.id)}
            className="text-xs px-4 py-2 rounded-full font-semibold flex items-center gap-1.5"
            style={{ background: 'rgba(200,255,0,0.1)', color: '#C8FF00', border: '1px solid rgba(200,255,0,0.25)' }}>
            💬 Buka Chat
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function NotifikasiPage() {
  const navigate  = useNavigate();
  const [matches, setMatches]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter,  setFilter]    = useState('ALL');

  useEffect(() => {
    getMyMatches()
      .then((res) => {
        const allMatches = Array.isArray(res.data) ? res.data : [];
        // Notifikasi hanya menampilkan yang belum diklaim (SUGGESTED) atau Ditolak (REJECTED)
        const unreadMatches = allMatches.filter(m => m.status === 'SUGGESTED' || m.status === 'REJECTED');
        setMatches(unreadMatches);
      })
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, []);

  const FILTERS = ['ALL', 'SUGGESTED', 'REJECTED'];
  const filtered = filter === 'ALL' ? matches : matches.filter((m) => m.status === filter);

  const counts = {
    total:     matches.length,
    suggested: matches.filter((m) => m.status === 'SUGGESTED').length,
    rejected:  matches.filter((m) => m.status === 'REJECTED').length,
  };

  return (
    <Layout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1">Notifikasi & Match</h1>
        <p className="text-sm" style={{ color: '#8C8C8C' }}>
          Hasil pencocokan otomatis antara barang hilang dan temuan
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Total',       value: counts.total,     color: '#C8FF00' },
          { label: 'Potensi',     value: counts.suggested, color: '#60A5FA' },
          { label: 'Ditolak',     value: counts.rejected,  color: '#F87171' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 text-center">
            <p className="text-2xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs" style={{ color: '#8C8C8C' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <motion.button key={f} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: filter === f ? '#C8FF00' : '#1a1a1a',
              color:      filter === f ? '#0D0D0D' : '#8C8C8C',
              border:     `1px solid ${filter === f ? '#C8FF00' : '#2a2a2a'}`,
            }}>
            {f === 'ALL' ? 'Semua' : (STATUS_INFO[f]?.label || f)}
            {f !== 'ALL' && <span className="ml-1.5 opacity-70">{matches.filter((m) => m.status === f).length}</span>}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: '#C8FF00', borderTopColor: 'transparent' }} />
          <p style={{ color: '#8C8C8C' }}>Memuat notifikasi...</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="text-6xl">🔔</span>
          <p className="font-semibold text-white">
            {filter === 'ALL' ? 'Belum ada match' : `Tidak ada match "${STATUS_INFO[filter]?.label}"`}
          </p>
          <p className="text-sm text-center max-w-xs" style={{ color: '#8C8C8C' }}>
            {filter === 'ALL'
              ? 'Sistem akan otomatis memberitahu kamu ketika ada barang yang cocok dengan laporanmu'
              : 'Coba filter lain atau buat laporan baru'}
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid gap-4">
            {filtered.map((match, i) => (
              <MatchCard key={match.id} match={match} index={i}
                onChat={(id) => navigate(`/chat/${id}`)} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </Layout>
  );
}
