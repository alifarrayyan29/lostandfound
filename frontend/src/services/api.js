import axios from 'axios';

export const BASE_URL = 'http://localhost:8080';
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Otomatis sertakan JWT token di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 Unauthorized secara global
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// === AUTH ===
export const login    = (nim, password) => api.post('/auth/login', { nim, password });
export const register = (data)          => api.post('/auth/register', data);
export const getProfile = ()            => api.get('/auth/me');

// === LAPORAN ===
export const getLaporanHilang          = ()     => api.get('/laporan/hilang');
export const getLaporanTemuan          = ()     => api.get('/laporan/temuan');
export const getLaporanHilangSaya      = ()     => api.get('/laporan/hilang/saya');
export const getLaporanTemuanSaya      = ()     => api.get('/laporan/temuan/saya');
export const createLaporanHilang       = (data) => api.post('/laporan/hilang', data);
export const createLaporanTemuan       = (data) => api.post('/laporan/temuan', data);

// === MATCHING ===
export const getMatchesByHilang  = (id)     => api.get(`/matching/hilang/${id}`);
export const getMatchesByTemuan  = (id)     => api.get(`/matching/temuan/${id}`);
export const getMyMatches        = ()        => api.get('/matching/my-matches');
export const getMatchById        = (id)     => api.get(`/matching/${id}`);

// === CHAT / KLAIM (via REST) ===
export const getPesan           = (matchId) => api.get(`/klaim/${matchId}/pesan`);
export const kirimPesanRest     = (matchId, isiPesan) => api.post(`/klaim/${matchId}/pesan`, { isiPesan });
export const konfirmasiSelesai  = (matchId) => api.put(`/klaim/${matchId}/konfirmasi`);
export const tolakMatch         = (matchId) => api.put(`/klaim/${matchId}/tolak`);

// === ADMIN ===
export const getAdminStats      = ()     => api.get('/admin/stats');
export const getAdminAdvancedDashboard = () => api.get('/admin/dashboard-advanced');
export const getAdminUsers      = ()     => api.get('/admin/users');
export const verifyUser         = (id)   => api.put(`/admin/users/${id}/verify`);
export const deleteLaporanHilang = (id)  => api.delete(`/admin/laporan/hilang/${id}`);
export const deleteLaporanTemuan = (id)  => api.delete(`/admin/laporan/temuan/${id}`);

// === FILES ===
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export default api;
