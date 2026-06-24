import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75H5.25A1.5 1.5 0 003.75 5.25v13.5A1.5 1.5 0 005.25 20.25h13.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H14.25M9.75 3.75h4.5M9.75 3.75a1.5 1.5 0 01-1.5-1.5V1.5M14.25 3.75a1.5 1.5 0 001.5-1.5V1.5" />
      </svg>
    ),
    title: 'Laporan Mudah',
    desc: 'Buat laporan barang hilang atau temuan dalam hitungan detik dengan form yang intuitif.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Smart Matching',
    desc: 'Sistem otomatis mencocokkan laporan hilang dengan temuan berdasarkan deskripsi yang relevan.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    title: 'Live Chat',
    desc: 'Komunikasi real-time langsung antara pelapor dan penemu untuk proses klaim yang aman.',
  },
];

const stats = [
  { num: '500+', label: 'Laporan Aktif' },
  { num: '80%',  label: 'Tingkat Match' },
  { num: '300+', label: 'Pengguna' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm bg-blue-600 text-white">L</div>
          <span className="font-bold text-slate-900 text-base">Lost & Found PNL</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            Masuk
          </Link>
          <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Daftar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-6 border border-blue-100">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Platform Kehilangan & Temuan — Politeknik Negeri Lhokseumawe
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-slate-900 mb-5">
            Temukan barang{' '}
            <span className="text-blue-600">yang hilang</span>{' '}
            lebih cepat
          </h1>

          <p className="text-slate-500 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Platform digital untuk melaporkan dan menemukan barang hilang di lingkungan kampus PNL. Smart Matching kami akan membantu!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="px-7 py-3.5 bg-blue-600 text-white font-semibold rounded-xl text-sm shadow-md hover:bg-blue-700 transition-colors"
              >
                Mulai Gunakan — Gratis
              </motion.button>
            </Link>
            <Link to="/login" className="px-7 py-3.5 bg-white text-slate-700 font-semibold rounded-xl text-sm border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
              Sudah punya akun? Masuk →
            </Link>
          </div>
        </motion.div>

        {/* Mock UI Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          className="mt-16 max-w-4xl w-full mx-auto"
        >
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-xl">
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              {/* Mock toolbar */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                <div className="flex-1 mx-3 h-6 bg-slate-100 rounded-md flex items-center px-3">
                  <span className="text-[10px] text-slate-400 font-medium">lostandfound.pnl.ac.id</span>
                </div>
              </div>
              {/* Mock content rows */}
              <div className="space-y-3">
                {[
                  { icon: '📱', tag: 'ELEKTRONIK', tagColor: 'bg-purple-50 text-purple-700', badge: '❌ Hilang', badgeColor: 'bg-red-50 text-red-600', desc: 'Handphone Samsung Galaxy A54 warna hitam', loc: 'Gedung B, Lab Komputer 2' },
                  { icon: '📄', tag: 'DOKUMEN', tagColor: 'bg-blue-50 text-blue-700', badge: '✅ Temuan', badgeColor: 'bg-green-50 text-green-700', desc: 'KTM atas nama M. Rizky Fauzan', loc: 'Kantin Utama, meja pojok' },
                  { icon: '📦', tag: 'UMUM', tagColor: 'bg-green-50 text-green-700', badge: '❌ Hilang', badgeColor: 'bg-red-50 text-red-600', desc: 'Tas Ransel hitam merek Eiger', loc: 'Parkiran Gedung Rektorat' },
                ].map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">{row.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${row.tagColor}`}>{row.tag}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${row.badgeColor}`}>{row.badge}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 truncate">{row.desc}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">📍 {row.loc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 border-y border-slate-100 bg-slate-50">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 px-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <h3 className="text-3xl font-extrabold text-blue-600 tracking-tight">{s.num}</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Semua yang kamu butuhkan</h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">Platform lengkap untuk mengelola laporan barang hilang secara digital, cepat, dan akurat.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center bg-blue-600 rounded-3xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">Siap untuk memulai?</h2>
          <p className="text-blue-100 text-sm mb-6">Bergabung dengan ratusan mahasiswa PNL yang sudah menemukan barang mereka.</p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all"
            >
              Daftar Sekarang — Gratis
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-slate-100">
        <p className="text-sm text-slate-400">
          &copy; 2026 Politeknik Negeri Lhokseumawe. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
