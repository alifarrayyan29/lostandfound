package com.pnl.lostandfound.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    
    @NotBlank(message = "NIM tidak boleh kosong")
    @Size(max = 20, message = "NIM maksimal 20 karakter")
    private String nim;

    @NotBlank(message = "Nama tidak boleh kosong")
    private String nama;

    @NotBlank(message = "Password tidak boleh kosong")
    private String password;

    @NotBlank(message = "Nomor HP tidak boleh kosong")
    @Size(max = 15, message = "Nomor HP maksimal 15 karakter")
    private String nomorHp;
    
    // Untuk saat ini kita gunakan path dummy/string biasa jika tidak menggunakan MultipartFile
    private String fotoKtmPath;
}
