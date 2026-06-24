package com.pnl.lostandfound.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HeatmapPoint {
    private Double lat;
    private Double lng;
    private Double intensity;
    private String type; // "HILANG" atau "TEMUAN"
}
