package com.pnl.lostandfound.backend.security;

import com.pnl.lostandfound.backend.model.User;
import com.pnl.lostandfound.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String nim) throws UsernameNotFoundException {
        User user = userRepository.findByNim(nim)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with NIM: " + nim));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getNim())
                .password(user.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
                .build();
    }
}
