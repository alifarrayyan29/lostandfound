package com.pnl.lostandfound.backend.repository;

import com.pnl.lostandfound.backend.model.Barang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BarangRepository extends JpaRepository<Barang, Long> {
    // Spring Data JPA otomatis menyediakan fungsi save(), findAll(), findById(), dll.
}