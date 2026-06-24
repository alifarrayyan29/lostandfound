package com.pnl.lostandfound.backend.service;

import com.pnl.lostandfound.backend.model.MatchResult;
import com.pnl.lostandfound.backend.model.User;
import com.pnl.lostandfound.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

import com.pnl.lostandfound.backend.dto.response.AdminDashboardResponse;
import com.pnl.lostandfound.backend.dto.response.HeatmapPoint;
import com.pnl.lostandfound.backend.dto.response.MonthlyStat;
import com.pnl.lostandfound.backend.model.LaporanHilang;
import com.pnl.lostandfound.backend.model.LaporanTemuan;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final LaporanHilangRepository laporanHilangRepository;
    private final LaporanTemuanRepository laporanTemuanRepository;
    private final MatchResultRepository matchResultRepository;
    private final PesanRepository pesanRepository;

    public Map<String, Long> getStatistics() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalLaporanHilang", laporanHilangRepository.count());
        stats.put("totalLaporanTemuan", laporanTemuanRepository.count());
        stats.put("totalMatches", matchResultRepository.count());
        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteLaporanHilang(Long id) {
        List<MatchResult> matches = matchResultRepository.findByLaporanHilangId(id);
        for (MatchResult match : matches) {
            pesanRepository.deleteAll(pesanRepository.findByMatchResultIdOrderByCreatedAtAsc(match.getId()));
        }
        matchResultRepository.deleteAll(matches);
        laporanHilangRepository.deleteById(id);
    }

    @Transactional
    public void deleteLaporanTemuan(Long id) {
        List<MatchResult> matches = matchResultRepository.findByLaporanTemuanId(id);
        for (MatchResult match : matches) {
            pesanRepository.deleteAll(pesanRepository.findByMatchResultIdOrderByCreatedAtAsc(match.getId()));
        }
        matchResultRepository.deleteAll(matches);
        laporanTemuanRepository.deleteById(id);
    }

    @Transactional
    public User verifyUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
        user.setStatusAkun(com.pnl.lostandfound.backend.model.enums.StatusAkun.ACTIVE);
        return userRepository.save(user);
    }

    public AdminDashboardResponse getAdvancedDashboardData() {
        AdminDashboardResponse response = new AdminDashboardResponse();
        
        // 1. Basic Stats
        response.setBasicStats(getStatistics());

        // 2. Fetch all laporans
        List<LaporanHilang> hilangList = laporanHilangRepository.findAll();
        List<LaporanTemuan> temuanList = laporanTemuanRepository.findAll();

        // 3. Process Heatmap Data
        List<HeatmapPoint> heatmapData = new ArrayList<>();
        for (LaporanHilang h : hilangList) {
            if (h.getBarang() != null && h.getBarang().getLatitude() != null && h.getBarang().getLongitude() != null) {
                heatmapData.add(new HeatmapPoint(h.getBarang().getLatitude(), h.getBarang().getLongitude(), 1.0, "HILANG"));
            }
        }
        for (LaporanTemuan t : temuanList) {
            if (t.getBarang() != null && t.getBarang().getLatitude() != null && t.getBarang().getLongitude() != null) {
                heatmapData.add(new HeatmapPoint(t.getBarang().getLatitude(), t.getBarang().getLongitude(), 1.0, "TEMUAN"));
            }
        }
        response.setHeatmapData(heatmapData);

        // 4. Process Monthly Stats (Last 6 Months)
        LocalDateTime now = LocalDateTime.now();
        List<MonthlyStat> monthlyStats = new ArrayList<>();
        
        for (int i = 5; i >= 0; i--) {
            LocalDateTime monthDate = now.minusMonths(i);
            int year = monthDate.getYear();
            int monthValue = monthDate.getMonthValue();
            String monthName = monthDate.getMonth().getDisplayName(TextStyle.SHORT, new Locale("id", "ID"));
            
            long hilangCount = hilangList.stream()
                .filter(h -> h.getCreatedAt().getYear() == year && h.getCreatedAt().getMonthValue() == monthValue)
                .count();
                
            long temuanCount = temuanList.stream()
                .filter(t -> t.getCreatedAt().getYear() == year && t.getCreatedAt().getMonthValue() == monthValue)
                .count();
                
            monthlyStats.add(new MonthlyStat(monthName, hilangCount, temuanCount));
        }
        response.setMonthlyStats(monthlyStats);

        return response;
    }
}
