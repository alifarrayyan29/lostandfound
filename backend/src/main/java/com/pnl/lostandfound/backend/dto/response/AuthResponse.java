package com.pnl.lostandfound.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String nim;
    private String nama;
    private String role;
    private String statusAkun;
    private String nomorHp;
}
