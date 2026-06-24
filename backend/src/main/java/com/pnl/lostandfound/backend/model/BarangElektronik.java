package com.pnl.lostandfound.backend.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("ELEKTRONIK")
public class BarangElektronik extends Barang {
    private String merk;
    private String warnaPerangkat;
    private String tipePerangkat;
}