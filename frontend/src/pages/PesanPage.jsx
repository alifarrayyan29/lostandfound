import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyMatches } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

function ChatContactCard({ match, user, onOpen }) {
  const isPelaporHilang = match.laporanHilang?.user?.nim === user?.nim;
  const lawanBicara = isPelaporHilang
    ? match.laporanTemuan?.user
    : match.laporanHilang?.user;
  const barangTerkait = isPelaporHilang
    ? match.laporanHilang?.barang?.deskripsi
    : match.laporanTemuan?.barang?.deskripsi;
  const isConfirmed = match.status === 'CONFIRMED';
  const initials = lawanBicara?.nama?.[0]?.toUpperCase() || '?';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -1 }}
      onClick={() => onOpen(match.id)}
      className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all flex items-center gap-4"
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-lg font-bold"
        style={{
          background: isConfirmed ? '#F0FDF4' : '#EFF6FF',
          color: isConfirmed ? '#16A34A' : '#2563EB',
        }}>
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-semibold text-slate-900 text-sm truncate">{lawanBicara?.nama || 'Pengguna'}</h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md ml-2 flex-shrink-0"
            style={{
              background: isConfirmed ? '#F0FDF4' : '#EFF6FF',
              color: isConfirmed ? '#16A34A' : '#2563EB',
            }}>
            {isConfirmed ? 'Selesai' : 'Aktif'}
          </span>
        </div>
        <p className="text-xs text-slate-400 truncate">Terkait: {barangTerkait || 'Barang'}</p>
      </div>

      {/* Arrow */}
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-slate-300 flex-shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </motion.div>
  );
}

export default function PesanPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyMatches()
      .then((res) => {
        const allMatches = Array.isArray(res.data) ? res.data : [];
        setChats(allMatches.filter(m => m.status === 'CLAIMED' || m.status === 'CONFIRMED'));
      })
      .catch(() => setChats([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="page-title mb-1">Pesan</h1>
        <p className="text-sm text-slate-500">Lanjutkan komunikasi dengan penemu atau pemilik barang.</p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 rounded-full border-slate-200 border-t-blue-600 animate-spin" style={{ borderWidth: '3px' }} />
          <p className="text-sm text-slate-400 font-medium">Memuat daftar chat...</p>
        </div>
      ) : chats.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-dashed border-slate-200 rounded-2xl">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">💬</div>
          <p className="font-semibold text-slate-700">Belum ada obrolan aktif</p>
          <p className="text-sm text-slate-400 text-center max-w-xs leading-relaxed">
            Buka menu Notifikasi dan klaim sebuah Match untuk memulai percakapan baru.
          </p>
          <button onClick={() => navigate('/notifikasi')}
            className="mt-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Lihat Notifikasi →
          </button>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid gap-3">
            {chats.map((chat) => (
              <ChatContactCard
                key={chat.id}
                match={chat}
                user={user}
                onOpen={(id) => navigate(`/chat/${id}`)}
              />
            ))}
          </div>
        </AnimatePresence>
      )}
    </Layout>
  );
}
