@echo off
echo ==============================================
echo Menjalankan Lost and Found (Local Portable Mode)
echo ==============================================
echo.

:: Cek apakah XAMPP/MySQL aktif dengan memancing koneksi port 3306
echo [1/3] Memeriksa koneksi Database MySQL...
netstat -ano | findstr :3306 >nul
if %errorlevel% neq 0 (
    echo [ERROR] MySQL belum berjalan!
    echo Tolong buka aplikasi XAMPP Control Panel dan klik "Start" pada MySQL.
    echo Kemudian jalankan kembali file ini.
    pause
    exit /b
)
echo [OK] Database berjalan.

:: Set Local JAVA_HOME for this terminal session only
echo [2/3] Menyiapkan Java Portable (JDK 17)...
set JAVA_HOME=%~dp0jdk\jdk-17.0.19+10
set PATH=%JAVA_HOME%\bin;%PATH%

:: Start Backend in a new window
echo [3/3] Membuka jendela Backend Server...
start "Backend Server" cmd /c "cd backend && echo Sedang mem-build Spring Boot... && call mvnw clean spring-boot:run || pause"

:: Start Frontend in a new window
echo [3/3] Membuka jendela Frontend Server...
start "Frontend Web" cmd /c "cd frontend && echo Menjalankan Vite... && call npm run dev || pause"

echo.
echo ==============================================
echo Sedang memuat... Membuka browser otomatis...
echo ==============================================
:: Tunggu 5 detik agar Vite siap, lalu buka browser
ping 127.0.0.1 -n 6 >nul
start http://localhost:5173

echo Selesai! Kedua server sedang berjalan di 2 jendela hitam yang baru.
echo Jendela ini akan tertutup otomatis.
ping 127.0.0.1 -n 3 >nul
exit
