package com.pnl.lostandfound.backend.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("UMUM")
public class BarangUmum extends Barang {
    private String warna;
    private String ukuran;
}
