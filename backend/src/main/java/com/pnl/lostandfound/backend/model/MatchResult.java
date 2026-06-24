package com.pnl.lostandfound.backend.model;

import com.pnl.lostandfound.backend.model.enums.StatusMatch;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tb_match")
public class MatchResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "laporan_hilang_id", nullable = false)
    private LaporanHilang laporanHilang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "laporan_temuan_id", nullable = false)
    private LaporanTemuan laporanTemuan;

    @Column(precision = 5, scale = 2)
    private BigDecimal skorKecocokan;

    @Enumerated(EnumType.STRING)
    private StatusMatch status;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
