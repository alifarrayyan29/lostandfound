package com.pnl.lostandfound.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "NIM tidak boleh kosong")
    private String nim;

    @NotBlank(message = "Password tidak boleh kosong")
    private String password;
}
