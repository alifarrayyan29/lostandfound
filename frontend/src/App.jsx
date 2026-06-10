import { motion } from "framer-motion";
import { Search, ShieldCheck, MapPin } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-4xl w-full text-center"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-amber-500">
          Lost & Found PNL
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Platform pintar untuk melaporkan barang hilang dan temuan di lingkungan Politeknik Negeri Lhokseumawe.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors"
          >
            Lapor Barang Hilang
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold shadow-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Lapor Barang Temuan
          </motion.button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass dark:glass-dark p-6 rounded-3xl"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Matching</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Algoritma otomatis mencocokkan barang hilang dan temuan secara akurat.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass dark:glass-dark p-6 rounded-3xl"
          >
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-2xl flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
              <MapPin size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Geolokasi</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Pemetaan koordinat untuk mempermudah pencarian berbasis jarak.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass dark:glass-dark p-6 rounded-3xl"
          >
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Aman & Privat</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Komunikasi melalui ruang chat aman tanpa sebar kontak pribadi.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
