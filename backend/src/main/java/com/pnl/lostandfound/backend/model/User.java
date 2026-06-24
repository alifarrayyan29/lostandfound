package com.pnl.lostandfound.backend.model;

import com.pnl.lostandfound.backend.model.enums.Role;
import com.pnl.lostandfound.backend.model.enums.StatusAkun;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tb_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String nim;

    @Column(nullable = false)
    private String nama;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 15)
    private String nomorHp;

    private String fotoKtmPath;

    @Enumerated(EnumType.STRING)
    private StatusAkun statusAkun = StatusAkun.PENDING_VERIFICATION;

    @Enumerated(EnumType.STRING)
    private Role role = Role.MAHASISWA;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
