# 📋 Dokumentasi Sistem: Aplikasi Lost and Found
## Politeknik Negeri Lhokseumawe (PNL)

> **Versi Dokumen:** 1.0.0  
> **Status:** Draft Arsitektur  
> **Tanggal:** Juni 2025  
> **Penulis:** Tim Pengembang PNL  

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Tech Stack & Lingkungan Teknologi](#2-tech-stack--lingkungan-teknologi)
3. [Arsitektur Sistem](#3-arsitektur-sistem)
4. [Autentikasi & Keamanan](#4-autentikasi--keamanan)
5. [Alur Pengguna (User Flow)](#5-alur-pengguna-user-flow)
6. [Desain Domain & Pola Desain](#6-desain-domain--pola-desain)
7. [Struktur Database (ERD)](#7-struktur-database-erd)
8. [Desain API (REST Endpoints)](#8-desain-api-rest-endpoints)
9. [Fitur Lanjutan (Advanced Features)](#9-fitur-lanjutan-advanced-features)
10. [Konfigurasi & Deployment](#10-konfigurasi--deployment)
11. [Catatan Pengembangan & Roadmap](#11-catatan-pengembangan--roadmap)

---

## 1. Ringkasan Eksekutif

### 1.1 Latar Belakang

Politeknik Negeri Lhokseumawe (PNL) adalah lingkungan kampus dengan ribuan civitas akademika yang aktif setiap harinya. Kasus kehilangan barang—mulai dari kartu identitas, perangkat elektronik, hingga perlengkapan perkuliahan—merupakan kejadian yang sering terjadi namun penanganannya masih bersifat manual dan tidak terstruktur (pengumuman lisan, grup WhatsApp umum, tempelan kertas).

### 1.2 Tujuan Sistem

Sistem **Lost and Found PNL** dibangun untuk:

- Menyediakan platform digital terpusat untuk melaporkan barang hilang dan barang temuan di lingkungan kampus.
- Mempertemukan pemilik barang dengan penemu secara aman dan terverifikasi.
- Memanfaatkan teknologi geolokasi dan algoritma cerdas untuk mempercepat proses pencocokan barang.
- Memastikan setiap transaksi dapat dipertanggungjawabkan melalui identitas mahasiswa yang terverifikasi.

### 1.3 Prinsip Desain

| Prinsip | Implementasi |
|---|---|
| **Identity-First** | Setiap aksi terikat pada NIM yang terverifikasi |
| **Fraud Prevention** | Validasi KTM fisik sebelum akun aktif |
| **Smart Matching** | Algoritma skor kecocokan berbasis kategori, kata kunci, dan lokasi |
| **Privacy-Aware** | Komunikasi dijembatani sistem, bukan pertukaran kontak langsung |
| **Notification-Driven** | Notifikasi WhatsApp proaktif untuk potensi kecocokan |

---

## 2. Tech Stack & Lingkungan Teknologi

### 2.1 Stack Utama

```
┌─────────────────────────────────────────────────────────────┐
│                    TECH STACK OVERVIEW                      │
├──────────────────┬──────────────────────────────────────────┤
│ Layer            │ Teknologi                                │
├──────────────────┼──────────────────────────────────────────┤
│ Backend          │ Java 17 + Spring Boot 3.x                │
│ Build Tool       │ Apache Maven                             │
│ Database         │ MySQL 8.x (via XAMPP - Development)      │
│ ORM              │ Spring Data JPA / Hibernate              │
│ Security         │ Spring Security + JWT                    │
│ File Storage     │ Local FileSystem / MinIO (future)        │
│ Messaging        │ WebSocket (STOMP Protocol)               │
│ Notifikasi       │ WhatsApp Business API Gateway            │
│ Geolokasi        │ Haversine Formula (custom impl.)         │
│ Frontend         │ React.js / Flutter (TBD)                 │
│ API Style        │ RESTful JSON                             │
└──────────────────┴──────────────────────────────────────────┘
```

### 2.2 Dependensi Maven Utama

```xml
<!-- pom.xml - Dependensi Utama -->
<dependencies>
    <!-- Core Spring Boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Database -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.x</version>
    </dependency>

    <!-- File Upload -->
    <dependency>
        <groupId>commons-io</groupId>
        <artifactId>commons-io</artifactId>
        <version>2.15.x</version>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

### 2.3 Konfigurasi Dasar (`application.properties`)

```properties
# Server
server.port=8081
spring.application.name=lostandfound-pnl

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/db_lostandfound
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# File Upload
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=10MB
app.file.upload-dir=./uploads

# JWT
app.jwt.secret=PNL_LOST_FOUND_JWT_SECRET_KEY_2025
app.jwt.expiration-ms=86400000

# WhatsApp Gateway
app.whatsapp.api-url=https://api.whatsapp-gateway.com
app.whatsapp.token=YOUR_WA_API_TOKEN
```

---

## 3. Arsitektur Sistem

### 3.1 Gambaran Arsitektur (High-Level)

```
╔══════════════════════════════════════════════════════════════════════╗
║                     ARSITEKTUR SISTEM                                ║
║                     Lost and Found PNL                               ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ┌─────────────────────────────────┐                                 ║
║  │         CLIENT LAYER            │                                 ║
║  │  ┌────────────┐ ┌────────────┐  │                                 ║
║  │  │  React Web │ │  Flutter   │  │                                 ║
║  │  │    App     │ │  Mobile    │  │                                 ║
║  │  └─────┬──────┘ └─────┬──────┘  │                                 ║
║  └────────┼──────────────┼─────────┘                                 ║
║           │  HTTP/REST   │ WebSocket                                 ║
║           ▼              ▼                                           ║
║  ┌──────────────────────────────────────────────────────────────┐    ║
║  │                    BACKEND LAYER (Spring Boot :8081)         │    ║
║  │                                                              │    ║
║  │  ┌──────────────┐  ┌─────────────┐  ┌──────────────────┐    │    ║
║  │  │  Controller  │  │  Service    │  │   Repository     │    │    ║
║  │  │  (REST API)  │→ │  (Business  │→ │   (JPA/Spring    │    │    ║
║  │  │              │  │   Logic)    │  │    Data)         │    │    ║
║  │  └──────────────┘  └─────────────┘  └────────┬─────────┘    │    ║
║  │                                              │               │    ║
║  │  ┌─────────────────────────────────┐         │               │    ║
║  │  │      Security Layer             │         │               │    ║
║  │  │  JWT Filter → AuthFilter        │         │               │    ║
║  │  └─────────────────────────────────┘         │               │    ║
║  │                                              │               │    ║
║  │  ┌─────────────────────────────────┐         │               │    ║
║  │  │      Advanced Features          │         │               │    ║
║  │  │  - Smart Matching Engine        │         │               │    ║
║  │  │  - Geolocation Service          │         │               │    ║
║  │  │  - WebSocket Chat Handler       │         │               │    ║
║  │  │  - WhatsApp Notif. Service      │         │               │    ║
║  │  └─────────────────────────────────┘         │               │    ║
║  └──────────────────────────────────────────────┼───────────────┘    ║
║                                                 │                    ║
║           ┌─────────────────────────────────────┘                    ║
║           ▼                                                          ║
║  ┌──────────────────────┐   ┌──────────────────────┐                 ║
║  │   MySQL Database     │   │   File System        │                 ║
║  │  (XAMPP - Dev)       │   │  (Upload Storage)    │                 ║
║  │  db_lostandfound     │   │  /uploads/ktm/       │                 ║
║  │                      │   │  /uploads/barang/    │                 ║
║  └──────────────────────┘   └──────────────────────┘                 ║
║                                                                      ║
║  ┌──────────────────────┐                                             ║
║  │  External Services   │                                             ║
║  │  WhatsApp API Gateway│                                             ║
║  └──────────────────────┘                                             ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 3.2 Struktur Package Spring Boot

```
com.pnl.lostandfound/
├── LostAndFoundApplication.java         # Entry point
│
├── config/
│   ├── SecurityConfig.java              # Spring Security + JWT
│   ├── WebSocketConfig.java             # STOMP WebSocket config
│   └── CorsConfig.java                  # CORS policy
│
├── controller/
│   ├── AuthController.java              # /api/auth/**
│   ├── BarangController.java            # /api/barang/**
│   ├── LaporanController.java           # /api/laporan/**
│   ├── MatchingController.java          # /api/matching/**
│   ├── PesanController.java             # /api/pesan/**
│   └── AdminController.java             # /api/admin/**
│
├── service/
│   ├── AuthService.java
│   ├── BarangService.java
│   ├── LaporanService.java
│   ├── MatchingService.java             # Smart Matching Algorithm
│   ├── GeolocationService.java          # Radius Search
│   ├── NotifikasiService.java           # WhatsApp Gateway
│   ├── PesanService.java                # Direct Messaging
│   └── FileStorageService.java          # File Upload
│
├── repository/
│   ├── UserRepository.java
│   ├── BarangRepository.java
│   ├── LaporanHilangRepository.java
│   ├── LaporanTemuanRepository.java
│   ├── MatchRepository.java
│   └── PesanRepository.java
│
├── entity/
│   ├── User.java                        # Entitas pengguna (NIM-based)
│   ├── Barang.java                      # Parent class (STI)
│   ├── BarangDokumen.java               # Child: Dokumen
│   ├── BarangElektronik.java            # Child: Elektronik
│   ├── BarangUmum.java                  # Child: Kategori umum
│   ├── LaporanHilang.java
│   ├── LaporanTemuan.java
│   ├── MatchResult.java                 # Hasil pencocokan
│   └── Pesan.java                       # Chat message
│
├── dto/
│   ├── request/
│   │   ├── RegisterRequest.java
│   │   ├── LoginRequest.java
│   │   ├── LaporanHilangRequest.java
│   │   └── LaporanTemuanRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── BarangResponse.java
│       └── MatchResponse.java
│
├── factory/
│   ├── BarangFactory.java               # Factory interface
│   ├── BarangDokumenFactory.java
│   ├── BarangElektronikFactory.java
│   └── BarangUmumFactory.java
│
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
│
└── exception/
    ├── GlobalExceptionHandler.java
    ├── ResourceNotFoundException.java
    └── UnauthorizedAccessException.java
```

---

## 4. Autentikasi & Keamanan

### 4.1 Mekanisme Registrasi Berbasis NIM

Sistem menggunakan **NIM (Nomor Induk Mahasiswa)** sebagai identitas utama, bukan email konvensional. Ini memastikan bahwa hanya mahasiswa aktif PNL yang dapat menggunakan sistem.

```
ALUR REGISTRASI
───────────────────────────────────────────────────────────
  [Mahasiswa]
      │
      ├─ 1. Isi form: NIM, Nama, No.HP, Password
      │
      ├─ 2. Upload foto KTM (Kartu Tanda Mahasiswa)
      │       └── Validasi: format file (JPG/PNG), max 5MB
      │
      ▼
  [Backend]
      │
      ├─ 3. Cek duplikasi NIM di database
      │
      ├─ 4. Simpan data user dengan status: PENDING_VERIFICATION
      │       └── Foto KTM disimpan di: /uploads/ktm/{nim}.jpg
      │
      ├─ 5. Admin memverifikasi keaslian KTM secara manual
      │       └── Akun diubah statusnya: ACTIVE
      │
      └─ 6. User dapat login menggunakan NIM + Password
```

### 4.2 Alur Login & JWT

```
ALUR LOGIN
───────────────────────────────────────────────────────────
  [Mahasiswa]
      │
      ├─ 1. POST /api/auth/login { nim, password }
      │
      ▼
  [AuthController → AuthService]
      │
      ├─ 2. Cari user berdasarkan NIM
      │
      ├─ 3. Validasi password (BCrypt)
      │
      ├─ 4. Cek status akun == ACTIVE
      │
      ├─ 5. Generate JWT Token (payload: nim, role, exp)
      │
      └─ 6. Return: { token, nim, nama, role }
      │
  [Client menyimpan token di localStorage/SecureStorage]
      │
      └─ 7. Setiap request selanjutnya:
             Header: Authorization: Bearer <JWT_TOKEN>
```

### 4.3 Level Akses (Role)

| Role | Deskripsi | Hak Akses |
|---|---|---|
| `MAHASISWA` | Pengguna umum yang terverifikasi | Buat laporan, klaim barang, chat |
| `ADMIN` | Staf kampus / pengelola Lost and Found | Semua akses + verifikasi KTM + kelola data |

### 4.4 Entity: User

```java
@Entity
@Table(name = "tb_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String nim;               // Identitas utama (Primary Identity)

    @Column(nullable = false)
    private String nama;

    @Column(nullable = false)
    private String password;          // BCrypt hashed

    @Column(nullable = false, length = 15)
    private String nomorHp;           // Untuk notifikasi WhatsApp

    private String fotoKtmPath;       // Path file KTM yang diupload

    @Enumerated(EnumType.STRING)
    private StatusAkun statusAkun;    // PENDING_VERIFICATION | ACTIVE | SUSPENDED

    @Enumerated(EnumType.STRING)
    private Role role;                // MAHASISWA | ADMIN

    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

---

## 5. Alur Pengguna (User Flow)

### 5.1 Flow: Melaporkan Barang Hilang

```
┌──────────────────────────────────────────────────────────────────┐
│              FLOW: LAPORAN BARANG HILANG                         │
└──────────────────────────────────────────────────────────────────┘

  [Mahasiswa Login]
        │
        ▼
  Pilih "Laporkan Barang Hilang"
        │
        ▼
  Isi Form Laporan:
    ├── Kategori Barang: [Dokumen / Elektronik / Umum]
    ├── Deskripsi detail barang
    ├── Upload foto barang (jika ada)
    ├── Lokasi terakhir terlihat
    │     └── Pin di peta ATAU input manual
    ├── Latitude & Longitude (auto-captured dari peta)
    └── Tanggal & waktu hilang
        │
        ▼
  [Backend]
    ├── Validasi input
    ├── Simpan LaporanHilang dengan status: ACTIVE
    ├── Factory Method membuat objek Barang sesuai kategori
    ├── Simpan Barang ke tb_barang
    │
    └── Trigger Smart Matching Algorithm:
          ├── Cari LaporanTemuan yang BELUM MATCHED
          ├── Hitung skor kecocokan (kategori + keywords + jarak)
          ├── Jika skor > threshold (misal 70%):
          │     ├── Simpan MatchResult ke tb_match
          │     └── Kirim notifikasi WhatsApp ke pelapor
          └── Return response dengan daftar potensi kecocokan
        │
        ▼
  Mahasiswa melihat:
    ├── Konfirmasi laporan berhasil
    └── Daftar "Potensi Kecocokan" (jika ada)
```

### 5.2 Flow: Melaporkan Barang Temuan

```
┌──────────────────────────────────────────────────────────────────┐
│              FLOW: LAPORAN BARANG TEMUAN                         │
└──────────────────────────────────────────────────────────────────┘

  [Mahasiswa Login]
        │
        ▼
  Pilih "Laporkan Barang Temuan"
        │
        ▼
  Isi Form Temuan:
    ├── Kategori Barang: [Dokumen / Elektronik / Umum]
    ├── Deskripsi detail barang yang ditemukan
    ├── Upload foto barang (WAJIB sebagai bukti)
    ├── Lokasi ditemukan (pin di peta)
    ├── Latitude & Longitude
    └── Kondisi barang: [BAIK / RUSAK_RINGAN / RUSAK_BERAT]
        │
        ▼
  [Backend]
    ├── Simpan LaporanTemuan dengan status: TERSEDIA
    ├── Factory Method membuat objek Barang
    │
    └── Trigger Smart Matching Algorithm:
          ├── Cari LaporanHilang yang ACTIVE
          ├── Hitung skor kecocokan
          ├── Jika skor > threshold:
          │     ├── Simpan MatchResult
          │     └── Kirim notifikasi WhatsApp ke pemilik potensial
          └── Return response
        │
        ▼
  Mahasiswa (penemu) melihat:
    └── Konfirmasi laporan berhasil + anjuran serahkan ke Sekretariat
```

### 5.3 Flow: Klaim Barang (Pemilik → Penemu)

```
┌──────────────────────────────────────────────────────────────────┐
│              FLOW: KLAIM BARANG                                  │
└──────────────────────────────────────────────────────────────────┘

  [Pemilik menerima notifikasi WhatsApp / melihat di aplikasi]
        │
        ▼
  Buka detail MatchResult di aplikasi
        │
        ▼
  Klik "Ajukan Klaim"
        │
        ▼
  [Backend]
    ├── Validasi: User adalah pelapor kehilangan yang valid
    ├── Buat ClaimRequest dengan status: PENDING
    └── Kirim notifikasi ke Penemu via sistem pesan (DM)
        │
        ▼
  [Penemu menerima notifikasi]
        │
        ▼
  Penemu membuka chat / DM dengan Pemilik
    ├── Penemu dapat meminta bukti kepemilikan
    │     (mis: foto KTM + foto barang serupa)
    └── Penemu mengkonfirmasi: APPROVED / REJECTED
        │
        ▼
  Jika APPROVED:
    ├── Status LaporanTemuan → CLAIMED
    ├── Status LaporanHilang → RESOLVED
    ├── MatchResult status → CONFIRMED
    └── Kirim notifikasi ke kedua pihak:
          "Silakan bertemu di Sekretariat untuk serah terima"
        │
        ▼
  [Admin] Konfirmasi serah terima fisik
    └── Status akhir: SELESAI
```

### 5.4 Flow: Direct Messaging (Chat)

```
┌──────────────────────────────────────────────────────────────────┐
│              FLOW: DIRECT MESSAGING                              │
└──────────────────────────────────────────────────────────────────┘

  [Pemilik / Penemu membuka halaman Match Detail]
        │
        ▼
  Klik "Hubungi Penemu" / "Hubungi Pemilik"
        │
        ▼
  [Backend membuat atau membuka Room Chat]
    ├── Room Chat dikaitkan dengan MatchResult ID
    ├── Hanya 2 pihak yang terlibat yang dapat mengakses room ini
    └── Admin dapat memonitor seluruh percakapan
        │
        ▼
  [WebSocket Connection Established]
    STOMP subscribe: /topic/chat/{matchId}
        │
        ▼
  Real-time messaging:
    ├── Pesan dikirim via STOMP: /app/chat.send
    ├── Tersimpan permanen di tb_pesan
    └── Dibroadcast ke subscriber aktif
```

---

## 6. Desain Domain & Pola Desain

### 6.1 Factory Method Pattern untuk Manajemen Barang

Sistem menggunakan **Factory Method Pattern** untuk menangani pembuatan objek `Barang` yang berbeda-beda berdasarkan kategori. Ini memisahkan logika pembuatan objek dari logika bisnis utama.

```java
// ─── Factory Interface ───────────────────────────────────────────
public interface BarangFactory {
    Barang createBarang(BarangRequest request);
    KategoriBarang getKategori();
}

// ─── Concrete Factory: Dokumen ────────────────────────────────────
@Component
public class BarangDokumenFactory implements BarangFactory {

    @Override
    public Barang createBarang(BarangRequest request) {
        BarangDokumen barang = new BarangDokumen();
        barang.setDeskripsi(request.getDeskripsi());
        barang.setFotoPath(request.getFotoPath());
        // Atribut khusus dokumen
        barang.setNamaTertera(request.getNamaTertera());
        barang.setNomorIdentitas(request.getNomorIdentitas()); // Hasil OCR (future)
        return barang;
    }

    @Override
    public KategoriBarang getKategori() {
        return KategoriBarang.DOKUMEN;
    }
}

// ─── Concrete Factory: Elektronik ────────────────────────────────
@Component
public class BarangElektronikFactory implements BarangFactory {

    @Override
    public Barang createBarang(BarangRequest request) {
        BarangElektronik barang = new BarangElektronik();
        barang.setDeskripsi(request.getDeskripsi());
        barang.setFotoPath(request.getFotoPath());
        // Atribut khusus elektronik
        barang.setMerk(request.getMerk());
        barang.setWarnaPerangkat(request.getWarnaPerangkat());
        return barang;
    }

    @Override
    public KategoriBarang getKategori() {
        return KategoriBarang.ELEKTRONIK;
    }
}

// ─── Factory Registry (Service Locator) ──────────────────────────
@Service
public class BarangFactoryRegistry {

    private final Map<KategoriBarang, BarangFactory> factoryMap;

    public BarangFactoryRegistry(List<BarangFactory> factories) {
        this.factoryMap = factories.stream()
            .collect(Collectors.toMap(BarangFactory::getKategori, f -> f));
    }

    public Barang createBarang(KategoriBarang kategori, BarangRequest request) {
        BarangFactory factory = factoryMap.get(kategori);
        if (factory == null) {
            throw new IllegalArgumentException("Kategori tidak dikenali: " + kategori);
        }
        return factory.createBarang(request);
    }
}
```

### 6.2 Single Table Inheritance (STI) — Entity Hierarchy

```java
// ─── Parent Entity ────────────────────────────────────────────────
@Entity
@Table(name = "tb_barang")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "kategori", discriminatorType = DiscriminatorType.STRING)
public abstract class Barang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String deskripsi;

    private String fotoPath;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String lokasiDeskripsi;     // mis. "Depan Gedung A, Lantai 2"

    @Enumerated(EnumType.STRING)
    private KondisiBarang kondisi;      // BAIK | RUSAK_RINGAN | RUSAK_BERAT

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

// ─── Child: Dokumen ───────────────────────────────────────────────
@Entity
@DiscriminatorValue("DOKUMEN")
public class BarangDokumen extends Barang {
    private String namaTertera;
    private String nomorIdentitas;   // Nomor KTP/KTM/SIM (future: OCR)
}

// ─── Child: Elektronik ────────────────────────────────────────────
@Entity
@DiscriminatorValue("ELEKTRONIK")
public class BarangElektronik extends Barang {
    private String merk;
    private String warnaPerangkat;
    private String tipePerangkat;    // mis. Laptop, HP, Charger, Earphone
}

// ─── Child: Umum ─────────────────────────────────────────────────
@Entity
@DiscriminatorValue("UMUM")
public class BarangUmum extends Barang {
    private String warna;
    private String ukuran;
}
```

---

## 7. Struktur Database (ERD)

### 7.1 Diagram ERD (Teks)

```
╔══════════════════════════════════════════════════════════════════════════╗
║                    ENTITY RELATIONSHIP DIAGRAM                           ║
║                    Lost and Found PNL                                    ║
╚══════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────┐
│           tb_user                │
├──────────────────────────────────┤
│ PK  id             BIGINT        │
│     nim            VARCHAR(20)   │◄─ UNIQUE, Identitas Utama
│     nama           VARCHAR(100)  │
│     password       VARCHAR(255)  │
│     nomor_hp       VARCHAR(15)   │
│     foto_ktm_path  VARCHAR(255)  │
│     status_akun    ENUM          │  PENDING_VERIFICATION | ACTIVE | SUSPENDED
│     role           ENUM          │  MAHASISWA | ADMIN
│     created_at     DATETIME      │
└──────────────────────────────────┘
           │                   │
           │ 1                 │ 1
           │                   │
           ▼ N                 ▼ N
┌──────────────────────┐    ┌───────────────────────┐
│   tb_laporan_hilang  │    │   tb_laporan_temuan    │
├──────────────────────┤    ├───────────────────────┤
│ PK id      BIGINT    │    │ PK id       BIGINT     │
│ FK user_id BIGINT    │    │ FK user_id  BIGINT     │
│ FK barang_id BIGINT  │    │ FK barang_id BIGINT    │
│    status  ENUM      │    │    status   ENUM       │
│    tgl_hilang DATETIME│   │    tgl_temuan DATETIME │
│    catatan TEXT      │    │    catatan   TEXT      │
│    created_at DATETIME│   │    created_at DATETIME │
└──────────────────────┘    └───────────────────────┘
         │   │                        │   │
         │   └──────────┬─────────────┘   │
         │              │                 │
         │              ▼                 │
         │    ┌──────────────────────┐    │
         │    │      tb_match        │    │
         │    ├──────────────────────┤    │
         │    │ PK id      BIGINT    │    │
         │    │ FK laporan_hilang_id │    │
         │    │ FK laporan_temuan_id │    │
         │    │    skor_kecocokan    │    │
         │    │    DECIMAL(5,2)      │    │
         │    │    status    ENUM    │    │
         │    │    SUGGESTED|        │    │
         │    │    CLAIMED|CONFIRMED │    │
         │    │    created_at        │    │
         │    └──────────────────────┘    │
         │              │                 │
         │              ▼                 │
         │    ┌──────────────────────┐    │
         │    │      tb_pesan        │    │
         │    ├──────────────────────┤    │
         │    │ PK id      BIGINT    │    │
         │    │ FK match_id BIGINT   │    │
         │    │ FK sender_id BIGINT  │    │
         │    │    isi     TEXT      │    │
         │    │    dibaca  BOOLEAN   │    │
         │    │    created_at        │    │
         │    └──────────────────────┘    │
         │                               │
         ▼                               ▼
┌────────────────────────────────────────────────────────┐
│                      tb_barang                         │
│                 (Single Table Inheritance)              │
├────────────────────────────────────────────────────────┤
│ PK  id               BIGINT                            │
│     kategori         VARCHAR(20)   ◄─ DISCRIMINATOR    │
│                                        DOKUMEN         │
│                                        ELEKTRONIK      │
│                                        UMUM            │
│  ─── Kolom Umum (Semua Kategori) ───                   │
│     deskripsi        TEXT                              │
│     foto_path        VARCHAR(255)                      │
│     latitude         DECIMAL(10,8) ◄─ Geolokasi        │
│     longitude        DECIMAL(11,8) ◄─ Geolokasi        │
│     lokasi_deskripsi VARCHAR(255)                      │
│     kondisi          ENUM (BAIK|RUSAK_RINGAN|RUSAK_BERAT)│
│     created_at       DATETIME                          │
│     updated_at       DATETIME                          │
│                                                        │
│  ─── Kolom BarangDokumen (NULL jika bukan DOKUMEN) ─── │
│     nama_tertera     VARCHAR(100)                      │
│     nomor_identitas  VARCHAR(50)                       │
│                                                        │
│  ─── Kolom BarangElektronik (NULL jika bukan ELEK.) ── │
│     merk             VARCHAR(100)                      │
│     warna_perangkat  VARCHAR(50)                       │
│     tipe_perangkat   VARCHAR(50)                       │
│                                                        │
│  ─── Kolom BarangUmum (NULL jika bukan UMUM) ───       │
│     warna            VARCHAR(50)                       │
│     ukuran           VARCHAR(50)                       │
└────────────────────────────────────────────────────────┘
```

### 7.2 DDL Schema Lengkap (MySQL)

```sql
-- ─────────────────────────────────────────────────────────────
-- DATABASE: db_lostandfound
-- ─────────────────────────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS db_lostandfound
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_lostandfound;

-- ─────────────────────────────────────────────────────────────
-- TABEL: tb_user
-- ─────────────────────────────────────────────────────────────
CREATE TABLE tb_user (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    nim             VARCHAR(20)  NOT NULL UNIQUE COMMENT 'Nomor Induk Mahasiswa',
    nama            VARCHAR(100) NOT NULL,
    password        VARCHAR(255) NOT NULL COMMENT 'BCrypt hashed',
    nomor_hp        VARCHAR(15)  NOT NULL COMMENT 'Untuk notifikasi WhatsApp',
    foto_ktm_path   VARCHAR(255) NOT NULL COMMENT 'Path file KTM yang diupload',
    status_akun     ENUM('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED')
                    NOT NULL DEFAULT 'PENDING_VERIFICATION',
    role            ENUM('MAHASISWA', 'ADMIN') NOT NULL DEFAULT 'MAHASISWA',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_nim (nim),
    INDEX idx_status (status_akun)
) ENGINE=InnoDB COMMENT='Data pengguna sistem Lost and Found PNL';

-- ─────────────────────────────────────────────────────────────
-- TABEL: tb_barang (Single Table Inheritance)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE tb_barang (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    kategori        VARCHAR(20)  NOT NULL COMMENT 'Discriminator: DOKUMEN, ELEKTRONIK, UMUM',
    deskripsi       TEXT         NOT NULL,
    foto_path       VARCHAR(255),
    latitude        DECIMAL(10,8) NOT NULL COMMENT 'Koordinat GPS',
    longitude       DECIMAL(11,8) NOT NULL COMMENT 'Koordinat GPS',
    lokasi_deskripsi VARCHAR(255) COMMENT 'Deskripsi lokasi human-readable',
    kondisi         ENUM('BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT') DEFAULT 'BAIK',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Atribut BarangDokumen (NULL jika bukan DOKUMEN)
    nama_tertera        VARCHAR(100) COMMENT 'Nama yang tertera pada dokumen',
    nomor_identitas     VARCHAR(50)  COMMENT 'Nomor KTP/KTM/SIM (future: OCR)',

    -- Atribut BarangElektronik (NULL jika bukan ELEKTRONIK)
    merk                VARCHAR(100) COMMENT 'Merk perangkat elektronik',
    warna_perangkat     VARCHAR(50)  COMMENT 'Warna perangkat',
    tipe_perangkat      VARCHAR(50)  COMMENT 'Laptop/HP/Charger/dll',

    -- Atribut BarangUmum (NULL jika bukan UMUM)
    warna               VARCHAR(50),
    ukuran              VARCHAR(50),

    INDEX idx_kategori (kategori),
    INDEX idx_koordinat (latitude, longitude)
) ENGINE=InnoDB COMMENT='Data barang (STI: Dokumen, Elektronik, Umum)';

-- ─────────────────────────────────────────────────────────────
-- TABEL: tb_laporan_hilang
-- ─────────────────────────────────────────────────────────────
CREATE TABLE tb_laporan_hilang (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL COMMENT 'FK: Pelapor (pemilik barang)',
    barang_id       BIGINT NOT NULL COMMENT 'FK: Detail barang yang hilang',
    status          ENUM('ACTIVE', 'MATCHED', 'RESOLVED', 'CANCELLED')
                    NOT NULL DEFAULT 'ACTIVE',
    tgl_hilang      DATETIME NOT NULL COMMENT 'Estimasi waktu kehilangan',
    kata_kunci      VARCHAR(255) COMMENT 'Kata kunci untuk smart matching',
    catatan         TEXT COMMENT 'Catatan tambahan pelapor',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_hilang_user   FOREIGN KEY (user_id)   REFERENCES tb_user(id),
    CONSTRAINT fk_hilang_barang FOREIGN KEY (barang_id) REFERENCES tb_barang(id),

    INDEX idx_status_hilang (status),
    INDEX idx_user_hilang (user_id)
) ENGINE=InnoDB COMMENT='Laporan barang yang hilang';

-- ─────────────────────────────────────────────────────────────
-- TABEL: tb_laporan_temuan
-- ─────────────────────────────────────────────────────────────
CREATE TABLE tb_laporan_temuan (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL COMMENT 'FK: Penemu barang',
    barang_id       BIGINT NOT NULL COMMENT 'FK: Detail barang yang ditemukan',
    status          ENUM('TERSEDIA', 'MATCHED', 'CLAIMED', 'SELESAI', 'KADALUARSA')
                    NOT NULL DEFAULT 'TERSEDIA',
    tgl_temuan      DATETIME NOT NULL COMMENT 'Waktu barang ditemukan',
    kata_kunci      VARCHAR(255) COMMENT 'Kata kunci untuk smart matching',
    catatan         TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_temuan_user   FOREIGN KEY (user_id)   REFERENCES tb_user(id),
    CONSTRAINT fk_temuan_barang FOREIGN KEY (barang_id) REFERENCES tb_barang(id),

    INDEX idx_status_temuan (status),
    INDEX idx_user_temuan (user_id)
) ENGINE=InnoDB COMMENT='Laporan barang yang ditemukan';

-- ─────────────────────────────────────────────────────────────
-- TABEL: tb_match
-- ─────────────────────────────────────────────────────────────
CREATE TABLE tb_match (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    laporan_hilang_id   BIGINT NOT NULL,
    laporan_temuan_id   BIGINT NOT NULL,
    skor_kecocokan      DECIMAL(5,2) NOT NULL COMMENT 'Skor 0.00 - 100.00',
    detail_skor         JSON COMMENT 'Breakdown skor: {kategori, keyword, jarak}',
    status              ENUM('SUGGESTED', 'VIEWED', 'CLAIMED', 'CONFIRMED', 'REJECTED')
                        NOT NULL DEFAULT 'SUGGESTED',
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_match_hilang  FOREIGN KEY (laporan_hilang_id)
                                REFERENCES tb_laporan_hilang(id),
    CONSTRAINT fk_match_temuan  FOREIGN KEY (laporan_temuan_id)
                                REFERENCES tb_laporan_temuan(id),

    UNIQUE KEY uq_match_pair (laporan_hilang_id, laporan_temuan_id),
    INDEX idx_status_match (status),
    INDEX idx_skor (skor_kecocokan DESC)
) ENGINE=InnoDB COMMENT='Hasil pencocokan laporan hilang dan temuan';

-- ─────────────────────────────────────────────────────────────
-- TABEL: tb_pesan (Direct Messaging)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE tb_pesan (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    match_id    BIGINT  NOT NULL COMMENT 'FK: Pesan terkait match tertentu',
    sender_id   BIGINT  NOT NULL COMMENT 'FK: Pengirim pesan (tb_user.id)',
    isi         TEXT    NOT NULL,
    dibaca      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pesan_match  FOREIGN KEY (match_id)  REFERENCES tb_match(id),
    CONSTRAINT fk_pesan_sender FOREIGN KEY (sender_id) REFERENCES tb_user(id),

    INDEX idx_match_pesan (match_id),
    INDEX idx_sender (sender_id)
) ENGINE=InnoDB COMMENT='Pesan chat antar pengguna terkait suatu match';

-- ─────────────────────────────────────────────────────────────
-- TABEL: tb_notifikasi (Log Notifikasi)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE tb_notifikasi (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    match_id    BIGINT,
    channel     ENUM('WHATSAPP', 'IN_APP') NOT NULL,
    pesan       TEXT NOT NULL,
    status      ENUM('PENDING', 'SENT', 'FAILED') DEFAULT 'PENDING',
    sent_at     DATETIME,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notif_user  FOREIGN KEY (user_id)  REFERENCES tb_user(id),
    CONSTRAINT fk_notif_match FOREIGN KEY (match_id) REFERENCES tb_match(id)
) ENGINE=InnoDB COMMENT='Log pengiriman notifikasi';
```

---

## 8. Desain API (REST Endpoints)

### 8.1 Konvensi API

```
Base URL   : http://localhost:8081/api
Format     : JSON (Content-Type: application/json)
Auth       : Bearer Token (JWT) di header Authorization
Versi      : v1 (implisit dalam base URL)
```

**Format Response Standar:**
```json
{
    "success": true,
    "message": "Operasi berhasil",
    "data": { ... },
    "timestamp": "2025-06-01T10:30:00"
}
```

**Format Error Response:**
```json
{
    "success": false,
    "message": "Detail pesan error",
    "errors": ["Field validation error detail"],
    "timestamp": "2025-06-01T10:30:00"
}
```

---

### 8.2 Auth Endpoints

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Registrasi mahasiswa baru |
| `POST` | `/api/auth/login` | Public | Login dan dapatkan JWT |
| `GET` | `/api/auth/me` | Auth | Profil user yang sedang login |
| `PUT` | `/api/auth/update-profile` | Auth | Update nomor HP |
| `POST` | `/api/auth/change-password` | Auth | Ganti password |

**`POST /api/auth/register`**
```
Request (multipart/form-data):
  nim          : "2021020001"
  nama         : "Budi Santoso"
  password     : "securePass123"
  nomorHp      : "08123456789"
  fotoKtm      : [file: KTM.jpg]

Response 201 Created:
{
  "success": true,
  "message": "Registrasi berhasil. Akun Anda sedang diverifikasi oleh Admin.",
  "data": {
    "nim": "2021020001",
    "nama": "Budi Santoso",
    "statusAkun": "PENDING_VERIFICATION"
  }
}
```

**`POST /api/auth/login`**
```
Request:
{
  "nim": "2021020001",
  "password": "securePass123"
}

Response 200 OK:
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "nim": "2021020001",
    "nama": "Budi Santoso",
    "role": "MAHASISWA"
  }
}
```

---

### 8.3 Laporan Hilang Endpoints

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `POST` | `/api/laporan/hilang` | Auth | Buat laporan baru |
| `GET` | `/api/laporan/hilang` | Auth | Semua laporan hilang (publik) |
| `GET` | `/api/laporan/hilang/saya` | Auth | Laporan milik user yg login |
| `GET` | `/api/laporan/hilang/{id}` | Auth | Detail satu laporan |
| `PUT` | `/api/laporan/hilang/{id}` | Auth | Edit laporan (hanya pemilik) |
| `DELETE` | `/api/laporan/hilang/{id}` | Auth | Batalkan laporan |

**`POST /api/laporan/hilang`**
```
Request (multipart/form-data):
  kategori         : "ELEKTRONIK"
  deskripsi        : "Laptop Asus VivoBook warna hitam, ada stiker bendera merah putih"
  fotoBarang       : [file: laptop.jpg]   (opsional)
  latitude         : -5.1756
  longitude        : 97.1349
  lokasiDeskripsi  : "Kantin Gedung B, PNL"
  tglHilang        : "2025-06-01T09:00:00"
  kataKunci        : "laptop,asus,hitam,vivobook"
  catatan          : "Terakhir terlihat di atas meja kantin"
  merk             : "Asus"              (field khusus ELEKTRONIK)
  warnaPerangkat   : "Hitam"
  tipePerangkat    : "Laptop"

Response 201 Created:
{
  "success": true,
  "message": "Laporan kehilangan berhasil dibuat",
  "data": {
    "laporanId": 42,
    "barangId": 99,
    "status": "ACTIVE",
    "potensiKecocokan": [
      {
        "matchId": 7,
        "skorKecocokan": 85.50,
        "laporanTemuanId": 18,
        "lokasiTemuan": "Perpustakaan PNL",
        "tglTemuan": "2025-05-31T14:00:00"
      }
    ]
  }
}
```

---

### 8.4 Laporan Temuan Endpoints

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `POST` | `/api/laporan/temuan` | Auth | Laporkan barang temuan |
| `GET` | `/api/laporan/temuan` | Auth | Semua laporan temuan (publik) |
| `GET` | `/api/laporan/temuan/saya` | Auth | Temuan oleh user yg login |
| `GET` | `/api/laporan/temuan/{id}` | Auth | Detail temuan |
| `PUT` | `/api/laporan/temuan/{id}` | Auth | Edit laporan temuan |

**`POST /api/laporan/temuan`**
```
Request (multipart/form-data):
  kategori         : "DOKUMEN"
  deskripsi        : "KTM atas nama Muhammad Rizki, jurusan Teknik Sipil"
  fotoBarang       : [file: ktm_temuan.jpg]   (WAJIB)
  latitude         : -5.1748
  longitude        : 97.1340
  lokasiDeskripsi  : "Depan Gedung Rektorat PNL"
  tglTemuan        : "2025-06-01T10:30:00"
  kataKunci        : "ktm,kartu,mahasiswa,rizki,sipil"
  namaTertera      : "Muhammad Rizki"          (field khusus DOKUMEN)
  nomorIdentitas   : "2020030045"

Response 201 Created:
{
  "success": true,
  "message": "Laporan temuan berhasil dibuat. Terima kasih atas kejujuranmu!",
  "data": {
    "laporanId": 55,
    "barangId": 102,
    "status": "TERSEDIA",
    "potensiKecocokan": [
      {
        "matchId": 9,
        "skorKecocokan": 92.00,
        "laporanHilangId": 33,
        "nimPelapor": "202003****"   // Sebagian disensor
      }
    ]
  }
}
```

---

### 8.5 Matching & Search Endpoints

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/api/matching/laporan-hilang/{id}` | Auth | Lihat semua match untuk laporan hilang |
| `GET` | `/api/matching/laporan-temuan/{id}` | Auth | Lihat semua match untuk temuan |
| `POST` | `/api/matching/klaim/{matchId}` | Auth | Ajukan klaim kepemilikan |
| `POST` | `/api/matching/konfirmasi/{matchId}` | Auth | Penemu konfirmasi klaim |
| `POST` | `/api/matching/tolak/{matchId}` | Auth | Penemu tolak klaim |
| `GET` | `/api/search` | Auth | Cari barang (teks + radius) |

**`GET /api/search?kategori=ELEKTRONIK&q=laptop&lat=-5.1756&lng=97.1349&radius=200`**
```
Query Parameters:
  kategori  : DOKUMEN | ELEKTRONIK | UMUM  (opsional)
  q         : Kata kunci pencarian teks
  lat       : Latitude titik pencarian
  lng       : Longitude titik pencarian
  radius    : Radius pencarian dalam meter (default: 500)
  tipe      : hilang | temuan (default: temuan)

Response 200 OK:
{
  "success": true,
  "data": {
    "totalHasil": 3,
    "radius": 200,
    "hasil": [
      {
        "laporanId": 18,
        "deskripsi": "Laptop Asus hitam dengan stiker merah...",
        "lokasiTemuan": "Perpustakaan PNL",
        "jarakMeter": 45.3,
        "tglTemuan": "2025-05-31T14:00:00",
        "kondisi": "BAIK"
      }
    ]
  }
}
```

---

### 8.6 Direct Messaging Endpoints

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/api/pesan/match/{matchId}` | Auth | Ambil riwayat chat suatu match |
| `POST` | `/api/pesan/match/{matchId}` | Auth | Kirim pesan (fallback REST) |
| `GET` | `/api/pesan/unread-count` | Auth | Jumlah pesan belum dibaca |
| `PUT` | `/api/pesan/baca/{matchId}` | Auth | Tandai semua pesan sebagai dibaca |

**WebSocket (STOMP):**
```
Connect   : ws://localhost:8081/ws
Subscribe : /topic/chat/{matchId}
Send      : /app/chat.send
Payload   :
{
  "matchId": 9,
  "isi": "Halo, apakah KTM yang Anda temukan atas nama Muhammad Rizki?"
}
```

---

### 8.7 Admin Endpoints

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/api/admin/users/pending` | ADMIN | Daftar user pending verifikasi |
| `POST` | `/api/admin/users/{id}/verify` | ADMIN | Verifikasi & aktifkan akun |
| `POST` | `/api/admin/users/{id}/suspend` | ADMIN | Suspend akun bermasalah |
| `GET` | `/api/admin/laporan` | ADMIN | Semua laporan (hilang + temuan) |
| `DELETE` | `/api/admin/laporan/{id}` | ADMIN | Hapus laporan tidak valid |
| `GET` | `/api/admin/dashboard/stats` | ADMIN | Statistik sistem |

**`GET /api/admin/dashboard/stats`**
```
Response 200 OK:
{
  "success": true,
  "data": {
    "totalUserAktif": 342,
    "totalLaporanHilang": 89,
    "totalLaporanTemuan": 74,
    "totalMatchSuggested": 23,
    "totalMatchConfirmed": 41,
    "pendingVerifikasi": 5,
    "barangBelumTerclaim": 33
  }
}
```

---

## 9. Fitur Lanjutan (Advanced Features)

### 9.1 Smart Matching Algorithm

Algoritma pencocokan bekerja dengan menghitung **Composite Score** dari tiga komponen:

```
COMPOSITE SCORE = (W_kategori × S_kategori)
                + (W_keyword  × S_keyword)
                + (W_lokasi   × S_lokasi)

Bobot default:
  W_kategori = 40%
  W_keyword  = 35%
  W_lokasi   = 25%
```

**Implementasi (Java):**

```java
@Service
public class MatchingService {

    // Threshold minimum skor untuk dianggap "potential match"
    private static final double THRESHOLD_SCORE = 60.0;

    public List<MatchResult> findPotentialMatches(LaporanHilang laporanHilang) {
        List<LaporanTemuan> kandidat = laporanTemuanRepo
            .findByStatusAndBarangKategori(
                StatusTemuan.TERSEDIA,
                laporanHilang.getBarang().getKategori()
            );

        return kandidat.stream()
            .map(temuan -> calculateScore(laporanHilang, temuan))
            .filter(match -> match.getSkorKecocokan() >= THRESHOLD_SCORE)
            .sorted(Comparator.comparingDouble(MatchResult::getSkorKecocokan).reversed())
            .collect(Collectors.toList());
    }

    private MatchResult calculateScore(LaporanHilang hilang, LaporanTemuan temuan) {
        // 1. Skor Kategori: Exact match = 100, mismatch = 0
        double skorKategori = hilang.getBarang().getKategori()
            .equals(temuan.getBarang().getKategori()) ? 100.0 : 0.0;

        // 2. Skor Keyword: Jaccard Similarity antara dua set kata kunci
        double skorKeyword = calculateJaccardSimilarity(
            tokenize(hilang.getKataKunci()),
            tokenize(temuan.getKataKunci())
        );

        // 3. Skor Lokasi: Berbasis jarak Haversine
        double jarakMeter = haversineDistance(
            hilang.getBarang().getLatitude(), hilang.getBarang().getLongitude(),
            temuan.getBarang().getLatitude(), temuan.getBarang().getLongitude()
        );
        double skorLokasi = calculateLocationScore(jarakMeter); // 100 jika <50m, 0 jika >2km

        // Composite Score
        double compositeScore = (0.40 * skorKategori)
                              + (0.35 * skorKeyword * 100)
                              + (0.25 * skorLokasi);

        return MatchResult.builder()
            .laporanHilang(hilang)
            .laporanTemuan(temuan)
            .skorKecocokan(compositeScore)
            .detailSkor(Map.of(
                "kategori", skorKategori,
                "keyword",  skorKeyword * 100,
                "lokasi",   skorLokasi
            ))
            .build();
    }

    // Haversine Formula (menghitung jarak antar dua koordinat GPS)
    private double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371000; // Radius bumi dalam meter
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLon/2) * Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}
```

### 9.2 WhatsApp API Gateway — Notifikasi Otomatis

```java
@Service
public class NotifikasiService {

    @Value("${app.whatsapp.api-url}")
    private String waApiUrl;

    @Value("${app.whatsapp.token}")
    private String waToken;

    private final RestTemplate restTemplate;

    // Dipanggil setelah Smart Matching menemukan potensi kecocokan
    public void kirimNotifikasiMatch(User pemilik, MatchResult match) {
        String pesan = buildMatchMessage(pemilik.getNama(), match);

        WhatsAppRequest request = new WhatsAppRequest(
            pemilik.getNomorHp(),
            pesan
        );

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(waToken);
            HttpEntity<WhatsAppRequest> entity = new HttpEntity<>(request, headers);

            restTemplate.postForEntity(waApiUrl + "/send", entity, String.class);

            // Log notifikasi ke database
            simpanLogNotifikasi(pemilik, match, StatusNotifikasi.SENT);
        } catch (Exception e) {
            simpanLogNotifikasi(pemilik, match, StatusNotifikasi.FAILED);
            log.error("Gagal kirim WA ke {}: {}", pemilik.getNomorHp(), e.getMessage());
        }
    }

    private String buildMatchMessage(String nama, MatchResult match) {
        return String.format(
            "Halo %s! 👋\n\n" +
            "Sistem Lost & Found PNL mendeteksi kemungkinan barang Anda ditemukan!\n\n" +
            "📍 Lokasi Temuan: %s\n" +
            "📅 Tanggal Temuan: %s\n" +
            "🎯 Skor Kecocokan: %.1f%%\n\n" +
            "Silakan buka aplikasi untuk melihat detail dan menghubungi penemu.\n\n" +
            "Lost & Found PNL",
            nama,
            match.getLaporanTemuan().getBarang().getLokasiDeskripsi(),
            match.getLaporanTemuan().getTglTemuan().format(
                DateTimeFormatter.ofPattern("dd MMMM yyyy, HH:mm")
            ),
            match.getSkorKecocokan()
        );
    }
}
```

### 9.3 Radius & Geolocation Search

```java
@Repository
public interface BarangRepository extends JpaRepository<Barang, Long> {

    // Query kustom menggunakan Haversine Formula langsung di SQL
    @Query(value = """
        SELECT b.*,
               (6371000 * ACOS(
                   COS(RADIANS(:lat)) * COS(RADIANS(b.latitude))
                   * COS(RADIANS(b.longitude) - RADIANS(:lng))
                   + SIN(RADIANS(:lat)) * SIN(RADIANS(b.latitude))
               )) AS jarak_meter
        FROM tb_barang b
        WHERE b.kategori = :kategori
          AND (6371000 * ACOS(
                  COS(RADIANS(:lat)) * COS(RADIANS(b.latitude))
                  * COS(RADIANS(b.longitude) - RADIANS(:lng))
                  + SIN(RADIANS(:lat)) * SIN(RADIANS(b.latitude))
              )) <= :radiusMeter
        ORDER BY jarak_meter ASC
        """, nativeQuery = true)
    List<Object[]> findByKategoriDalamRadius(
        @Param("lat")         double lat,
        @Param("lng")         double lng,
        @Param("radiusMeter") double radiusMeter,
        @Param("kategori")    String kategori
    );
}
```

### 9.4 Direct Messaging via WebSocket

```java
// ─── WebSocket Configuration ─────────────────────────────────────
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}

// ─── Chat Controller ─────────────────────────────────────────────
@Controller
public class ChatController {

    @MessageMapping("/chat.send")
    @SendTo("/topic/chat/{matchId}")
    public PesanResponse kirimPesan(
            @DestinationVariable Long matchId,
            @Payload PesanRequest request,
            Principal principal) {

        // Validasi: pengirim adalah salah satu pihak dalam match
        validateChatParticipant(principal.getName(), matchId);

        // Simpan ke database
        Pesan pesan = pesanService.simpanPesan(matchId, principal.getName(), request.getIsi());

        return new PesanResponse(pesan);
    }
}
```

---

## 10. Konfigurasi & Deployment

### 10.1 Setup Development (XAMPP)

```bash
# 1. Pastikan XAMPP berjalan (Apache + MySQL)
# 2. Buat database
mysql -u root -e "CREATE DATABASE db_lostandfound CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 3. Clone dan build project
git clone https://github.com/pnl/lostandfound-backend.git
cd lostandfound-backend
mvn clean install

# 4. Jalankan aplikasi
mvn spring-boot:run
# atau
java -jar target/lostandfound-0.0.1-SNAPSHOT.jar

# Aplikasi berjalan di: http://localhost:8081
```

### 10.2 Direktori Upload

```
lostandfound-backend/
├── uploads/
│   ├── ktm/          # Foto KTM mahasiswa
│   │   └── {nim}.jpg
│   └── barang/       # Foto barang yang dilaporkan
│       └── {uuid}.jpg
```

### 10.3 Variabel Environment (Production)

```properties
# Untuk produksi, gunakan environment variables, bukan hardcode
DB_URL=jdbc:mysql://prod-db:3306/db_lostandfound
DB_USERNAME=${DB_USER}
DB_PASSWORD=${DB_PASS}
JWT_SECRET=${JWT_SECRET_KEY}
WA_API_TOKEN=${WHATSAPP_API_TOKEN}
FILE_UPLOAD_DIR=/var/app/uploads
```

---

## 11. Catatan Pengembangan & Roadmap

### 11.1 Status Komponen

| Komponen | Status | Keterangan |
|---|---|---|
| Spring Boot Setup | ✅ Selesai | Port 8081, MySQL XAMPP |
| JPA/Hibernate | ✅ Selesai | ddl-auto=update |
| Entitas Dasar (User, Barang) | 🔄 Dalam Proses | |
| Factory Pattern | 🔄 Dalam Proses | |
| Autentikasi JWT | ⏳ Belum Mulai | |
| Laporan Hilang/Temuan API | ⏳ Belum Mulai | |
| Smart Matching Algorithm | ⏳ Belum Mulai | |
| WhatsApp Gateway | ⏳ Belum Mulai | |
| WebSocket Chat | ⏳ Belum Mulai | |
| Geolocation Search | ⏳ Belum Mulai | |
| Frontend (React/Flutter) | ⏳ TBD | |

### 11.2 Prioritas Pengembangan (Sprint Plan)

```
Sprint 1 (Minggu 1-2): Fondasi Autentikasi
  ├── Entity: User, Barang (hierarchy)
  ├── Factory Pattern implementation
  ├── Auth API: register, login, JWT
  └── File upload KTM

Sprint 2 (Minggu 3-4): Core Feature Laporan
  ├── API Laporan Hilang (CRUD)
  ├── API Laporan Temuan (CRUD)
  └── Admin: verifikasi akun

Sprint 3 (Minggu 5-6): Smart Features
  ├── Smart Matching Algorithm
  ├── Geolocation Search (Haversine)
  └── Klaim & Konfirmasi flow

Sprint 4 (Minggu 7-8): Communication & Notification
  ├── WebSocket Chat (Direct Messaging)
  ├── WhatsApp Gateway integration
  └── Notifikasi in-app

Sprint 5 (Minggu 9-10): Frontend & Integrasi
  ├── Pilih: React atau Flutter
  ├── Integrasi dengan seluruh API
  └── UAT (User Acceptance Testing)
```

### 11.3 Pertimbangan Future Enhancement

- **OCR Integration**: Ekstraksi otomatis nama dan nomor identitas dari foto KTM/KTP yang ditemukan menggunakan Tesseract OCR atau Google Vision API.
- **Progressive Web App (PWA)**: Jika frontend dipilih React, pertimbangkan PWA agar bisa diinstall di smartphone tanpa App Store.
- **Admin Dashboard**: Halaman monitoring lengkap dengan grafik laporan per periode, heatmap lokasi kehilangan terbanyak di kampus.
- **Push Notification**: Integrasi Firebase Cloud Messaging (FCM) untuk notifikasi in-app di perangkat mobile.
- **Data Retention Policy**: Laporan otomatis diarsipkan setelah 30 hari tidak ada aktivitas; barang temuan yang tidak diklaim diserahkan ke Sekretariat.

---

*Dokumen ini bersifat living document dan akan terus diperbarui seiring perkembangan implementasi sistem.*

---

**© 2025 Tim Pengembang Lost and Found PNL — Politeknik Negeri Lhokseumawe**
