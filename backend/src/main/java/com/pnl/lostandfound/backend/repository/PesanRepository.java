package com.pnl.lostandfound.backend.repository;

import com.pnl.lostandfound.backend.model.Pesan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PesanRepository extends JpaRepository<Pesan, Long> {
    List<Pesan> findByMatchResultIdOrderByCreatedAtAsc(Long matchId);
}
