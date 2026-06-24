package com.pnl.lostandfound.backend.repository;

import com.pnl.lostandfound.backend.model.MatchResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MatchResultRepository extends JpaRepository<MatchResult, Long> {
    List<MatchResult> findByLaporanHilangId(Long id);
    List<MatchResult> findByLaporanTemuanId(Long id);

    @Query("SELECT m FROM MatchResult m WHERE m.laporanHilang.user.nim = :nim OR m.laporanTemuan.user.nim = :nim ORDER BY m.createdAt DESC")
    List<MatchResult> findByUserNim(@Param("nim") String nim);
}
