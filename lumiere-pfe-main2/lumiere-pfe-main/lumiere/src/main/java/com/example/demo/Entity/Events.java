package com.example.demo.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity

public class Events {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String voycle; // Clé primaire

    private String chauff;

    private String camion;

    private String nameEvent;

    private String dateSaisi;

    private int KM;

    // Getters and Setters

}