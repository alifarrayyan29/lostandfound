import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyMatches } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

function ChatContactCard({ match, user, onOpen }) {
  // Tentukan siapa lawan bicara kita
  const isPelaporHilang = match.laporanHilang?.user?.nim === user?.nim;
  const lawanBicara = isPelaporHilang 
    ? match.laporanTemuan?.user 
    : match.laporanHilang?.user;

  const barangTerkait = isPelaporHilang
    ? match.laporanHilang?.barang?.deskripsi
    : match.laporanTemuan?.barang?.deskripsi;

  const isConfirmed = match.status === 'CONFIRMED';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen(match.id)}
      className="card flex gap-4 p-4 cursor-pointer items-center transition-all hover:bg-[#1a1a1a]"
      style={{ borderLeft: isConfirmed ? '4px solid #34D399' : '4px solid #C8FF00' }}
    >
      {/* Avatar (Inisial) */}
      <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-black"
        style={{ background: '#1f1f1f', color: isConfirmed ? '#34D399' : '#C8FF00' }}>
        {lawanBicara?.nama?.[0]?.toUpperCase() || '?'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-white text-lg truncate">{lawanBicara?.nama || 'Pengguna'}</h3>
          <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ml-2"
            style={{ 
              background: isConfirmed ? 'rgba(16,185,129,0.1)' : 'rgba(200,255,0,0.1)', 
              color: isConfirmed ? '#34D399' : '#C8FF00' 
            }}>
            {isConfirmed ? 'Selesai' : 'Aktif'}
          </span>
        </div>
        <p className="text-sm truncate" style={{ color: '#8C8C8C' }}>
          Terkait: {barangTerkait || 'Barang'}
        </p>
      </div>

      <div className="flex-shrink-0 text-2xl ml-2 opacity-50">
        💬
      </div>
    </motion.div>
  );
}

export default function PesanPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyMatches()
      .then((res) => {
        const allMatches = Array.isArray(res.data) ? res.data : [];
        // Hanya ambil yang sudah diklaim (sudah chat) atau selesai
        const activeChats = allMatches.filter(m => m.status === 'CLAIMED' || m.status === 'CONFIRMED');
        setChats(activeChats);
      })
      .catch(() => setChats([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-black text-white mb-2">Daftar Pesan</h1>
        <p className="text-sm" style={{ color: '#8C8C8C' }}>
          Lanjutkan komunikasi untuk pengembalian barang Anda.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: '#C8FF00', borderTopColor: 'transparent' }} />
          <p style={{ color: '#8C8C8C' }}>Memuat daftar chat...</p>
        </div>
      ) : chats.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-4 card border-dashed">
          <span className="text-6xl">💬</span>
          <p className="font-semibold text-white">Belum ada obrolan aktif</p>
          <p className="text-sm text-center max-w-xs" style={{ color: '#8C8C8C' }}>
            Buka menu Notifikasi dan klaim sebuah Match untuk memulai percakapan baru.
          </p>
          <button onClick={() => navigate('/notifikasi')} 
            className="mt-4 btn-lime px-6 py-2 rounded-xl font-bold text-sm">
            Lihat Notifikasi
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
