package com.example.demo.Service;

import com.example.demo.Entity.*;
import com.example.demo.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.HttpStatusCodeException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ChatbotService {
    private static final Logger log = LoggerFactory.getLogger(ChatbotService.class);

    @Autowired
    private OrdreRepository ordreRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.model}")
    private String geminiModel;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    public String getChatResponse(String userMessage, String userEmail) {
        String url = String.format(GEMINI_API_URL, geminiModel, geminiApiKey);

        // Date/heure actuelle pour le calcul des rappels (plus précis que juste du texte)
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        // System prompt avec support multilingue explicite
        String systemPrompt = "Tu es l'assistant logistique de Lumière Transport (OTFlow). " +
                             "Date et heure actuelle: " + currentTime + ". " +
                             "Tu peux consulter les ordres de transport, lister les clients de l'utilisateur, et créer des rappels (notifications). " +
                             "Supporte nativement le français, l'anglais et l'arabe. " +
                             "IMPORTANT: Affiche les informations de manière TRÈS CONCISE et ÉLÉGANTE. " +
                             "N'affiche jamais d'IDs techniques internes. Sois professionnel et va droit au but.";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 1. Initial Request with Tool Definitions
        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> userContent = new HashMap<>();
        userContent.put("role", "user");
        userContent.put("parts", Collections.singletonList(Collections.singletonMap("text", systemPrompt + "\n\nMessage: " + userMessage)));
        contents.add(userContent);
        requestBody.put("contents", contents);
        requestBody.put("tools", getTools());

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);
            Map<String, Object> firstCandidate = (Map<String, Object>) ((List) response.get("candidates")).get(0);
            Map<String, Object> modelContent = (Map<String, Object>) firstCandidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) modelContent.get("parts");

            // Check if model wants to call a function
            if (parts != null && !parts.isEmpty() && parts.get(0).containsKey("functionCall")) {
                Map<String, Object> functionCall = (Map<String, Object>) parts.get(0).get("functionCall");
                String functionName = (String) functionCall.get("name");
                Map<String, Object> args = (Map<String, Object>) functionCall.get("args");

                log.info("Gemini requested tool: {} with args: {}", functionName, args);
                // Execute the tool locally
                Object result = executeTool(functionName, args, userEmail);
                log.info("Tool result: {}", result);

                // 2. Second Turn: Send Function Result back to Model
                List<Map<String, Object>> followUpContents = new ArrayList<>(contents);
                followUpContents.add(modelContent); // Model's functionCall turn

                Map<String, Object> functionResponseTurn = new HashMap<>();
                functionResponseTurn.put("role", "function");
                Map<String, Object> functionPart = new HashMap<>();
                Map<String, Object> responseData = new HashMap<>();
                responseData.put("name", functionName);
                responseData.put("response", Collections.singletonMap("content", result));
                functionPart.put("functionResponse", responseData);
                functionResponseTurn.put("parts", Collections.singletonList(functionPart));
                followUpContents.add(functionResponseTurn);

                requestBody.put("contents", followUpContents);
                HttpEntity<Map<String, Object>> followUpRequest = new HttpEntity<>(requestBody, headers);
                
                log.info("Sending follow-up turn to Gemini...");
                Map<String, Object> finalResponse = restTemplate.postForObject(url, followUpRequest, Map.class);
                String finalResult = extractTextFromResponse(finalResponse);
                log.info("Final Gemini response: {}", finalResult);
                return finalResult;
            }

            return extractTextFromResponse(response);
        } catch (HttpStatusCodeException e) {
            log.error("Gemini API Error ({}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            if (e.getStatusCode().value() == 429) {
                return "Désolé, la limite de messages gratuite a été atteinte (Quota Gemini). Veuillez patienter une minute avant de réessayer.";
            }
            return "Erreur lors de l'accès à l'IA : " + e.getResponseBodyAsString();
        } catch (Exception e) {
            log.error("General error in ChatbotService: ", e);
            return "Désolé, je rencontre une erreur technique : " + e.getMessage();
        }
    }

    private List<Map<String, Object>> getTools() {
        List<Map<String, Object>> tools = new ArrayList<>();

        // Tool: get_order_details
        Map<String, Object> getOrder = new HashMap<>();
        getOrder.put("name", "get_order_details");
        getOrder.put("description", "Obtenir les détails (statut, chauffeur, camion) d'un ordre via sa référence (voycle ou orderNumber)");
        Map<String, Object> orderParams = new HashMap<>();
        orderParams.put("type", "object");
        Map<String, Object> orderProps = new HashMap<>();
        orderProps.put("order_ref", Collections.singletonMap("type", "string"));
        orderParams.put("properties", orderProps);
        orderParams.put("required", Collections.singletonList("order_ref"));
        getOrder.put("parameters", orderParams);
        tools.add(Collections.singletonMap("function_declarations", Collections.singletonList(getOrder)));

        // Tool: list_my_clients
        Map<String, Object> listClients = new HashMap<>();
        listClients.put("name", "list_my_clients");
        listClients.put("description", "Lister tous les clients que je gère");
        listClients.put("parameters", Collections.singletonMap("type", "object"));
        tools.add(Collections.singletonMap("function_declarations", Collections.singletonList(listClients)));

        // Tool: create_reminder
        Map<String, Object> createReminder = new HashMap<>();
        createReminder.put("name", "create_reminder");
        createReminder.put("description", "Créer un rappel ou une notification (ex: 'appeler client à 10h')");
        Map<String, Object> reminderParams = new HashMap<>();
        reminderParams.put("type", "object");
        Map<String, Object> reminderProps = new HashMap<>();
        reminderProps.put("text", Collections.singletonMap("type", "string"));
        reminderProps.put("time", Collections.singletonMap("type", "string"));
        reminderParams.put("properties", reminderProps);
        reminderParams.put("required", Arrays.asList("text", "time"));
        createReminder.put("parameters", reminderParams);
        tools.add(Collections.singletonMap("function_declarations", Collections.singletonList(createReminder)));

        return tools;
    }

    private Object executeTool(String name, Map<String, Object> args, String userEmail) {
        if (userEmail == null) return "User unidentified.";
        Optional<User> userOpt = userRepository.findFirstByEmailOrderByIdAsc(userEmail);
        if (userOpt.isEmpty()) return "User not found in DB.";
        User user = userOpt.get();

        switch (name) {
            case "get_order_details":
                String ref = (String) args.get("order_ref");
                List<Ordre> ordersByVoycle = ordreRepository.findByVoycle(ref);
                Optional<Ordre> order = ordersByVoycle.isEmpty() ? Optional.empty() : Optional.of(ordersByVoycle.get(0));
                
                if (order.isEmpty()) order = ordreRepository.findByOrderNumber(ref);
                
                if (order.isPresent()) {
                    Ordre o = order.get();
                    return "Ordre " + ref + ": Statut=" + o.getStatut() + 
                           ", Chauffeur=" + o.getChauffeur() + ", Camion=" + o.getCamion() +
                           ", Ville Livr=" + o.getLivraisonVille();
                }
                return "Order reference '" + ref + "' not found.";

            case "list_my_clients":
                List<Client> clients = clientRepository.findByOwner(user);
                if (clients.isEmpty()) return "No clients found for you.";
                StringBuilder res = new StringBuilder("Voici vos clients actifs :\n");
                for (Client c : clients) res.append("• ").append(c.getNom()).append("\n");
                return res.toString();

            case "create_reminder":
                String text = (String) args.get("text");
                String timeStr = (String) args.get("time");
                Notification note = new Notification();
                note.setType("RAPPEL");
                note.setMessage("📅 Rappel: " + text + " (Prévu pour: " + timeStr + ")");
                notificationRepository.save(note);
                return "Rappel créé avec succès: '" + text + "' pour " + timeStr;

            default:
                return "Unknown tool";
        }
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(Map<String, Object> response) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> candidate = candidates.get(0);
                Map<String, Object> content = (Map<String, Object>) candidate.get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
        } catch (Exception e) {
            // Log error
        }
        return "Je n'ai pas pu générer de réponse.";
    }
}
