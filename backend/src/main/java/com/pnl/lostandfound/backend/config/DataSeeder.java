package com.pnl.lostandfound.backend.config;

import com.pnl.lostandfound.backend.model.User;
import com.pnl.lostandfound.backend.model.enums.Role;
import com.pnl.lostandfound.backend.model.enums.StatusAkun;
import com.pnl.lostandfound.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByNim("admin").isEmpty()) {
            User admin = new User();
            admin.setNim("admin");
            admin.setNama("Administrator Pusat");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setNomorHp("080000000000");
            admin.setStatusAkun(StatusAkun.ACTIVE);
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Akun Admin berhasil di-generate! (NIM: admin, Password: admin123)");
        }
    }
}
