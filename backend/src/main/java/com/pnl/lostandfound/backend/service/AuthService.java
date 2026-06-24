package com.pnl.lostandfound.backend.service;

import com.pnl.lostandfound.backend.dto.request.LoginRequest;
import com.pnl.lostandfound.backend.dto.request.RegisterRequest;
import com.pnl.lostandfound.backend.dto.response.AuthResponse;
import com.pnl.lostandfound.backend.model.User;
import com.pnl.lostandfound.backend.model.enums.Role;
import com.pnl.lostandfound.backend.model.enums.StatusAkun;
import com.pnl.lostandfound.backend.repository.UserRepository;
import com.pnl.lostandfound.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByNim(request.getNim())) {
            throw new RuntimeException("Error: NIM sudah terdaftar!");
        }

        User user = new User();
        user.setNim(request.getNim());
        user.setNama(request.getNama());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setNomorHp(request.getNomorHp());
        user.setRole(Role.MAHASISWA);
        user.setStatusAkun(StatusAkun.PENDING_VERIFICATION); // Harus diverifikasi admin
        
        // Mocking photo path for now
        user.setFotoKtmPath(request.getFotoKtmPath() != null ? request.getFotoKtmPath() : "dummy_path_ktm.jpg");

        return userRepository.save(user);
    }

    public AuthResponse loginUser(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getNim(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByNim(request.getNim())
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        if (user.getStatusAkun() == StatusAkun.SUSPENDED) {
            throw new RuntimeException("Error: Akun Anda telah disuspend oleh Admin.");
        }
        return AuthResponse.builder()
                .token(jwt)
                .nim(user.getNim())
                .nama(user.getNama())
                .role(user.getRole().name())
                .statusAkun(user.getStatusAkun().name())
                .nomorHp(user.getNomorHp())
                .build();
    }
}
