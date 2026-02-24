package com.example.demo.script;

import java.io.BufferedReader;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Events;
import com.example.demo.Entity.Ordre;
import com.example.demo.Entity.Statut;
import com.example.demo.Repository.EventsRepository;
import com.example.demo.Repository.OrdreRepository;
import com.example.demo.Service.OrdreService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class FileConversionService {

    @Autowired
    private OrdreRepository ordreRepository;
    @Autowired
    private EventsRepository eventsRepository;

    private final String scriptPath = "C:\\Users\\LENOVO\\Dropbox\\PC\\Downloads\\lumiere-pfe-main\\lumiere-pfe-main\\lumiere-pfe-main2\\lumiere-pfe-main\\ConvertScript.py";
    private final String inputPath = "\\\\172.18.3.56\\requetes_edge_5555\\mesvoyes.json";
    private final String outputPath = "C:\\Users\\LENOVO\\Dropbox\\PC\\Downloads\\lumiere-pfe-main\\lumiere-pfe-main\\lumiere-pfe-main2\\lumiere-pfe-main\\mesvoyes_converted.json";

    public List<?> convertFileAndLoadResults() {
        // Execute the Python script
        PythonScriptExecutor.executePythonScript(scriptPath, inputPath, outputPath);

        // Read the converted JSON file and convert it to a list
        return JsonReader.readJsonFileToList(outputPath);
    }

    public List<?> executePythonScript(String param) {
        List<Object> results = new ArrayList<>();
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("python",
                    "C:\\Users\\LENOVO\\Dropbox\\PC\\Downloads\\lumiere-pfe-main\\lumiere-pfe-main\\lumiere-pfe-main2\\lumiere-pfe-main\\event.py",
                    param);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            process.waitFor();

            String jsonOutput = output.toString().trim();
            if (jsonOutput.isEmpty()) {
                results.add("No data returned from the script.");
            } else {
                results = new ObjectMapper().readValue(jsonOutput, List.class);
            }

        } catch (Exception e) {
            e.printStackTrace();
            results.add("Error: " + e.getMessage());
        }
        return results;
    }

    public void updateOrderStatus() {
        // Charger les ordres planifiés à partir du fichier converti
        List<?> ordresPlanifies = convertFileAndLoadResults();
        // Charger tous les ordres depuis le repository
        // List<Ordre> ordres = ordreRepository.findAll();
        List<Ordre> ordres = ordreRepository.findByStatut(Statut.NON_PLANIFIE);
        // Parcourir et comparer les listes
        for (Ordre ordre : ordres) {
            // if (ordre.getStatut() == Statut.NON_PLANIFIE) {
            for (Object obj : ordresPlanifies) {
                if (obj instanceof Map) { // Ensure the objects are of type Map
                    @SuppressWarnings("unchecked")
                    Map<String, Object> ordrePlanifie = (Map<String, Object>) obj;
                    String otsNumBdx = (String) ordrePlanifie.get("OTSNUMBDX");
                    String voycle = ordrePlanifie.get("VOYCLE").toString();

                    String salnom = ordrePlanifie.get("SALNOM").toString();
                    String saltel = ordrePlanifie.get("SALTEL").toString();
                    String camion = ordrePlanifie.get("PLAMOTI").toString();
                    String datevoy = ordrePlanifie.get("VOYDTD").toString();
                    if (ordre.getOrderNumber().equals(otsNumBdx)) {
                        // Update the order status and other fields
                        ordre.setStatut(Statut.PLANIFIE);
                        ordre.setVoycle(voycle);
                        ordre.setChauffeur(salnom);
                        ordre.setTelchauffeur(saltel);
                        ordre.setCamion(camion);
                        ordre.setDatevoy(datevoy);
                        break;
                    }
                }
            }
            // }

            // Enregistrer les ordres mis à jour dans la base de données
            ordreRepository.saveAll(ordres);
        }
    }

    public Set<String> updateOrdrevent(String param) {

        List<?> events = executePythonScript(param);
        System.out.println(events);

        Optional<Ordre> ordr = ordreRepository.findByVoycle(param);
        Ordre o = ordr.get();
        Set<String> listevents = o.getEvents();

        if (listevents == null) {
            listevents = new HashSet<>();
        }

        if (listevents.size() < events.size()) {

            listevents.clear();
            o.setEvents(listevents);

            for (Object obj : events) {
                if (obj instanceof Map) { // Ensure the objects are of type Map
                    @SuppressWarnings("unchecked")
                    Map<String, Object> event = (Map<String, Object>) obj;
                    String voycle = event.get("voycle").toString();
                    String chauff = event.get("chauff").toString();
                    String camion = event.get("camion").toString();
                    String name_event = event.get("name_event").toString();
                    String date_saisi = event.get("date_saisi").toString();
                    String km = event.get("KM").toString();
                    listevents.add(date_saisi);

                }

            }
            List<String> eventList = new ArrayList<>(listevents);
            Collections.sort(eventList);
            Set<String> evs = new LinkedHashSet<>(eventList);
            o.setEvents(evs);
            System.out.println(listevents);

            if (o.getEvents().size() == 1) {
                o.setStatut(Statut.PLANIFIE);

            }

            if (o.getEvents().size() == 2) {
                o.setStatut(Statut.EN_COURS_DE_CHARGEMENT);

            }

            if (o.getEvents().size() == 3) {
                o.setStatut(Statut.EN_COURS_DE_CHARGEMENT);

            }

            if (o.getEvents().size() == 4) {
                o.setStatut(Statut.CHARGE);

            }
            if (o.getEvents().size() == 5) {
                o.setStatut(Statut.EN_COURS_DE_LIVRAISON);

            }

            if (o.getEvents().size() == 6) {
                o.setStatut(Statut.LIVRE);

            }

            ordreRepository.save(o);

        }

        return listevents;
    }

    @Scheduled(cron = "0 */4 * * * *")
    public void updateAllordre() {

        this.updateOrderStatus();

    }

    @Scheduled(cron = "0 */7 * * * *")
    public void updateAllordresevents() {

        List<Ordre> listordre = ordreRepository.findAll();

        for (Ordre ord : listordre) {

            if (ord.getStatut() != Statut.NON_CONFIRME && ord.getStatut() != Statut.NON_PLANIFIE) {

                this.updateOrdrevent(ord.getVoycle());

            }
        }

    }

}