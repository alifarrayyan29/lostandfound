import { useEffect, useState } from 'react';
import { getAdminStats, getAdminUsers, verifyUser, BASE_URL } from '../services/api';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/home');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers()
      ]);
      setStats(statsRes.data);
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
      fetchData(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal verifikasi user');
    }
  };

  if (loading) return <Layout><div className="loading-state">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="admin-dashboard fade-in">
        <h2 className="page-title">Admin Dashboard</h2>
        
        {stats && (
          <div className="stats-grid">
            <div className="stat-card glass-panel">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
            <div className="stat-card glass-panel">
              <h3>Laporan Hilang</h3>
              <p className="stat-value">{stats.totalLaporanHilang}</p>
            </div>
            <div className="stat-card glass-panel">
              <h3>Laporan Temuan</h3>
              <p className="stat-value">{stats.totalLaporanTemuan}</p>
            </div>
            <div className="stat-card glass-panel">
              <h3>Total Matches</h3>
              <p className="stat-value">{stats.totalMatches}</p>
            </div>
          </div>
        )}

        <div className="users-section glass-panel mt-4">
          <h3>Daftar Pengguna</h3>
          <div className="table-responsive">
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
                    <td>{u.nim}</td>
                    <td>{u.nama}</td>
                    <td>{u.nomorHp}</td>
                    <td>
                      {u.fotoKtmPath ? (
                        <a href={`${BASE_URL}${u.fotoKtmPath}`} target="_blank" rel="noreferrer">
                          <img src={`${BASE_URL}${u.fotoKtmPath}`} alt="KTM" className="w-12 h-12 object-cover rounded border border-gray-600" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-500">Tidak ada foto</span>
                      )}
                    </td>
                    <td><span className={`badge role-${u.role.toLowerCase()}`}>{u.role}</span></td>
                    <td>
                      <span className={`badge status-${u.statusAkun.toLowerCase().replace('_', '-')}`}>
                        {u.statusAkun.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {u.statusAkun === 'PENDING_VERIFICATION' && (
                        <button 
                          className="btn btn-sm btn-primary"
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
                    <td colSpan="6" className="text-center">Belum ada pengguna</td>
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
