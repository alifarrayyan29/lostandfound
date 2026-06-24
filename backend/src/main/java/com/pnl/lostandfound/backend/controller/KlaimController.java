package com.pnl.lostandfound.backend.controller;

import com.pnl.lostandfound.backend.dto.request.PesanRequest;
import com.pnl.lostandfound.backend.dto.response.PesanResponse;
import com.pnl.lostandfound.backend.service.PesanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/klaim")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class KlaimController {

    private final PesanService pesanService;

    @PostMapping("/{matchId}/pesan")
    public ResponseEntity<PesanResponse> kirimPesan(
            @PathVariable Long matchId,
            @RequestBody PesanRequest request,
            Authentication authentication) {
        
        String nimPengirim = authentication.getName();
        PesanResponse response = pesanService.kirimPesan(matchId, nimPengirim, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{matchId}/pesan")
    public ResponseEntity<List<PesanResponse>> getRiwayatPesan(
            @PathVariable Long matchId,
            Authentication authentication) {
        
        String nimViewer = authentication.getName();
        List<PesanResponse> response = pesanService.getRiwayatPesan(matchId, nimViewer);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{matchId}/konfirmasi")
    public ResponseEntity<?> konfirmasiSelesai(
            @PathVariable Long matchId,
            Authentication authentication) {
        
        String nim = authentication.getName();
        String message = pesanService.konfirmasiSelesai(matchId, nim);
        return ResponseEntity.ok(Map.of("message", message));
    }
}
