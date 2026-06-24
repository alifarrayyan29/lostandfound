package com.pnl.lostandfound.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyStat {
    private String name; // e.g. "Jan", "Feb"
    private Long hilang;
    private Long temuan;
}
