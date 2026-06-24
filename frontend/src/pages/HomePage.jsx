import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getLaporanHilang, getLaporanTemuan } from '../services/api';
import Layout from '../components/Layout';

const BASE_URL = 'http://localhost:8080';

const KATEGORI_COLORS = {
  DOKUMEN:    { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
  ELEKTRONIK: { bg: 'rgba(139,92,246,0.15)', text: '#A78BFA' },
  UMUM:       { bg: 'rgba(16,185,129,0.15)', text: '#34D399' },
};

function LaporanCard({ item, type }) {
  const barang = item.barang || {};
  const kategori = barang.kategori || 'UMUM';
  const colors = KATEGORI_COLORS[kategori] || KATEGORI_COLORS.UMUM;
  const isHilang = type === 'hilang';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      className="card flex gap-4 p-4"
    >
      {/* Image / Placeholder */}
      <div className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-3xl"
        style={{ background: '#242424' }}>
        {barang.fotoPath
          ? <img src={`${BASE_URL}${barang.fotoPath}`} alt="barang" className="w-full h-full object-cover" />
          : <span>{kategori === 'DOKUMEN' ? '📄' : kategori === 'ELEKTRONIK' ? '📱' : '📦'}</span>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: colors.bg, color: colors.text }}>
            {kategori}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: isHilang ? 'rgba(239,68,68,0.15)' : 'rgba(200,255,0,0.15)',
              color: isHilang ? '#F87171' : '#C8FF00',
            }}>
            {isHilang ? '❌ Hilang' : '✅ Temuan'}
          </span>
        </div>
        <p className="text-white font-semibold text-sm line-clamp-2 mb-1">
          {barang.deskripsi || 'Tidak ada deskripsi'}
        </p>
        <p className="text-xs" style={{ color: '#8C8C8C' }}>
          📍 {barang.lokasiDeskripsi || 'Lokasi tidak diketahui'}
        </p>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('hilang');
  const [search, setSearch] = useState('');
  const [hilang, setHilang] = useState([]);
  const [temuan, setTemuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [resH, resT] = await Promise.all([getLaporanHilang(), getLaporanTemuan()]);
      setHilang(resH.data || []);
      setTemuan(resT.data || []);
    } catch (e) {
      console.log('Error fetch:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const data = tab === 'hilang' ? hilang : temuan;
  const filtered = data.filter((item) =>
    item.barang?.deskripsi?.toLowerCase().includes(search.toLowerCase()) ||
    item.barang?.lokasiDeskripsi?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">
              Halo, {user?.nama?.split(' ')[0] || 'Mahasiswa'} 👋
            </h1>
            <p style={{ color: '#8C8C8C' }} className="text-sm mt-1">Temukan barang yang kamu cari</p>
          </div>
          <div className="flex gap-3">
            <div className="p-3 rounded-xl text-center" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-xl font-black" style={{ color: '#C8FF00' }}>{hilang.length}</p>
              <p className="text-xs" style={{ color: '#8C8C8C' }}>Hilang</p>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <p className="text-xl font-black" style={{ color: '#C8FF00' }}>{temuan.length}</p>
              <p className="text-xs" style={{ color: '#8C8C8C' }}>Temuan</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="mb-6 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
        <input
          id="search-laporan"
          type="text"
          placeholder="Cari deskripsi atau lokasi barang..."
          className="input-field"
          style={{ paddingLeft: '48px' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-2xl" style={{ background: '#1a1a1a' }}>
        {[
          { key: 'hilang', label: '❌ Barang Hilang', count: hilang.length },
          { key: 'temuan', label: '✅ Barang Temuan', count: temuan.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            id={`tab-${key}`}
            onClick={() => setTab(key)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            style={{
              background: tab === key ? '#C8FF00' : 'transparent',
              color: tab === key ? '#0D0D0D' : '#8C8C8C',
            }}
          >
            {label}
            <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
              style={{
                background: tab === key ? 'rgba(0,0,0,0.15)' : '#2a2a2a',
                color: tab === key ? '#0D0D0D' : '#8C8C8C',
              }}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Refresh button */}
      <div className="flex justify-end mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setRefreshing(true); fetchData(); }}
          className="text-xs px-4 py-2 rounded-full font-semibold"
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#8C8C8C' }}
          disabled={refreshing}
        >
          {refreshing ? '⟳ Memuat...' : '⟳ Refresh'}
        </motion.button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: '#C8FF00', borderTopColor: 'transparent' }} />
          <p style={{ color: '#8C8C8C' }}>Memuat data...</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <span className="text-6xl">📭</span>
          <p className="font-semibold text-white">
            {search ? 'Tidak ada hasil pencarian' : 'Belum ada laporan'}
          </p>
          <p className="text-sm" style={{ color: '#8C8C8C' }}>
            {search ? `Coba kata kunci lain` : `Belum ada laporan ${tab === 'hilang' ? 'barang hilang' : 'barang temuan'}`}
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid gap-3">
            {filtered.map((item) => (
              <LaporanCard key={item.id} item={item} type={tab} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </Layout>
  );
}
