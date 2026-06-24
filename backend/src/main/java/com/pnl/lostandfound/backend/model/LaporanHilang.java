package com.pnl.lostandfound.backend.model;

import com.pnl.lostandfound.backend.model.enums.StatusLaporan;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tb_laporan_hilang")
public class LaporanHilang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "barang_id", nullable = false)
    private Barang barang;

    @Enumerated(EnumType.STRING)
    private StatusLaporan status;

    private LocalDateTime tglHilang;

    @Column(columnDefinition = "TEXT")
    private String catatan;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
