package com.example.demo.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Ordre;

@Service
public class PlaFileService {

    public void generatePlaFile(Ordre ordre) throws IOException {
        // Build the content of the PLA file
        StringBuilder sb = new StringBuilder();

        // Format the dates correctly
        String dateSaisie = formatDate(ordre.getDateSaisie());
        String livraisonDate = formatDate(ordre.getLivraisonDate());
        String chargementDate = formatDate(ordre.getChargementDate());

        // Concatenate comments
        List<String> comments = new ArrayList<>(ordre.getCommentaires());
        StringBuilder comment = new StringBuilder();
        for (int i = 0; i < comments.size(); i++) {
            if (i == (comments.size() - 1)) {
                comment.append(comments.get(i));
            } else {
                comment.append(comments.get(i)).append("-");
            }
        }

        // Append order data to the StringBuilder   codeclientcharg
        sb.append("1|DISPRO|").append(ordre.getClient()).append("|").append(ordre.getNomclient()).append("|")
          .append(ordre.getIdedi()).append("|").append(ordre.getIdedi()).append("|||")
          .append("LUMIERETRSP").append("|")
          .append(ordre.getSiteclient()).append("|").append(ordre.getSiteclient()).append("|LUMIERETRSP|")
          .append(ordre.getCodeclientcharg()).append("|").append(ordre.getCodeclientcharg()).append("|||")
          .append(ordre.getLivraisonNom()).append("|").append(ordre.getCodeclientliv()).append("|")
          .append(ordre.getLivraisonAdr1()).append("| ").append("||||")
          .append(ordre.getCodepostalliv()).append("|").append(ordre.getLivraisonVille()).append("||55||||||||||||||||||")
          .append(ordre.getOrderNumber()).append("|").append(dateSaisie).append("||||").append(ordre.getSiteclient())
          .append(ordre.getOrderNumber()).append("|||").append(ordre.getNombrePalettes()).append("|")
          .append(ordre.getNombrePalettes()).append("|").append(ordre.getNombreColis()).append("|")
          .append(ordre.getNombrePalettes()).append("||").append( ordre.getVolume().intValue()).append("|").append(ordre.getVolume().intValue()).append("|||1||")
          .append(ordre.getCodeArticle()).append("|||||||||||").append(livraisonDate).append("|||")
          .append(chargementDate).append("||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||")
          .append(ordre.getNombrePalettes()).append("|||||||").append(comment).append("||||||||||||||||||||||||||||||||");
        sb.append(System.lineSeparator());

        // Write the file to the specified location
        Files.write(Paths.get("\\\\172.18.3.70\\tmsv14\\EDI\\AZIZA\\EDIDIVERS_"+new Date().getTime() +".txt"), sb.toString().getBytes());
    }

    private static String formatDate(Date date) {
        // Implement the date formatting logic here
        return String.format("%1$tY%1$tm%1$td%1$tH%1$tM", date);
    }
}