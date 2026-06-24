package com.pnl.lostandfound.backend.service;

import com.pnl.lostandfound.backend.dto.request.LaporanHilangRequest;
import com.pnl.lostandfound.backend.dto.request.LaporanTemuanRequest;
import com.pnl.lostandfound.backend.factory.BarangFactory;
import com.pnl.lostandfound.backend.model.*;
import com.pnl.lostandfound.backend.model.enums.StatusLaporan;
import com.pnl.lostandfound.backend.repository.LaporanHilangRepository;
import com.pnl.lostandfound.backend.repository.LaporanTemuanRepository;
import com.pnl.lostandfound.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LaporanService {

    @Autowired
    private LaporanHilangRepository laporanHilangRepository;

    @Autowired
    private LaporanTemuanRepository laporanTemuanRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BarangFactory barangFactory;
    
    @Autowired
    private MatchingService matchingService;

    public LaporanHilang laporHilang(String nim, LaporanHilangRequest request) {
        User user = userRepository.findByNim(nim).orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        Barang barang = barangFactory.createBarang(
                request.getKategori(),
                request.getDeskripsi(),
                request.getFotoPath(),
                request.getLatitude(),
                request.getLongitude(),
                request.getLokasiDeskripsi(),
                request.getKondisi()
        );

        if (barang instanceof BarangDokumen doc) {
            doc.setNamaTertera(request.getNamaTertera());
            doc.setNomorIdentitas(request.getNomorIdentitas());
        } else if (barang instanceof BarangElektronik el) {
            el.setMerk(request.getMerk());
            el.setTipePerangkat(request.getTipePerangkat());
            el.setWarnaPerangkat(request.getWarnaPerangkat());
        } else if (barang instanceof BarangUmum umum) {
            umum.setUkuran(request.getUkuran());
            umum.setWarna(request.getWarna());
        }

        LaporanHilang laporan = new LaporanHilang();
        laporan.setUser(user);
        laporan.setBarang(barang);
        laporan.setCatatan(request.getCatatan());
        laporan.setTglHilang(request.getTglHilang());
        laporan.setStatus(StatusLaporan.ACTIVE);

        LaporanHilang savedLaporan = laporanHilangRepository.save(laporan);
        
        // Trigger pencocokan
        matchingService.findMatchesForHilang(savedLaporan);
        
        return savedLaporan;
    }

    public LaporanTemuan laporTemuan(String nim, LaporanTemuanRequest request) {
        User user = userRepository.findByNim(nim).orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        Barang barang = barangFactory.createBarang(
                request.getKategori(),
                request.getDeskripsi(),
                request.getFotoPath(),
                request.getLatitude(),
                request.getLongitude(),
                request.getLokasiDeskripsi(),
                request.getKondisi()
        );

        if (barang instanceof BarangDokumen doc) {
            doc.setNamaTertera(request.getNamaTertera());
            doc.setNomorIdentitas(request.getNomorIdentitas());
        } else if (barang instanceof BarangElektronik el) {
            el.setMerk(request.getMerk());
            el.setTipePerangkat(request.getTipePerangkat());
            el.setWarnaPerangkat(request.getWarnaPerangkat());
        } else if (barang instanceof BarangUmum umum) {
            umum.setUkuran(request.getUkuran());
            umum.setWarna(request.getWarna());
        }

        LaporanTemuan laporan = new LaporanTemuan();
        laporan.setUser(user);
        laporan.setBarang(barang);
        laporan.setCatatan(request.getCatatan());
        laporan.setTglTemuan(request.getTglTemuan());
        laporan.setStatus(StatusLaporan.TERSEDIA);

        LaporanTemuan savedLaporan = laporanTemuanRepository.save(laporan);
        
        // Trigger pencocokan
        matchingService.findMatchesForTemuan(savedLaporan);
        
        return savedLaporan;
    }
    
    public List<LaporanHilang> getAllLaporanHilang() {
        return laporanHilangRepository.findAll();
    }
    
    public List<LaporanTemuan> getAllLaporanTemuan() {
        return laporanTemuanRepository.findAll();
    }

    public List<LaporanHilang> getLaporanHilangByNim(String nim) {
        return laporanHilangRepository.findByUserNim(nim);
    }

    public List<LaporanTemuan> getLaporanTemuanByNim(String nim) {
        return laporanTemuanRepository.findByUserNim(nim);
    }
}
