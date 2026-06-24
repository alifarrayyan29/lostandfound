package com.pnl.lostandfound.backend.service;

import com.pnl.lostandfound.backend.model.*;
import com.pnl.lostandfound.backend.model.enums.StatusLaporan;
import com.pnl.lostandfound.backend.model.enums.StatusMatch;
import com.pnl.lostandfound.backend.repository.LaporanHilangRepository;
import com.pnl.lostandfound.backend.repository.LaporanTemuanRepository;
import com.pnl.lostandfound.backend.repository.MatchResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final MatchResultRepository matchResultRepository;
    private final LaporanHilangRepository laporanHilangRepository;
    private final LaporanTemuanRepository laporanTemuanRepository;
    private final GeolocationService geolocationService;
    private final NotifikasiService notifikasiService;

    private static final double MINIMUM_MATCH_THRESHOLD = 60.0;

    @Transactional
    public void findMatchesForHilang(LaporanHilang hilang) {
        List<LaporanTemuan> temuanList = laporanTemuanRepository.findByStatus(StatusLaporan.TERSEDIA);
        for (LaporanTemuan temuan : temuanList) {
            double score = calculateScore(hilang.getBarang(), temuan.getBarang());
            if (score >= MINIMUM_MATCH_THRESHOLD) {
                saveMatchResult(hilang, temuan, score);
            }
        }
    }

    @Transactional
    public void findMatchesForTemuan(LaporanTemuan temuan) {
        List<LaporanHilang> hilangList = laporanHilangRepository.findByStatus(StatusLaporan.ACTIVE);
        for (LaporanHilang hilang : hilangList) {
            double score = calculateScore(hilang.getBarang(), temuan.getBarang());
            if (score >= MINIMUM_MATCH_THRESHOLD) {
                saveMatchResult(hilang, temuan, score);
            }
        }
    }

    private void saveMatchResult(LaporanHilang hilang, LaporanTemuan temuan, double score) {
        MatchResult result = new MatchResult();
        result.setLaporanHilang(hilang);
        result.setLaporanTemuan(temuan);
        result.setSkorKecocokan(BigDecimal.valueOf(score));
        result.setStatus(StatusMatch.SUGGESTED);
        MatchResult savedResult = matchResultRepository.save(result);
        
        // Kirim notifikasi WA ke pelapor hilang
        notifikasiService.kirimNotifikasiMatch(hilang.getUser(), savedResult);
    }

    private double calculateScore(Barang bHilang, Barang bTemuan) {
        // 1. Kategori dicek melalui instanceof di tahap akhir


        double score = 0.0;

        // 2. Geolocation / Jarak (Max 30%)
        double distance = geolocationService.calculateDistance(
                bHilang.getLatitude(), bHilang.getLongitude(),
                bTemuan.getLatitude(), bTemuan.getLongitude()
        );
        if (distance <= 500) {
            score += 30.0;
        } else if (distance <= 2000) {
            score += 15.0; // Partial score
        }

        // 3. Kemiripan Deskripsi (Max 40%)
        score += calculateTextSimilarity(bHilang.getDeskripsi(), bTemuan.getDeskripsi(), 40.0);

        // 4. Kemiripan Spesifik Berdasarkan Subclass (Max 30%)
        if (bHilang instanceof BarangElektronik && bTemuan instanceof BarangElektronik) {
            BarangElektronik eHilang = (BarangElektronik) bHilang;
            BarangElektronik eTemuan = (BarangElektronik) bTemuan;
            double specScore = 0.0;
            if (matches(eHilang.getMerk(), eTemuan.getMerk())) specScore += 15.0;
            if (matches(eHilang.getWarnaPerangkat(), eTemuan.getWarnaPerangkat())) specScore += 15.0;
            score += specScore;
        } else if (bHilang instanceof BarangDokumen && bTemuan instanceof BarangDokumen) {
            BarangDokumen dHilang = (BarangDokumen) bHilang;
            BarangDokumen dTemuan = (BarangDokumen) bTemuan;
            double specScore = 0.0;
            if (matches(dHilang.getNamaTertera(), dTemuan.getNamaTertera())) specScore += 30.0;
            score += specScore;
        } else if (bHilang instanceof BarangUmum && bTemuan instanceof BarangUmum) {
            BarangUmum uHilang = (BarangUmum) bHilang;
            BarangUmum uTemuan = (BarangUmum) bTemuan;
            if (matches(uHilang.getWarna(), uTemuan.getWarna())) {
                score += 30.0;
            }
        } else {
            // Default untuk parent atau subclass tak tertangani (kasih setengah bonus)
            score += 15.0; 
        }

        return Math.min(score, 100.0);
    }

    private boolean matches(String val1, String val2) {
        if (val1 == null || val2 == null || val1.trim().isEmpty() || val2.trim().isEmpty()) {
            return false;
        }
        return val1.toLowerCase().trim().contains(val2.toLowerCase().trim()) || 
               val2.toLowerCase().trim().contains(val1.toLowerCase().trim());
    }

    private double calculateTextSimilarity(String text1, String text2, double maxScore) {
        if (text1 == null || text2 == null) return 0.0;
        
        Set<String> words1 = new HashSet<>(Arrays.asList(text1.toLowerCase().split("\\W+")));
        Set<String> words2 = new HashSet<>(Arrays.asList(text2.toLowerCase().split("\\W+")));
        
        if (words1.isEmpty() || words2.isEmpty()) return 0.0;
        
        Set<String> intersection = new HashSet<>(words1);
        intersection.retainAll(words2);
        
        // Jaccard Similarity index
        Set<String> union = new HashSet<>(words1);
        union.addAll(words2);
        
        double ratio = (double) intersection.size() / union.size();
        // Berikan maxScore jika setidaknya 50% kata cocok
        if (ratio >= 0.5) return maxScore;
        return ratio * 2.0 * maxScore; // Scaling factor agar lebih mudah dapat nilai tinggi
    }
}
