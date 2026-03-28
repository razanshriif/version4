# Rapport de Projet de Fin d'Études

## Ministère de l’Enseignement Supérieur et de la Recherche Scientifique
## Direction Générale des Études Technologiques
## Institut Supérieur des Études Technologiques de Kelibia
### Département Technologies de l’Informatique

---

**Développement d’un Système de Gestion des Ordres de Transports**

**Élaboré par :** Med Amine Ben Moussa
**Réalisé au sein de :** Lumière Transport

**Encadré par :**
- **Encadrant industriel :** M. Hakim Ben Chikh
- **Encadrant académique :** Mme Houda Toukabri

**Année universitaire :** 2025/2026

---

## Dédicace

## Remerciements
Au terme de ce Projet de Fin d’Études, je tiens à exprimer ma profonde gratitude envers toutes les personnes qui ont contribué à la réussite de ce travail.

Je remercie tout d’abord l’entreprise **Lumière Transports**, qui m’a accueillie et m’a offert l’opportunité de réaliser ce projet au sein de son environnement professionnel. Cette expérience a été très enrichissante et m’a permis de développer mes compétences techniques et organisationnelles.

J’exprime également ma profonde gratitude à mon encadrant professionnel, **Monsieur Hakim ben Chikh**, pour la confiance qu’il m’a témoignée en me confiant ce projet au sein de Lumière Logistique. Ses orientations claires et son expertise métier ont été un guide essentiel.

J’adresse aussi mes sincères remerciements à mon encadrant académique **Mme Houda Toukabri** pour ses recommandations, son encadrement méthodologique et son soutien tout au long de la réalisation de ce travail.

Enfin, je remercie toutes les personnes qui ont participé de près ou de loin à ce projet, ainsi que tous les enseignants qui m’ont formée durant mon parcours universitaire.

---

## Table des matières

## Liste des abréviations

---

## Introduction Générale
Dans un contexte économique marqué par la mondialisation, l’intensification des échanges commerciaux et la transformation numérique des entreprises, le secteur du transport et de la logistique occupe une place essentielle dans le fonctionnement des activités industrielles et commerciales. Cette évolution impose aux entreprises de transport de répondre à des exigences de plus en plus strictes, notamment en matière de réduction des coûts, de respect des délais, de traçabilité des livraisons et de satisfaction client. Face à ces contraintes, la mise en place de solutions informatiques modernes devient indispensable afin d’améliorer l’organisation interne et d’assurer une gestion efficace des opérations.

En effet, la gestion des demandes de transport ainsi que le suivi des opérations logistiques constituent des activités complexes qui nécessitent une coordination permanente entre plusieurs intervenants, ainsi qu’une disponibilité continue des informations liées aux commandes, aux ressources et à l’avancement des livraisons. Dans un environnement où les volumes de demandes augmentent et où les attentes des clients deviennent de plus en plus élevées, il devient essentiel de disposer d’un système capable d’assurer une centralisation fiable des données, une visibilité globale sur l’ensemble des processus et une communication efficace entre les acteurs concernés.

C’est dans cette perspective que s’inscrit le présent Projet de Fin d’Études, réalisé au sein de l’entreprise Lumière Transports, spécialisée dans le transport et la logistique. L’objectif principal de ce projet consiste à concevoir et développer une plateforme logicielle complète permettant la gestion et le suivi des demandes de transport soumises par des clients externes. La solution proposée repose sur le développement d’une application web destinée à l’administration et au traitement interne des demandes, ainsi que d’une application mobile dédiée aux clients externes, afin de leur offrir un accès rapide aux fonctionnalités essentielles telles que la consultation des commandes, le suivi des livraisons, la visualisation cartographique des trajets et la réception de notifications en temps réel.

La réalisation de ce projet a été conduite selon une méthodologie Agile Scrum, basée sur une organisation itérative en sprints, permettant d’assurer une progression structurée, une validation continue des fonctionnalités et une adaptation efficace aux besoins de l’entreprise. Sur le plan technique, la solution repose sur des technologies modernes, notamment Spring Boot pour le développement du backend, Angular pour l’interface web, Ionic pour l’application mobile, ainsi qu’une base de données MySQL assurant la gestion et la centralisation des données.

Enfin, une importance particulière a été accordée aux phases de tests, de sécurisation et de déploiement afin de garantir la fiabilité, la stabilité et la performance du système développé. Ce rapport présente l’ensemble des étapes réalisées, depuis l’étude préliminaire jusqu’à la mise en œuvre technique, ainsi que les résultats obtenus.

---

# Chapitre 1 : Problèmes du Transport et de la Livraison

## 1.1 Introduction
Le transport et la logistique constituent des secteurs fondamentaux dans le fonctionnement des entreprises modernes. Ils assurent la circulation des marchandises entre les fournisseurs, les plateformes de distribution et les clients finaux.

## 1.2 Situation actuelle du transport et de la logistique
### 1.2.1 Croissance de la demande et accélération des livraisons
Avec l’essor du commerce électronique, les entreprises doivent traiter un nombre croissant de demandes. Les clients attendent :
- Des livraisons rapides et précises ;
- Des informations détaillées sur l’avancement.

### 1.2.2 Complexité des opérations logistiques
Une entreprise doit gérer plusieurs paramètres simultanément :
- **La planification :** optimisation des trajets et des tournées ;
- **Les ressources :** gestion du matériel et des chauffeurs ;
- **Les contraintes :**
    - Géographiques et routières ;
    - Légales et administratives ;
