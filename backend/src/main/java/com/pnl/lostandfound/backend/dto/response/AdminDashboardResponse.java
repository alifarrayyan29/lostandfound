package com.pnl.lostandfound.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private Map<String, Long> basicStats;
    private List<MonthlyStat> monthlyStats;
    private List<HeatmapPoint> heatmapData;
}
