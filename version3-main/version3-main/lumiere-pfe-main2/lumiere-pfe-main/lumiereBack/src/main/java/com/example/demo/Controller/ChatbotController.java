package com.example.demo.Controller;

import com.example.demo.Service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chatbot")
@CrossOrigin("*")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/message")
    public Map<String, String> getMessage(@RequestBody Map<String, String> request, Principal principal) {
        try {
            String userMessage = request.get("message");
            String platform = request.getOrDefault("platform", "unknown");
            String userEmail = (principal != null) ? principal.getName() : null;
            
            String botResponse = chatbotService.getChatResponse(userMessage, userEmail, platform);
            
            Map<String, String> response = new HashMap<>();
            response.put("response", botResponse);
            return response;
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("response", "Assistant indisponible actuellement. Erreur: " + e.getMessage());
            return errorResponse;
        }
    }
}
