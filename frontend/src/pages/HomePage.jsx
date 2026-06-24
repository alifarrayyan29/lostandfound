import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getLaporanHilang, getLaporanTemuan } from '../services/api';
import Layout from '../components/Layout';

const BASE_URL = 'http://localhost:8080';

const KATEGORI_META = {
  DOKUMEN:    { bg: '#EFF6FF', text: '#2563EB', icon: '📄' },
  ELEKTRONIK: { bg: '#F5F3FF', text: '#7C3AED', icon: '📱' },
  UMUM:       { bg: '#F0FDF4', text: '#16A34A', icon: '📦' },
};

function LaporanCard({ item, type }) {
  const barang = item.barang || {};
  const kategori = barang.kategori || 'UMUM';
  const meta = KATEGORI_META[kategori] || KATEGORI_META.UMUM;
  const isHilang = type === 'hilang';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="flex gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-md hover:border-slate-300 transition-all"
    >
      {/* Image */}
      <div
        className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center text-2xl"
        style={{ background: meta.bg }}
      >
        {barang.fotoPath
          ? <img src={`${BASE_URL}${barang.fotoPath}`} alt="barang" className="w-full h-full object-cover" />
          : <span>{meta.icon}</span>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: meta.bg, color: meta.text }}>
            {kategori}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${isHilang ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
            {isHilang ? '⚠️ Hilang' : '✅ Temuan'}
          </span>
        </div>
        <p className="text-slate-900 font-semibold text-sm line-clamp-2 leading-snug mb-1">
          {barang.deskripsi || 'Tidak ada deskripsi'}
        </p>
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {barang.lokasiDeskripsi || 'Lokasi tidak diketahui'}
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
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Halo, {user?.nama?.split(' ')[0] || 'Mahasiswa'} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">Cari dan temukan laporan barang di kampus PNL.</p>
          </div>
          <div className="flex gap-2.5">
            {[
              { label: 'Hilang', count: hilang.length, color: '#EF4444', bg: '#FEF2F2' },
              { label: 'Temuan', count: temuan.length, color: '#16A34A', bg: '#F0FDF4' },
            ].map((s) => (
              <div key={s.label} className="px-4 py-2.5 rounded-xl text-center border border-slate-200 bg-white">
                <p className="text-lg font-bold" style={{ color: s.color }}>{s.count}</p>
                <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="mb-5 relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          id="search-laporan"
          type="text"
          placeholder="Cari deskripsi atau lokasi barang..."
          className="input-field"
          style={{ paddingLeft: '40px' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs + Refresh */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex p-1 gap-1 rounded-xl border border-slate-200 bg-slate-50">
          {[
            { key: 'hilang', label: 'Barang Hilang', count: hilang.length },
            { key: 'temuan', label: 'Barang Temuan', count: temuan.length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              id={`tab-${key}`}
              onClick={() => setTab(key)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: tab === key ? '#FFFFFF' : 'transparent',
                color: tab === key ? '#0F172A' : '#64748B',
                boxShadow: tab === key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                border: tab === key ? '1px solid #E2E8F0' : '1px solid transparent',
              }}
            >
              {label}
              <span className="text-xs px-1.5 py-0.5 rounded-md font-bold"
                style={{
                  background: tab === key ? (key === 'hilang' ? '#FEF2F2' : '#F0FDF4') : '#E2E8F0',
                  color: tab === key ? (key === 'hilang' ? '#EF4444' : '#16A34A') : '#94A3B8',
                }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setRefreshing(true); fetchData(); }}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold border border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-all"
        >
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={refreshing ? 'animate-spin' : ''}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          {refreshing ? 'Memuat...' : 'Refresh'}
        </motion.button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-slate-200 border-t-blue-600 animate-spin" style={{ borderWidth: '3px' }} />
          <p className="text-sm text-slate-400 font-medium">Memuat data...</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">📭</div>
          <p className="font-semibold text-slate-700">
            {search ? 'Tidak ada hasil pencarian' : 'Belum ada laporan'}
          </p>
          <p className="text-sm text-slate-400">
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
