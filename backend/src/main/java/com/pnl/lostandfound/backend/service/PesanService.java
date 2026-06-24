package com.pnl.lostandfound.backend.service;

import com.pnl.lostandfound.backend.dto.request.PesanRequest;
import com.pnl.lostandfound.backend.dto.response.PesanResponse;
import com.pnl.lostandfound.backend.model.MatchResult;
import com.pnl.lostandfound.backend.model.Pesan;
import com.pnl.lostandfound.backend.model.User;
import com.pnl.lostandfound.backend.model.enums.StatusLaporan;
import com.pnl.lostandfound.backend.model.enums.StatusMatch;
import com.pnl.lostandfound.backend.repository.MatchResultRepository;
import com.pnl.lostandfound.backend.repository.PesanRepository;
import com.pnl.lostandfound.backend.repository.UserRepository;
import com.pnl.lostandfound.backend.repository.LaporanHilangRepository;
import com.pnl.lostandfound.backend.repository.LaporanTemuanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PesanService {

    private final PesanRepository pesanRepository;
    private final MatchResultRepository matchResultRepository;
    private final UserRepository userRepository;
    private final LaporanHilangRepository laporanHilangRepository;
    private final LaporanTemuanRepository laporanTemuanRepository;

    @Transactional
    public PesanResponse kirimPesan(Long matchId, String nimPengirim, PesanRequest request) {
        MatchResult match = matchResultRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match tidak ditemukan"));

        User pengirim = userRepository.findByNim(nimPengirim)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        // Validasi pengirim
        boolean isPelaporHilang = match.getLaporanHilang().getUser().getNim().equals(nimPengirim);
        boolean isPelaporTemuan = match.getLaporanTemuan().getUser().getNim().equals(nimPengirim);

        if (!isPelaporHilang && !isPelaporTemuan) {
            throw new RuntimeException("Unauthorized: Anda tidak berhak mengirim pesan di room ini.");
        }

        if (match.getStatus() == StatusMatch.CONFIRMED || match.getStatus() == StatusMatch.REJECTED) {
            throw new RuntimeException("Tidak dapat mengirim pesan. Kasus ini sudah ditutup.");
        }

        // Jika status match masih SUGGESTED, otomatis ubah ke CLAIMED
        if (match.getStatus() == StatusMatch.SUGGESTED) {
            match.setStatus(StatusMatch.CLAIMED);
            matchResultRepository.save(match);
        }

        Pesan pesan = new Pesan();
        pesan.setMatchResult(match);
        pesan.setPengirim(pengirim);
        pesan.setIsiPesan(request.getIsiPesan());
        
        Pesan savedPesan = pesanRepository.save(pesan);

        return buildResponse(savedPesan);
    }

    public List<PesanResponse> getRiwayatPesan(Long matchId, String nimViewer) {
        MatchResult match = matchResultRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match tidak ditemukan"));

        boolean isPelaporHilang = match.getLaporanHilang().getUser().getNim().equals(nimViewer);
        boolean isPelaporTemuan = match.getLaporanTemuan().getUser().getNim().equals(nimViewer);

        if (!isPelaporHilang && !isPelaporTemuan) {
            throw new RuntimeException("Unauthorized: Anda tidak berhak melihat pesan di room ini.");
        }

        return pesanRepository.findByMatchResultIdOrderByCreatedAtAsc(matchId)
                .stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public String konfirmasiSelesai(Long matchId, String nim) {
        MatchResult match = matchResultRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match tidak ditemukan"));

        boolean isPelaporHilang = match.getLaporanHilang().getUser().getNim().equals(nim);
        boolean isPelaporTemuan = match.getLaporanTemuan().getUser().getNim().equals(nim);

        if (!isPelaporHilang && !isPelaporTemuan) {
            throw new RuntimeException("Unauthorized: Anda tidak berhak mengubah status match ini.");
        }

        match.setStatus(StatusMatch.CONFIRMED);
        
        match.getLaporanHilang().setStatus(StatusLaporan.RESOLVED);
        match.getLaporanTemuan().setStatus(StatusLaporan.RESOLVED);
        laporanHilangRepository.save(match.getLaporanHilang());
        laporanTemuanRepository.save(match.getLaporanTemuan());

        matchResultRepository.save(match);
        return "Kasus selesai. Barang telah kembali!";
    }

    @Transactional
    public String tolakMatch(Long matchId, String nim) {
        MatchResult match = matchResultRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match tidak ditemukan"));

        boolean isPelaporHilang = match.getLaporanHilang().getUser().getNim().equals(nim);
        boolean isPelaporTemuan = match.getLaporanTemuan().getUser().getNim().equals(nim);

        if (!isPelaporHilang && !isPelaporTemuan) {
            throw new RuntimeException("Unauthorized: Anda tidak berhak mengubah status match ini.");
        }

        if (match.getStatus() == StatusMatch.CONFIRMED || match.getStatus() == StatusMatch.CLAIMED) {
            throw new RuntimeException("Tidak dapat menolak match yang sudah diklaim atau selesai.");
        }

        match.setStatus(StatusMatch.REJECTED);
        matchResultRepository.save(match);
        return "Match berhasil ditolak.";
    }

    private PesanResponse buildResponse(Pesan pesan) {
        return PesanResponse.builder()
                .id(pesan.getId())
                .matchId(pesan.getMatchResult().getId())
                .nimPengirim(pesan.getPengirim().getNim())
                .namaPengirim(pesan.getPengirim().getNama())
                .isiPesan(pesan.getIsiPesan())
                .isRead(pesan.isRead())
                .createdAt(pesan.getCreatedAt())
                .build();
    }
}
