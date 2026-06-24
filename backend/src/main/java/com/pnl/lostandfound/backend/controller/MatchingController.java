package com.pnl.lostandfound.backend.controller;

import com.pnl.lostandfound.backend.model.MatchResult;
import com.pnl.lostandfound.backend.repository.MatchResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/matching")
@CrossOrigin(origins = "*")
public class MatchingController {

    @Autowired
    private MatchResultRepository matchResultRepository;

    @GetMapping("/hilang/{id}")
    public ResponseEntity<List<MatchResult>> getSaranUntukHilang(@PathVariable Long id) {
        return ResponseEntity.ok(matchResultRepository.findByLaporanHilangId(id));
    }

    @GetMapping("/temuan/{id}")
    public ResponseEntity<List<MatchResult>> getSaranUntukTemuan(@PathVariable Long id) {
        return ResponseEntity.ok(matchResultRepository.findByLaporanTemuanId(id));
    }

    @GetMapping("/my-matches")
    public ResponseEntity<List<MatchResult>> getMyMatches(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        List<MatchResult> results = matchResultRepository.findByUserNim(principal.getName());
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchResult> getMatchById(@PathVariable Long id, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        MatchResult match = matchResultRepository.findById(id).orElse(null);
        if (match == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(match);
    }
}
