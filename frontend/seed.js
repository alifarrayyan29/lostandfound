import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

async function seed() {
  try {
    console.log('1. Register Alif...');
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        nim: '2024573010085', nama: 'Alif', password: 'alif123', nomorHp: '0811111111', fotoKtmPath: '/api/files/dummy.jpg'
      });
    } catch(e) { console.log('Already registered'); }

    console.log('2. Register Sindi...');
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        nim: '2023573010011', nama: 'Sindi', password: 'sindi123', nomorHp: '0822222222', fotoKtmPath: '/api/files/dummy.jpg'
      });
    } catch(e) { console.log('Already registered'); }

    console.log('3. Login Admin to verify...');
    const adminRes = await axios.post(`${BASE_URL}/auth/login`, { nim: 'admin', password: 'admin123' });
    const adminToken = adminRes.data.data.token;
    
    const users = await axios.get(`${BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${adminToken}` } });
    const alifId = users.data.find(u => u.nim === '2024573010085').id;
    const sindiId = users.data.find(u => u.nim === '2023573010011').id;

    console.log('4. Verifying users...');
    await axios.put(`${BASE_URL}/admin/users/${alifId}/verify`, {}, { headers: { Authorization: `Bearer ${adminToken}` } });
    await axios.put(`${BASE_URL}/admin/users/${sindiId}/verify`, {}, { headers: { Authorization: `Bearer ${adminToken}` } });

    console.log('5. Login Alif...');
    const alifRes = await axios.post(`${BASE_URL}/auth/login`, { nim: '2024573010085', password: 'alif123' });
    const alifToken = alifRes.data.data.token;

    console.log('6. Alif creates Laporan Hilang...');
    await axios.post(`${BASE_URL}/laporan/hilang`, {
      kategori: 'ELEKTRONIK', kondisi: 'BAIK', deskripsi: 'Laptop Asus ROG Hitam',
      lokasiDeskripsi: 'Perpustakaan Lt. 2', fotoPath: '/api/files/dummy.jpg',
      latitude: 0, longitude: 0, catatan: 'Ada stiker NASA',
      tglHilang: new Date().toISOString(), merk: 'Asus', warnaPerangkat: 'Hitam', tipePerangkat: 'Laptop'
    }, { headers: { Authorization: `Bearer ${alifToken}` } });

    console.log('7. Login Sindi...');
    const sindiRes = await axios.post(`${BASE_URL}/auth/login`, { nim: '2023573010011', password: 'sindi123' });
    const sindiToken = sindiRes.data.data.token;

    console.log('8. Sindi creates Laporan Temuan...');
    await axios.post(`${BASE_URL}/laporan/temuan`, {
      kategori: 'ELEKTRONIK', kondisi: 'BAIK', deskripsi: 'Menemukan Laptop Asus ROG Hitam di meja',
      lokasiDeskripsi: 'Meja baca Perpustakaan', fotoPath: '/api/files/dummy.jpg',
      latitude: 0, longitude: 0, catatan: 'Ketinggalan di meja',
      tglTemuan: new Date().toISOString(), merk: 'Asus', warnaPerangkat: 'Hitam', tipePerangkat: 'Laptop'
    }, { headers: { Authorization: `Bearer ${sindiToken}` } });

    console.log('All done successfully!');
  } catch (err) {
    console.error('Error seeding data:', err.response?.data || err.message);
  }
}

seed();