- **Les imprévus :** retards, pannes, problèmes de trafic.

### 1.2.3 Importance de la traçabilité et du suivi en temps réel
Les clients souhaitent pouvoir consulter à tout moment :
- L’état de leur demande de transport ;
- L’évolution de la livraison ;
- Les informations liées aux incidents éventuels.

## 1.3 Limites des approches classiques
### 1.3.1 Absence de centralisation
- Pertes de données ;
- Difficultés de synchronisation entre services.

### 1.3.2 Manque de visibilité
- Charge de travail accrue pour les équipes internes (appels incessants) ;
- Difficulté de suivi pour l'entreprise elle-même.

### 1.3.3 Suivi en temps réel limité
Sans outils de cartographie, il est impossible de connaître :
- La position exacte des véhicules ;
- L’estimation précise du temps d’arrivée (ETA).

## 1.4 Évolution des solutions numériques
### 1.4.1 Plateformes web et mobiles
- Gestion centralisée des demandes ;
- Accessibilité simplifiée pour tous les acteurs.

### 1.4.2 Cartographie avancée
Utilisation de Google Maps pour visualiser :
- Les trajets et positions en temps réel ;
- Les zones de livraison et incidents.

## 1.5 Conclusion
La numérisation permet d'améliorer l'organisation interne et la satisfaction client.

---

# Chapitre 2 : Contexte du Projet

## 2.2 Présentation de l’organisme d’accueil
### 2.2.1 Présentation de l’entreprise
Lumière Logistique (Groupe SLAMA) :
- Création : 2012 ;
- Type : Fournisseur 3PL ;
- Spécialité : FMCG (Fast-Moving Consumer Goods) ;
- Axes fondamentaux :
    - Entreposage ;
    - Distribution.

![Logo Lumière Logistique](FIGURE_2.1)
*Figure 2.1 – Logo Lumière Logistique*

## 2.3 Présentation du projet
### 2.3.1 Problématique
- **Absence de plateforme :** pas d'espace dédié aux clients ;
- **Opérations manuelles :** données fragmentées et risques d'erreurs ;
- **Manque de réactivité :** pas d'alertes automatiques.

## 2.5 Solution proposée : Plateforme unifiée
Développement de deux interfaces clés :
1. **Application Web :** Administration et commerciaux ;
2. **Application Mobile :** Clients externes.

**Apports techniques :**
- **Saisie simplifiée :** formulaires guidés ;
- **Suivi visuel :** cartographie et statuts d'avancement ;
- **Intelligence :** intégration d'un Chatbot.

---

# Chapitre 3 : Sprint 0 – Étude Préliminaire

## 3.2 Analyse des besoins
### 3.2.1 Identification des acteurs
- **Client externe :**
    - Crée son compte ;
    - Soumet ses demandes ;
    - Suit ses livraisons ;
    - Interagit avec le chatbot.
- **Acteur commercial :**
    - Gère les demandes (validation/refus) ;
    - Met à jour les statuts.
- **Administrateur :**
    - Gestion globale (utilisateurs, rôles) ;
    - Supervision des indicateurs (KPI).

### 3.2.2 Besoins fonctionnels
#### 3.2.2.1 Authentification et Rôles
- Sécurisation JWT ;
- Distinction Client / Commercial / Admin.
#### 3.2.2.2 Gestion des opérations
- Soumission et validation des demandes ;
- Suivi cartographique via Google Maps.
#### 3.2.2.5 Application Mobile
- Accès portable aux fonctions critiques pour le client.

### 3.2.3 Besoins non-fonctionnels
- **Sécurité :** protection des données sensibles ;
- **Performance :** temps de réponse rapide des API ;
- **Disponibilité :** service 24/7.

## 3.4 Product Backlog (Priorités)
- **Haute :** Inscriptions, Auth, Demandes, Mobile App ;
- **Moyenne :** Cartographie, Incidents, Notifications ;
- **Basse :** Chatbot d'assistance.

---

# Chapitre 6 : Application Mobile Client

## 6.5 Architecture de l'Application Mobile
### 6.5.1 Structure technique
| Répertoire | Rôle |
|---|---|
| `src/app/pages/` | Vues de l'application (auth, home, map...) |
| `src/app/services/` | Logique de communication avec le backend |
| `src/app/guards/` | Protection des accès (AuthGuard) |

### 6.5.3 Navigation et routes
- **Publiques :** `/login`, `/register`, `/pending` ;
- **Privées :** `/home`, `/demandes/list`, `/livraisons/tracking`, `/map`, `/chatbot`.

## 6.6 Cas d'utilisation : Inscription PENDING (OneLink)
Le flux d'inscription est conçu pour garantir la sécurité :
1. **Soumission :** le client s'inscrit sur le mobile ;
2. **Attente :** redirection vers la page `/pending` (Statut PENDING) ;
3. **Approbation :** l'admin valide le compte sur le Web ;
4. **Activation :** envoi d'un email avec un **OneLink** sécurisé ;
5. **Accès :** le compte passe à ACTIVE, le client peut se connecter.

---

# Conclusion Générale
La plateforme répond au besoin de modernisation de Lumière Transports en centralisant les flux et en offrant une expérience mobile moderne aux clients.
**Perspectives :** Optimisation du Chatbot via NLP et version iOS.
