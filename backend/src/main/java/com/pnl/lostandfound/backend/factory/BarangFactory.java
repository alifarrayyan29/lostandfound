package com.pnl.lostandfound.backend.factory;

import com.pnl.lostandfound.backend.model.Barang;
import com.pnl.lostandfound.backend.model.BarangDokumen;
import com.pnl.lostandfound.backend.model.BarangElektronik;
import com.pnl.lostandfound.backend.model.BarangUmum;
import com.pnl.lostandfound.backend.model.enums.KondisiBarang;
import org.springframework.stereotype.Component;

@Component
public class BarangFactory {

    public Barang createBarang(String kategori, String deskripsi, String fotoPath, Double latitude, Double longitude, String lokasiDeskripsi, KondisiBarang kondisi) {
        Barang barang;

        if (kategori == null) {
            throw new IllegalArgumentException("Kategori barang tidak boleh null");
        }

        if (kategori.equalsIgnoreCase("DOKUMEN")) {
            barang = new BarangDokumen();
        } else if (kategori.equalsIgnoreCase("ELEKTRONIK")) {
            barang = new BarangElektronik();
        } else if (kategori.equalsIgnoreCase("UMUM")) {
            barang = new BarangUmum();
        } else {
            throw new IllegalArgumentException("Kategori barang tidak valid: " + kategori);
        }

        barang.setDeskripsi(deskripsi);
        barang.setFotoPath(fotoPath);
        barang.setLatitude(latitude);
        barang.setLongitude(longitude);
        barang.setLokasiDeskripsi(lokasiDeskripsi);
        barang.setKondisi(kondisi);

        return barang;
    }
}