package com.pnl.lostandfound.backend.controller;

import com.pnl.lostandfound.backend.model.User;
import com.pnl.lostandfound.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStatistics() {
        return ResponseEntity.ok(adminService.getStatistics());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/laporan/hilang/{id}")
    public ResponseEntity<?> deleteLaporanHilang(@PathVariable Long id) {
        adminService.deleteLaporanHilang(id);
        return ResponseEntity.ok(Map.of("message", "Laporan Hilang berhasil dihapus beserta data terkaitnya."));
    }

    @DeleteMapping("/laporan/temuan/{id}")
    public ResponseEntity<?> deleteLaporanTemuan(@PathVariable Long id) {
        adminService.deleteLaporanTemuan(id);
        return ResponseEntity.ok(Map.of("message", "Laporan Temuan berhasil dihapus beserta data terkaitnya."));
    }

    @PutMapping("/users/{id}/verify")
    public ResponseEntity<?> verifyUser(@PathVariable Long id) {
        try {
            User user = adminService.verifyUser(id);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User " + user.getNim() + " berhasil diverifikasi."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}
