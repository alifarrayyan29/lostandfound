import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createLaporanHilang, createLaporanTemuan, uploadFile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const KATEGORI_LIST = ['UMUM', 'DOKUMEN', 'ELEKTRONIK'];
const KONDISI_LIST  = ['BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT'];

const KATEGORI_COLORS = {
  UMUM:       { bg: 'rgba(16,185,129,0.2)',  text: '#34D399', border: '#34D399' },
  DOKUMEN:    { bg: 'rgba(59,130,246,0.2)',  text: '#60A5FA', border: '#60A5FA' },
  ELEKTRONIK: { bg: 'rgba(139,92,246,0.2)', text: '#A78BFA', border: '#A78BFA' },
};
const KONDISI_COLORS = {
  BAIK:         { bg: 'rgba(16,185,129,0.2)',  text: '#34D399', border: '#34D399' },
  RUSAK_RINGAN: { bg: 'rgba(245,158,11,0.2)',  text: '#FBBF24', border: '#FBBF24' },
  RUSAK_BERAT:  { bg: 'rgba(239,68,68,0.2)',   text: '#F87171', border: '#F87171' },
};

function ChipSelect({ options, value, onChange, colorMap }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = value === opt;
        const color = colorMap?.[opt] || {};
        return (
          <motion.button
            key={opt}
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(opt)}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              background: isActive ? (color.bg || '#C8FF00') : '#242424',
              color: isActive ? (color.text || '#0D0D0D') : '#8C8C8C',
              border: `1.5px solid ${isActive ? (color.border || '#C8FF00') : '#2a2a2a'}`,
            }}
          >
            {opt.replace('_', ' ')}
          </motion.button>
        );
      })}
    </div>
  );
}

