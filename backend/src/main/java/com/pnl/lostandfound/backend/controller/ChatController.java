package com.pnl.lostandfound.backend.controller;

import com.pnl.lostandfound.backend.dto.request.PesanRequest;
import com.pnl.lostandfound.backend.dto.response.PesanResponse;
import com.pnl.lostandfound.backend.service.PesanService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final PesanService pesanService;

    @MessageMapping("/chat.send/{matchId}")
    @SendTo("/topic/chat/{matchId}")
    public PesanResponse kirimPesan(
            @DestinationVariable Long matchId,
            @Payload PesanRequest request) {

        if (request.getNimPengirim() == null) {
            throw new RuntimeException("Unauthorized: NIM Pengirim kosong.");
        }
        
        return pesanService.kirimPesan(matchId, request.getNimPengirim(), request);
    }
}
