import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createLaporanHilang, createLaporanTemuan, uploadFile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const KATEGORI_LIST = ['UMUM', 'DOKUMEN', 'ELEKTRONIK'];
const KONDISI_LIST  = ['BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT'];

const KATEGORI_META = {
  UMUM:       { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0', icon: '📦' },
  DOKUMEN:    { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE', icon: '📄' },
  ELEKTRONIK: { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE', icon: '📱' },
};
const KONDISI_META = {
  BAIK:         { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
  RUSAK_RINGAN: { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
  RUSAK_BERAT:  { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
};

function ChipSelect({ options, value, onChange, metaMap }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = value === opt;
        const meta = metaMap?.[opt] || {};
        return (
          <motion.button
            key={opt}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(opt)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: isActive ? meta.bg : '#F8FAFC',
              color: isActive ? meta.text : '#64748B',
              border: `1.5px solid ${isActive ? meta.border : '#E2E8F0'}`,
            }}
          >
            {opt.replace(/_/g, ' ')}
          </motion.button>
        );
      })}
    </div>
  );
}

function FormField({ label, required, hint, children }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <label className="block text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hint && <span className="text-xs text-slate-400">({hint})</span>}
      </div>
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
    namaTertera: '', nomorIdentitas: '',
    merk: '', warnaPerangkat: '', tipePerangkat: '',
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
      const fileRes = await uploadFile(form.file);
      const fotoPath = fileRes.data.path;
      const now = form.tglEvent ? new Date(form.tglEvent).toISOString() : new Date().toISOString();
      const payload = {
        kategori, kondisi,
        deskripsi: form.deskripsi,
        fotoPath,
        lokasiDeskripsi: form.lokasiDeskripsi,
        latitude: parseFloat(form.latitude) || 0,
        longitude: parseFloat(form.longitude) || 0,
        catatan: form.catatan,
        tglHilang: now, tglTemuan: now,
        namaTertera: form.namaTertera, nomorIdentitas: form.nomorIdentitas,
        merk: form.merk, warnaPerangkat: form.warnaPerangkat, tipePerangkat: form.tipePerangkat,
        warna: form.warna, ukuran: form.ukuran,
      };
      if (jenis === 'hilang') await createLaporanHilang(payload);
      else await createLaporanTemuan(payload);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Gagal mengirim laporan.');
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
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-green-50 border border-green-200 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5">🎉</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Laporan Terkirim!</h2>
          <p className="mb-7 max-w-sm text-sm text-slate-500 leading-relaxed">
            Laporan barang <strong className={jenis === 'hilang' ? 'text-red-600' : 'text-green-600'}>{jenis}</strong> kamu sudah kami terima. Sistem akan otomatis mencocokkan dengan laporan lainnya.
          </p>
          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.02 }} onClick={resetForm}
              className="px-6 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
              Buat Laporan Lagi
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} onClick={() => navigate('/notifikasi')}
              className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Lihat Notifikasi →
            </motion.button>
          </div>
        </motion.div>
      </Layout>
    );
  }

  const isPending = user?.statusAkun === 'PENDING_VERIFICATION';

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-7">
          <h1 className="page-title mb-1">Buat Laporan</h1>
          <p className="text-sm text-slate-500">Isi detail barang dengan lengkap dan akurat.</p>
        </div>

        {isPending && (
          <div className="mb-7 p-4 rounded-xl flex items-start gap-3 bg-amber-50 border border-amber-200">
            <div className="text-xl flex-shrink-0">⏳</div>
            <div>
              <h3 className="font-semibold text-amber-800 text-sm mb-0.5">Akun Belum Diverifikasi</h3>
              <p className="text-xs text-amber-700 leading-relaxed">Kamu belum bisa membuat laporan. Akun sedang dalam proses verifikasi oleh Admin.</p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div key="err" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 p-3.5 rounded-xl text-sm flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 mt-0.5"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Jenis Laporan */}
          <FormField label="Jenis Laporan" required>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'hilang', icon: '⚠️', label: 'Barang Hilang', desc: 'Barang milikmu yang hilang', active: { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' } },
                { key: 'temuan', icon: '✅', label: 'Barang Temuan', desc: 'Barang yang kamu temukan', active: { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A' } },
              ].map(({ key, icon, label, desc, active }) => (
                <motion.button key={key} type="button" id={`jenis-${key}`}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={() => setJenis(key)}
                  className="p-4 rounded-xl text-left transition-all"
                  style={{
                    background: jenis === key ? active.bg : '#F8FAFC',
                    border: `2px solid ${jenis === key ? active.border : '#E2E8F0'}`,
                  }}>
                  <span className="text-2xl block mb-2">{icon}</span>
                  <p className="font-semibold text-sm text-slate-900">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </motion.button>
              ))}
            </div>
          </FormField>

          {/* Kategori */}
          <FormField label="Kategori Barang" required>
            <ChipSelect options={KATEGORI_LIST} value={kategori} onChange={setKategori} metaMap={KATEGORI_META} />
          </FormField>

          {/* Kondisi (hanya temuan) */}
          <AnimatePresence>
            {jenis === 'temuan' && (
              <motion.div key="kondisi" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <FormField label="Kondisi Barang" required>
                  <ChipSelect options={KONDISI_LIST} value={kondisi} onChange={setKondisi} metaMap={KONDISI_META} />
                </FormField>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Deskripsi */}
          <FormField label="Deskripsi Barang" required>
            <textarea id="deskripsi" rows={4} className="input-field resize-none"
              placeholder="Jelaskan ciri-ciri barang secara detail (warna, merek, kondisi, ciri khas, dll)..."
              value={form.deskripsi} onChange={(e) => setField('deskripsi', e.target.value)} />
          </FormField>

          {/* Field khusus kategori */}
          <AnimatePresence mode="wait">
            {kategori === 'DOKUMEN' && (
              <motion.div key="dok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div>
                  <label className="block text-xs font-semibold text-blue-700 mb-1.5">Nama Tertera</label>
                  <input id="namaTertera" type="text" className="input-field" placeholder="Nama pada dokumen"
                    value={form.namaTertera} onChange={(e) => setField('namaTertera', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-700 mb-1.5">Nomor Identitas</label>
                  <input id="nomorIdentitas" type="text" className="input-field" placeholder="NIM/NIP/NIK"
                    value={form.nomorIdentitas} onChange={(e) => setField('nomorIdentitas', e.target.value)} />
                </div>
              </motion.div>
            )}
            {kategori === 'ELEKTRONIK' && (
              <motion.div key="elek" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-purple-50 border border-purple-100">
                <div>
                  <label className="block text-xs font-semibold text-purple-700 mb-1.5">Merk</label>
                  <input id="merk" type="text" className="input-field" placeholder="Asus, Samsung..."
                    value={form.merk} onChange={(e) => setField('merk', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-700 mb-1.5">Tipe</label>
                  <input id="tipePerangkat" type="text" className="input-field" placeholder="Laptop, HP..."
                    value={form.tipePerangkat} onChange={(e) => setField('tipePerangkat', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-700 mb-1.5">Warna</label>
                  <input id="warnaPerangkat" type="text" className="input-field" placeholder="Hitam, Silver..."
                    value={form.warnaPerangkat} onChange={(e) => setField('warnaPerangkat', e.target.value)} />
                </div>
              </motion.div>
            )}
            {kategori === 'UMUM' && (
              <motion.div key="umum" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-green-50 border border-green-100">
                <div>
                  <label className="block text-xs font-semibold text-green-700 mb-1.5">Warna</label>
                  <input id="warna" type="text" className="input-field" placeholder="Merah, Biru..."
                    value={form.warna} onChange={(e) => setField('warna', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-green-700 mb-1.5">Ukuran</label>
                  <input id="ukuran" type="text" className="input-field" placeholder="Kecil, Sedang..."
                    value={form.ukuran} onChange={(e) => setField('ukuran', e.target.value)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Foto */}
          <FormField label="Foto Barang" required>
            <input id="fotoBarang" type="file" accept="image/*"
              className="w-full text-sm text-slate-500 border border-slate-200 rounded-xl px-4 py-2.5 bg-white cursor-pointer focus:outline-none focus:border-blue-400
                file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors"
              onChange={(e) => setField('file', e.target.files[0])} />
          </FormField>

          {/* Lokasi */}
          <FormField label="Lokasi" required>
            <input id="lokasi" type="text" className="input-field"
              placeholder={jenis === 'hilang' ? 'Lokasi terakhir terlihat, contoh: Kantin Gedung B' : 'Lokasi ditemukan, contoh: Depan Perpustakaan'}
              value={form.lokasiDeskripsi} onChange={(e) => setField('lokasiDeskripsi', e.target.value)} />
          </FormField>

          {/* Waktu */}
          <FormField label={jenis === 'hilang' ? 'Estimasi Waktu Hilang' : 'Waktu Ditemukan'} hint="opsional">
            <input id="tglEvent" type="datetime-local" className="input-field"
              value={form.tglEvent} onChange={(e) => setField('tglEvent', e.target.value)} />
          </FormField>

          {/* Koordinat GPS */}
          <FormField label="Koordinat GPS" hint="opsional">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <input id="latitude" type="number" step="any" placeholder="Latitude" className="input-field"
                value={form.latitude} onChange={(e) => setField('latitude', e.target.value)} />
              <input id="longitude" type="number" step="any" placeholder="Longitude" className="input-field"
                value={form.longitude} onChange={(e) => setField('longitude', e.target.value)} />
            </div>
            <motion.button type="button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={() => navigator.geolocation?.getCurrentPosition(
                (pos) => { setField('latitude', pos.coords.latitude.toFixed(6)); setField('longitude', pos.coords.longitude.toFixed(6)); },
                () => setError('Akses lokasi ditolak.')
              )}
              className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg font-semibold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              Gunakan Lokasi Saat Ini
            </motion.button>
          </FormField>

          {/* Catatan */}
          <FormField label="Catatan Tambahan" hint="opsional">
            <textarea id="catatan" rows={3} className="input-field resize-none"
              placeholder="Informasi tambahan yang relevan..."
              value={form.catatan} onChange={(e) => setField('catatan', e.target.value)}
              disabled={isPending} />
          </FormField>

          {/* Submit */}
          <motion.button id="btn-submit-laporan" type="submit"
            disabled={loading || isPending}
            whileHover={{ scale: (loading || isPending) ? 1 : 1.01 }}
            whileTap={{ scale: (loading || isPending) ? 1 : 0.98 }}
            className="w-full py-3.5 text-sm font-semibold rounded-xl transition-all flex justify-center items-center gap-2"
            style={{
              background: isPending ? '#E2E8F0' : '#2563EB',
              color: isPending ? '#94A3B8' : '#FFFFFF',
              boxShadow: isPending ? 'none' : '0 4px 12px rgba(37,99,235,0.3)',
              cursor: (loading || isPending) ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
            }}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Mengirim laporan...
              </>
            ) : isPending ? 'Akses Laporan Terkunci 🔒' : `Kirim Laporan ${jenis === 'hilang' ? '📢' : '✅'}`}
          </motion.button>
        </form>
      </motion.div>
    </Layout>
  );
}
