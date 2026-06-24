package com.pnl.lostandfound.backend.repository;

import com.pnl.lostandfound.backend.model.LaporanTemuan;
import com.pnl.lostandfound.backend.model.enums.StatusLaporan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LaporanTemuanRepository extends JpaRepository<LaporanTemuan, Long> {
    List<LaporanTemuan> findByStatus(StatusLaporan status);
    List<LaporanTemuan> findByUserNim(String nim);
}

