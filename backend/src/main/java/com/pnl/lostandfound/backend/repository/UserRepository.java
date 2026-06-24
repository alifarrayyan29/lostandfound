package com.pnl.lostandfound.backend.repository;

import com.pnl.lostandfound.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByNim(String nim);
    boolean existsByNim(String nim);
}
