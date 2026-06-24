package com.pnl.lostandfound.backend.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("DOKUMEN")
public class BarangDokumen extends Barang {
    private String nomorIdentitas;
    private String namaTertera;
}