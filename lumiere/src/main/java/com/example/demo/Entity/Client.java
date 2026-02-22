package com.example.demo.Entity;

import com.example.demo.securityjwt.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class Client {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long code;

	@ManyToOne
	@JoinColumn(name = "owner_id")
	private User owner;
	private String codeclient;
	private String civilite;
	private String type;
	private String statut;
	private String sType;
	private boolean confiere;
	private String societeFacturation;
	private String siteExploitation;
	private String service;

	// Adresse de facturation
	private String nom;
	private String adresse;
	private String ville;
	private String pays;
	private Integer codepostal;
	// Mode de règlement
	private String client;

	private String idEdi;
	private String idTva;
	private Long codeIso;
	private String contact;
	private String numeroPortable;
	private String telephone;
	private String fax;
	private String email;

	public Long getCode() {
		return code;
	}

	public void setCode(Long code) {
		this.code = code;
	}

	public String getCodeclient() {
		return codeclient;
	}

	public void setCodeclient(String codeclient) {
		this.codeclient = codeclient;
	}

	public String getCivilite() {
		return civilite;
	}

	public void setCivilite(String civilite) {
		this.civilite = civilite;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getStatut() {
		return statut;
	}

	public void setStatut(String statut) {
		this.statut = statut;
	}

	public String getsType() {
		return sType;
	}

	public void setsType(String sType) {
		this.sType = sType;
	}

	public boolean isConfiere() {
		return confiere;
	}

	public void setConfiere(boolean confiere) {
		this.confiere = confiere;
	}

	public String getSocieteFacturation() {
		return societeFacturation;
	}

	public void setSocieteFacturation(String societeFacturation) {
		this.societeFacturation = societeFacturation;
	}

	public String getSiteExploitation() {
		return siteExploitation;
	}

	public void setSiteExploitation(String siteExploitation) {
		this.siteExploitation = siteExploitation;
	}

	public String getService() {
		return service;
	}

	public void setService(String service) {
		this.service = service;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getAdresse() {
		return adresse;
	}

	public void setAdresse(String adresse) {
		this.adresse = adresse;
	}

	public String getVille() {
		return ville;
	}

	public void setVille(String ville) {
		this.ville = ville;
	}

	public String getPays() {
		return pays;
	}

	public void setPays(String pays) {
		this.pays = pays;
	}

	public Integer getCodepostal() {
		return codepostal;
	}

	public void setCodepostal(Integer codepostal) {
		this.codepostal = codepostal;
	}

	public String getClient() {
		return client;
	}

	public void setClient(String client) {
		this.client = client;
	}

	public String getIdEdi() {
		return idEdi;
	}

	public void setIdEdi(String idEdi) {
		this.idEdi = idEdi;
	}

	public String getIdTva() {
		return idTva;
	}

	public void setIdTva(String idTva) {
		this.idTva = idTva;
	}

	public Long getCodeIso() {
		return codeIso;
	}

	public void setCodeIso(Long codeIso) {
		this.codeIso = codeIso;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public String getNumeroPortable() {
		return numeroPortable;
	}

	public void setNumeroPortable(String numeroPortable) {
		this.numeroPortable = numeroPortable;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public String getFax() {
		return fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

}
