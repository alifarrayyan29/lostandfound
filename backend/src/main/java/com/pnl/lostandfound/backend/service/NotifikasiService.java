package com.pnl.lostandfound.backend.service;

import com.pnl.lostandfound.backend.model.MatchResult;
import com.pnl.lostandfound.backend.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotifikasiService {

    @Value("${app.whatsapp.api-url:https://api.whatsapp-gateway.com}")
    private String waApiUrl;

    @Value("${app.whatsapp.token:SIMULATED_TOKEN}")
    private String waToken;

    public void kirimNotifikasiMatch(User pemilik, MatchResult match) {
        String pesan = buildMatchMessage(pemilik.getNama(), match);

        log.info("========== MENGIRIM NOTIFIKASI WHATSAPP ==========");
        log.info("Ke Nomor: {}", pemilik.getNomorHp());
        log.info("Pesan: \n{}", pesan);
        log.info("==================================================");

        try {
            // Simulasi pengiriman HTTP Request ke API WhatsApp
            log.info("Notifikasi WhatsApp berhasil dikirim (SIMULASI).");
        } catch (Exception e) {
            log.error("Gagal kirim WA ke {}: {}", pemilik.getNomorHp(), e.getMessage());
        }
    }

    private String buildMatchMessage(String nama, MatchResult match) {
        String lokasi = match.getLaporanTemuan().getBarang().getLokasiDeskripsi() != null ?
                match.getLaporanTemuan().getBarang().getLokasiDeskripsi() : "Lokasi tidak diketahui";
                
        String tanggal = match.getLaporanTemuan().getCreatedAt() != null ?
                match.getLaporanTemuan().getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMMM yyyy, HH:mm")) : 
                "Waktu tidak diketahui";

        return String.format(
            "Halo %s! 👋\n\n" +
            "Sistem Lost & Found PNL mendeteksi kemungkinan barang Anda ditemukan!\n\n" +
            "📍 Lokasi Temuan: %s\n" +
            "📅 Tanggal Temuan: %s\n" +
            "🎯 Skor Kecocokan: %.1f%%\n\n" +
            "Silakan buka aplikasi untuk melihat detail dan menghubungi penemu.\n\n" +
            "Lost & Found PNL",
            nama,
            lokasi,
            tanggal,
            match.getSkorKecocokan().doubleValue()
        );
    }
}
