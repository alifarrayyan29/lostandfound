package com.pnl.lostandfound.backend.controller;

import com.pnl.lostandfound.backend.dto.request.LoginRequest;
import com.pnl.lostandfound.backend.dto.request.RegisterRequest;
import com.pnl.lostandfound.backend.dto.response.AuthResponse;
import com.pnl.lostandfound.backend.model.User;
import com.pnl.lostandfound.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = authService.registerUser(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registrasi berhasil. Akun Anda sedang diverifikasi oleh Admin.");
            
            Map<String, Object> data = new HashMap<>();
            data.put("nim", user.getNim());
            data.put("nama", user.getNama());
            data.put("statusAkun", user.getStatusAkun().name());
            response.put("data", data);

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse authResponse = authService.loginUser(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login berhasil");
            response.put("data", authResponse);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Login gagal: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
    }
}
