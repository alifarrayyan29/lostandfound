package com.pnl.lostandfound.backend.dto.request;

import com.pnl.lostandfound.backend.model.enums.KondisiBarang;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LaporanTemuanRequest {
    private String kategori;
    private String deskripsi;
    private String fotoPath;
    private Double latitude;
    private Double longitude;
    private String lokasiDeskripsi;
    private KondisiBarang kondisi;
    
    // Khusus Dokumen
    private String namaTertera;
    private String nomorIdentitas;
    
    // Khusus Elektronik
    private String merk;
    private String warnaPerangkat;
    private String tipePerangkat;
    
    // Khusus Umum
    private String warna;
    private String ukuran;
    
    // Data Laporan
    private LocalDateTime tglTemuan;
    private String catatan;
}
