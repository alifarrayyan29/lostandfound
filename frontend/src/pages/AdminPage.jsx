import { useEffect, useState } from 'react';
import { getAdminAdvancedDashboard, getAdminUsers, verifyUser, BASE_URL } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer } from 'react-leaflet';
import HeatmapLayer from '../components/HeatmapLayer';
import 'leaflet/dist/leaflet.css';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ label, value, icon, color, bg }) => (
  <div className="stat-card flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg, color }}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-2xl font-extrabold tracking-tight" style={{ color }}>{value ?? '-'}</p>
    </div>
  </div>
);

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'ADMIN') { navigate('/home'); return; }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, usersRes] = await Promise.all([
        getAdminAdvancedDashboard(),
        getAdminUsers()
      ]);
      setDashboardData(dashRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      alert('Gagal mengambil data admin');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    if (!window.confirm('Yakin ingin memverifikasi user ini?')) return;
    try {
      await verifyUser(id);
      alert('User berhasil diverifikasi!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal verifikasi user');
    }
  };

  if (loading) return (
    <Layout>
      <div className="loading-state">
        <div className="w-8 h-8 rounded-full border-t-blue-600 border-slate-200 animate-spin" style={{ borderWidth: '3px' }}></div>
        Memuat data...
      </div>
    </Layout>
  );

  const bs = dashboardData?.basicStats;
  const stats = [
    { label: 'Total Pengguna', value: bs?.totalUsers, color: '#2563EB', bg: '#EFF6FF',
      icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
    { label: 'Laporan Hilang', value: bs?.totalLaporanHilang, color: '#DC2626', bg: '#FEF2F2',
      icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg> },
    { label: 'Laporan Temuan', value: bs?.totalLaporanTemuan, color: '#16A34A', bg: '#F0FDF4',
      icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Total Match', value: bs?.totalMatches, color: '#7C3AED', bg: '#F5F3FF',
      icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg> },
  ];

  return (
    <Layout>
      <div className="fade-in space-y-6">
        {/* Header */}
        <div>
          <h1 className="page-title mb-1">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Pantau dan kelola seluruh aktivitas platform.</p>
        </div>

        {/* Stats Grid */}
        {dashboardData && <div className="stats-grid">{stats.map(s => <StatCard key={s.label} {...s} />)}</div>}

        {/* Charts + Map */}
        {dashboardData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="panel">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Statistik Laporan</h3>
              <p className="text-xs text-slate-400 mb-4">6 bulan terakhir</p>
              <div style={{ height: '260px' }}>
                <ResponsiveContainer>
                  <BarChart data={dashboardData.monthlyStats} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '13px' }}
                      cursor={{ fill: '#F8FAFC' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                    <Bar dataKey="hilang" name="Hilang" fill="#EF4444" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="temuan" name="Temuan" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Peta Sebaran</h3>
              <p className="text-xs text-slate-400 mb-4">Heatmap lokasi laporan</p>
              <div className="rounded-xl overflow-hidden" style={{ height: '260px' }}>
                <MapContainer center={[5.1192, 97.1428]} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                  {dashboardData.heatmapData?.length > 0 && <HeatmapLayer points={dashboardData.heatmapData} />}
                </MapContainer>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="panel">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daftar Pengguna</h3>
              <p className="text-xs text-slate-400 mt-0.5">{users.length} pengguna terdaftar</p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>NIM</th>
                  <th>Nama</th>
                  <th>Nomor HP</th>
                  <th>Foto KTM</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="font-mono text-xs text-slate-600">{u.nim}</td>
                    <td className="font-medium text-slate-800">{u.nama}</td>
                    <td className="text-slate-500">{u.nomorHp}</td>
                    <td>
                      {u.fotoKtmPath ? (
                        <a href={`${BASE_URL}${u.fotoKtmPath}`} target="_blank" rel="noreferrer" className="block w-10 h-10">
                          <img src={`${BASE_URL}${u.fotoKtmPath}`} alt="KTM" className="w-10 h-10 object-cover rounded-lg border border-slate-200 hover:scale-105 transition-transform" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge role-${u.role.toLowerCase()}`}>{u.role}</span>
                    </td>
                    <td>
                      <span className={`badge status-${u.statusAkun.toLowerCase().replace(/_/g, '-')}`}>
                        {u.statusAkun.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      {u.statusAkun === 'PENDING_VERIFICATION' && (
                        <button
                          className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          onClick={() => handleVerify(u.id)}
                        >
                          Verifikasi
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-slate-400 py-10 text-sm">Belum ada pengguna.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
