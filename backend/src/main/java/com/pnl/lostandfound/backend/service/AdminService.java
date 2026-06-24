package com.pnl.lostandfound.backend.service;

import com.pnl.lostandfound.backend.model.MatchResult;
import com.pnl.lostandfound.backend.model.User;
import com.pnl.lostandfound.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
}
