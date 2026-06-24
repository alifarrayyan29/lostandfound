import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyMatches, tolakMatch } from '../services/api';
import Layout from '../components/Layout';

const STATUS_INFO = {
  SUGGESTED: { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB', label: 'Potensi Cocok',  dot: '#3B82F6' },
  CLAIMED:   { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', label: 'Diklaim',         dot: '#F59E0B' },
  CONFIRMED: { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A', label: 'Dikonfirmasi',   dot: '#22C55E' },
  REJECTED:  { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', label: 'Ditolak',         dot: '#EF4444' },
};

function MatchCard({ match, index, onChat, onReject }) {
  const skor = match.skorKecocokan || 0;
  const skorMeta = skor >= 80
    ? { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' }
    : skor >= 60
    ? { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' }
    : { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' };
  const statusInfo = STATUS_INFO[match.status] || STATUS_INFO.SUGGESTED;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: statusInfo.dot }}></div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
            style={{ background: statusInfo.bg, color: statusInfo.text, border: `1px solid ${statusInfo.border}` }}>
            {statusInfo.label}
          </span>
          <span className="text-xs text-slate-400">Match #{match.id}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="px-3 py-1.5 rounded-xl font-bold text-sm"
            style={{ background: skorMeta.bg, color: skorMeta.color, border: `1px solid ${skorMeta.border}` }}>
            {Math.round(skor)}%
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">cocok</p>
        </div>
      </div>

      {/* Pair cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-red-50 border border-red-100">
          <p className="text-[11px] font-bold text-red-600 mb-1.5 flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
            Barang Hilang
          </p>
          <p className="text-slate-800 text-sm font-medium line-clamp-2 leading-snug">
            {match.laporanHilang?.barang?.deskripsi || '—'}
          </p>
          <p className="text-xs mt-1.5 text-slate-400 flex items-center gap-1">
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
            {match.laporanHilang?.barang?.lokasiDeskripsi || '—'}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-green-50 border border-green-100">
          <p className="text-[11px] font-bold text-green-700 mb-1.5 flex items-center gap-1">
            <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
            Barang Temuan
          </p>
          <p className="text-slate-800 text-sm font-medium line-clamp-2 leading-snug">
            {match.laporanTemuan?.barang?.deskripsi || '—'}
          </p>
          <p className="text-xs mt-1.5 text-slate-400 flex items-center gap-1">
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
            {match.laporanTemuan?.barang?.lokasiDeskripsi || '—'}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          {match.createdAt
            ? new Date(match.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            : '—'}
        </p>
        
        {match.status === 'SUGGESTED' && (
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (window.confirm("Yakin ingin menolak match ini? Match tidak akan bisa dikembalikan.")) {
                  onReject(match.id);
                }
              }}
              className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-semibold bg-white border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
              Tolak
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => onChat(match.id)}
              className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
              Buka Chat
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function NotifikasiPage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('ALL');

  const fetchMatches = () => {
    setLoading(true);
    getMyMatches()
      .then((res) => {
        const allMatches = Array.isArray(res.data) ? res.data : [];
        setMatches(allMatches.filter(m => m.status === 'SUGGESTED' || m.status === 'REJECTED'));
      })
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleReject = async (id) => {
    try {
      await tolakMatch(id);
      fetchMatches();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menolak match');
    }
  };

  const FILTERS = ['ALL', 'SUGGESTED', 'REJECTED'];
  const filtered = filter === 'ALL' ? matches : matches.filter((m) => m.status === filter);
  const counts   = {
    total:     matches.length,
    suggested: matches.filter(m => m.status === 'SUGGESTED').length,
    rejected:  matches.filter(m => m.status === 'REJECTED').length,
  };

  return (
    <Layout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="page-title mb-1">Notifikasi & Match</h1>
        <p className="text-sm text-slate-500">Hasil pencocokan otomatis antara barang hilang dan temuan.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Semua Notifikasi', value: counts.total,     color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
          { label: 'Potensi Cocok',    value: counts.suggested, color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
          { label: 'Ditolak',          value: counts.rejected,  color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map((f) => (
          <motion.button key={f} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setFilter(f)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: filter === f ? '#2563EB' : '#F8FAFC',
              color: filter === f ? '#FFFFFF' : '#64748B',
              border: `1px solid ${filter === f ? '#2563EB' : '#E2E8F0'}`,
            }}>
            {f === 'ALL' ? `Semua (${counts.total})` : `${STATUS_INFO[f]?.label} (${matches.filter(m => m.status === f).length})`}
          </motion.button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 rounded-full border-slate-200 border-t-blue-600 animate-spin" style={{ borderWidth: '3px' }} />
          <p className="text-sm text-slate-400 font-medium">Memuat notifikasi...</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">🔔</div>
          <p className="font-semibold text-slate-700">
            {filter === 'ALL' ? 'Belum ada match' : `Tidak ada match "${STATUS_INFO[filter]?.label}"`}
          </p>
          <p className="text-sm text-slate-400 text-center max-w-xs">
            {filter === 'ALL' ? 'Sistem akan otomatis memberitahu kamu saat ada barang yang cocok.' : 'Coba filter lain.'}
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid gap-4">
            {filtered.map((match, i) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                index={i} 
                onChat={(id) => navigate(`/chat/${id}`)} 
                onReject={handleReject} 
              />
            ))}
          </div>
        </AnimatePresence>
      )}
    </Layout>
  );
}
