package com.pnl.lostandfound.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PesanResponse {
    private Long id;
    private Long matchId;
    private String nimPengirim;
    private String namaPengirim;
    private String isiPesan;
    private boolean isRead;
    private LocalDateTime createdAt;
}
