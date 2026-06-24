package com.pnl.lostandfound.backend.repository;

import com.pnl.lostandfound.backend.model.LaporanHilang;
import com.pnl.lostandfound.backend.model.enums.StatusLaporan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LaporanHilangRepository extends JpaRepository<LaporanHilang, Long> {
    List<LaporanHilang> findByStatus(StatusLaporan status);
    List<LaporanHilang> findByUserNim(String nim);
}