function InputField({ label, id, required, children }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#8C8C8C' }}>
        {label} {required && <span style={{ color: '#F87171' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function LaporPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jenis, setJenis]       = useState('hilang');
  const [kategori, setKategori] = useState('UMUM');
  const [kondisi, setKondisi]   = useState('BAIK');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const [form, setForm] = useState({
    deskripsi: '', lokasiDeskripsi: '',
    latitude: '', longitude: '',
    catatan: '', tglEvent: '',
    // Dokumen
    namaTertera: '', nomorIdentitas: '',
    // Elektronik
    merk: '', warnaPerangkat: '', tipePerangkat: '',
    // Umum
    warna: '', ukuran: '',
    file: null,
  });

  const setField = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.deskripsi || !form.lokasiDeskripsi || !form.file) {
      setError('Deskripsi, lokasi, dan foto barang wajib diisi.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // 1. Upload foto barang
      const fileRes = await uploadFile(form.file);
      const fotoPath = fileRes.data.path;

      // 2. Buat Laporan
      const now = form.tglEvent ? new Date(form.tglEvent).toISOString() : new Date().toISOString();
      const payload = {
        kategori,
        kondisi,
        deskripsi:       form.deskripsi,
        fotoPath:        fotoPath,
        lokasiDeskripsi: form.lokasiDeskripsi,
        latitude:        parseFloat(form.latitude)  || 0,
        longitude:       parseFloat(form.longitude) || 0,
        catatan:         form.catatan,
        // Waktu kejadian
        tglHilang:  now,
        tglTemuan:  now,
        // Kategori spesifik
        namaTertera:    form.namaTertera,
        nomorIdentitas: form.nomorIdentitas,
        merk:           form.merk,
        warnaPerangkat: form.warnaPerangkat,
        tipePerangkat:  form.tipePerangkat,
        warna:          form.warna,
        ukuran:         form.ukuran,
      };
      if (jenis === 'hilang') await createLaporanHilang(payload);
      else                    await createLaporanTemuan(payload);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Gagal mengirim laporan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setForm({ deskripsi: '', lokasiDeskripsi: '', latitude: '', longitude: '', catatan: '', tglEvent: '', namaTertera: '', nomorIdentitas: '', merk: '', warnaPerangkat: '', tipePerangkat: '', warna: '', ukuran: '', file: null });
  };

  if (success) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="text-7xl mb-6"
          >🎉</motion.div>
          <h2 className="text-2xl font-black text-white mb-3">Laporan Terkirim!</h2>
          <p className="mb-8 max-w-sm text-sm" style={{ color: '#8C8C8C' }}>
            Laporan barang <strong style={{ color: jenis === 'hilang' ? '#F87171' : '#C8FF00' }}>{jenis}</strong> kamu sudah kami terima.
            Sistem akan otomatis mencocokkan dengan laporan lainnya.
          </p>
          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.02 }} onClick={resetForm}
              className="btn-ghost px-6 py-3 text-sm font-semibold">
              Buat Laporan Lagi
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} onClick={() => navigate('/notifikasi')}
              className="btn-lime px-6 py-3 text-sm font-bold">
              Lihat Notifikasi →
            </motion.button>
          </div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white mb-1">Buat Laporan</h1>
        <p className="text-sm mb-8" style={{ color: '#8C8C8C' }}>Isi detail barang dengan lengkap dan akurat</p>

        {user?.statusAkun === 'PENDING_VERIFICATION' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-2xl text-center"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <span className="text-4xl block mb-3">⏳</span>
            <h3 className="font-bold text-lg mb-1" style={{ color: '#FBBF24' }}>Akun Belum Diverifikasi</h3>
            <p className="text-sm mx-auto max-w-sm" style={{ color: '#8C8C8C' }}>
              Kamu belum bisa membuat laporan karena akunmu sedang dalam proses verifikasi oleh Admin. Silakan tunggu beberapa saat atau hubungi pihak kampus.
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              key="err"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ─── Jenis Laporan ─── */}
          <InputField label="Jenis Laporan" required>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'hilang', emoji: '❌', label: 'Barang Hilang',  desc: 'Barang yang kamu kehilangan' },
                { key: 'temuan', emoji: '✅', label: 'Barang Temuan',  desc: 'Barang yang kamu temukan' },
              ].map(({ key, emoji, label, desc }) => (
                <motion.button key={key} type="button" id={`jenis-${key}`}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setJenis(key)}
                  className="p-4 rounded-2xl text-left transition-all"
                  style={{
                    background: jenis === key ? (key === 'hilang' ? 'rgba(239,68,68,0.1)' : 'rgba(200,255,0,0.08)') : '#1a1a1a',
                    border: `2px solid ${jenis === key ? (key === 'hilang' ? '#F87171' : '#C8FF00') : '#2a2a2a'}`,
                  }}>
                  <span className="text-2xl block mb-2">{emoji}</span>
                  <p className="font-bold text-white text-sm">{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#8C8C8C' }}>{desc}</p>
                </motion.button>
              ))}
            </div>
          </InputField>

          {/* ─── Kategori ─── */}
          <InputField label="Kategori Barang" required>
            <ChipSelect options={KATEGORI_LIST} value={kategori} onChange={setKategori} colorMap={KATEGORI_COLORS} />
          </InputField>

          {/* ─── Kondisi (hanya temuan) ─── */}
          <AnimatePresence>
            {jenis === 'temuan' && (
              <motion.div key="kondisi"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <InputField label="Kondisi Barang" required>
                  <ChipSelect options={KONDISI_LIST} value={kondisi} onChange={setKondisi} colorMap={KONDISI_COLORS} />
                </InputField>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Deskripsi ─── */}
          <InputField label="Deskripsi Barang" required>
            <textarea id="deskripsi" rows={4} className="input-field resize-none"
              placeholder="Jelaskan ciri-ciri barang secara detail (warna, merek, kondisi, ciri khas, dll)..."
              value={form.deskripsi} onChange={(e) => setField('deskripsi', e.target.value)} />
          </InputField>

          {/* ─── Field khusus kategori ─── */}
          <AnimatePresence mode="wait">
            {kategori === 'DOKUMEN' && (
              <motion.div key="dok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-4 p-4 rounded-2xl" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <div>
                  <label className="block text-xs font-semibold text-white mb-2">Nama Tertera</label>
                  <input id="namaTertera" type="text" className="input-field" placeholder="Nama pada dokumen"
                    value={form.namaTertera} onChange={(e) => setField('namaTertera', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white mb-2">Nomor Identitas</label>
                  <input id="nomorIdentitas" type="text" className="input-field" placeholder="NIM/NIP/NIK"
                    value={form.nomorIdentitas} onChange={(e) => setField('nomorIdentitas', e.target.value)} />
                </div>
              </motion.div>
            )}
            {kategori === 'ELEKTRONIK' && (
              <motion.div key="elek" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="grid grid-cols-3 gap-4 p-4 rounded-2xl" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div>
                  <label className="block text-xs font-semibold text-white mb-2">Merk</label>
                  <input id="merk" type="text" className="input-field" placeholder="Asus, Samsung..."
                    value={form.merk} onChange={(e) => setField('merk', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white mb-2">Tipe</label>
                  <input id="tipePerangkat" type="text" className="input-field" placeholder="Laptop, HP..."
                    value={form.tipePerangkat} onChange={(e) => setField('tipePerangkat', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white mb-2">Warna</label>
                  <input id="warnaPerangkat" type="text" className="input-field" placeholder="Hitam, Silver..."
                    value={form.warnaPerangkat} onChange={(e) => setField('warnaPerangkat', e.target.value)} />
                </div>
              </motion.div>
            )}
            {kategori === 'UMUM' && (
              <motion.div key="umum" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-4 p-4 rounded-2xl" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div>
                  <label className="block text-xs font-semibold text-white mb-2">Warna</label>
                  <input id="warna" type="text" className="input-field" placeholder="Merah, Biru..."
                    value={form.warna} onChange={(e) => setField('warna', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white mb-2">Ukuran</label>
                  <input id="ukuran" type="text" className="input-field" placeholder="Kecil, Sedang..."
                    value={form.ukuran} onChange={(e) => setField('ukuran', e.target.value)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Foto Barang ─── */}
          <InputField label="Foto Barang" required>
            <input id="fotoBarang" type="file" accept="image/*" className="input-field"
              onChange={(e) => setField('file', e.target.files[0])} />
          </InputField>

          {/* ─── Lokasi ─── */}
          <InputField label="Lokasi" required>
            <input id="lokasi" type="text" className="input-field"
              placeholder={jenis === 'hilang' ? 'Lokasi terakhir terlihat, contoh: Kantin Gedung B' : 'Lokasi ditemukan, contoh: Depan Perpustakaan'}
              value={form.lokasiDeskripsi} onChange={(e) => setField('lokasiDeskripsi', e.target.value)} />
          </InputField>

          {/* ─── Waktu ─── */}
          <InputField label={jenis === 'hilang' ? 'Estimasi Waktu Hilang' : 'Waktu Ditemukan'}>
            <input id="tglEvent" type="datetime-local" className="input-field"
              value={form.tglEvent} onChange={(e) => setField('tglEvent', e.target.value)} />
          </InputField>

          {/* ─── Koordinat ─── */}
          <InputField label="Koordinat GPS (opsional)">
            <div className="grid grid-cols-2 gap-3">
              <input id="latitude" type="number" step="any" placeholder="Latitude" className="input-field"
                value={form.latitude} onChange={(e) => setField('latitude', e.target.value)} />
              <input id="longitude" type="number" step="any" placeholder="Longitude" className="input-field"
                value={form.longitude} onChange={(e) => setField('longitude', e.target.value)} />
            </div>
            <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigator.geolocation?.getCurrentPosition(
                (pos) => { setField('latitude', pos.coords.latitude.toFixed(6)); setField('longitude', pos.coords.longitude.toFixed(6)); },
                () => setError('Akses lokasi ditolak.')
              )}
              className="mt-2 text-xs px-4 py-2 rounded-full font-semibold"
              style={{ background: 'rgba(200,255,0,0.08)', color: '#C8FF00', border: '1px solid rgba(200,255,0,0.2)' }}>
              📍 Gunakan Lokasi Saat Ini
            </motion.button>
          </InputField>

          {/* ─── Catatan ─── */}
          <InputField label="Catatan Tambahan">
            <textarea id="catatan" rows={3} className="input-field resize-none"
              placeholder="Informasi tambahan yang relevan (opsional)..."
              value={form.catatan} onChange={(e) => setField('catatan', e.target.value)}
              disabled={user?.statusAkun === 'PENDING_VERIFICATION'} />
          </InputField>

          <motion.button id="btn-submit-laporan" type="submit" 
            disabled={loading || user?.statusAkun === 'PENDING_VERIFICATION'}
            whileHover={{ scale: (loading || user?.statusAkun === 'PENDING_VERIFICATION') ? 1 : 1.02 }} 
            whileTap={{ scale: (loading || user?.statusAkun === 'PENDING_VERIFICATION') ? 1 : 0.97 }}
            className="w-full py-4 text-base font-bold rounded-xl transition-all"
            style={{ 
              background: user?.statusAkun === 'PENDING_VERIFICATION' ? '#242424' : '#C8FF00',
              color: user?.statusAkun === 'PENDING_VERIFICATION' ? '#555' : '#0D0D0D',
              opacity: loading ? 0.7 : 1,
              cursor: user?.statusAkun === 'PENDING_VERIFICATION' ? 'not-allowed' : 'pointer'
            }}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Mengirim laporan...
              </span>
            ) : user?.statusAkun === 'PENDING_VERIFICATION' ? 'Akses Laporan Terkunci 🔒' : `Kirim Laporan ${jenis === 'hilang' ? '📢' : '✅'}`}
          </motion.button>
        </form>
      </motion.div>
    </Layout>
  );
}
