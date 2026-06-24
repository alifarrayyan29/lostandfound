package com.pnl.lostandfound.backend.controller;

import com.pnl.lostandfound.backend.dto.request.LaporanHilangRequest;
import com.pnl.lostandfound.backend.dto.request.LaporanTemuanRequest;
import com.pnl.lostandfound.backend.model.LaporanHilang;
import com.pnl.lostandfound.backend.model.LaporanTemuan;
import com.pnl.lostandfound.backend.service.LaporanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/laporan")
@CrossOrigin(origins = "*")
public class LaporanController {

    @Autowired
    private LaporanService laporanService;

    @PostMapping("/hilang")
    public ResponseEntity<?> buatLaporanHilang(Principal principal, @RequestBody LaporanHilangRequest request) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized: Silakan login terlebih dahulu.");
        String nim = principal.getName();
        try {
            LaporanHilang laporan = laporanService.laporHilang(nim, request);
            return ResponseEntity.ok(laporan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/temuan")
    public ResponseEntity<?> buatLaporanTemuan(Principal principal, @RequestBody LaporanTemuanRequest request) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized: Silakan login terlebih dahulu.");
        String nim = principal.getName();
        try {
            LaporanTemuan laporan = laporanService.laporTemuan(nim, request);
            return ResponseEntity.ok(laporan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/hilang")
    public ResponseEntity<List<LaporanHilang>> getLaporanHilang() {
        return ResponseEntity.ok(laporanService.getAllLaporanHilang());
    }

    @GetMapping("/temuan")
    public ResponseEntity<List<LaporanTemuan>> getLaporanTemuan() {
        return ResponseEntity.ok(laporanService.getAllLaporanTemuan());
    }

    @GetMapping("/hilang/saya")
    public ResponseEntity<List<LaporanHilang>> getLaporanHilangSaya(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(laporanService.getLaporanHilangByNim(principal.getName()));
    }

    @GetMapping("/temuan/saya")
    public ResponseEntity<List<LaporanTemuan>> getLaporanTemuanSaya(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(laporanService.getLaporanTemuanByNim(principal.getName()));
    }
}
