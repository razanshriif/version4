-- Seed articles
INSERT IGNORE INTO `article` (`id`, `label`, `achat`, `code_article`, `prix_unitaire`, `quantite_minimum`, `type`, `type_de_marchandise`, `type_de_remorque`, `unite`, `vente`)
VALUES
  (16, 'Marchandise Température Ambiante',    0, 'T-001', 0, 1, 'Logistique', 1, 'Standard', 'Palette', 0),
  (17, 'Marchandise Réfrigérée (0°C à 4°C)',  0, 'T-002', 0, 1, 'Logistique', 1, 'Frigo',    'Palette', 0),
  (18, 'Marchandise Surgelée (-25°C à -18°C)',0, 'T-003', 0, 1, 'Logistique', 1, 'Frigo',    'Palette', 0),
  (19, 'Marchandise Fragile',                 0, 'T-004', 0, 1, 'Logistique', 2, 'Standard', 'Colis',  0),
  (20, 'Marchandise Industrielle Lourde',     0, 'T-005', 0, 1, 'Logistique', 3, 'Plateau',  'Palette', 0),
  (21, 'Marchandise ADR (Dangereuse)',         0, 'T-006', 0, 1, 'Logistique', 4, 'ADR',      'Colis',  0);

-- Forced update for User 1 (Ensure razanshriif@gmail.com is ADMIN)
UPDATE `_user` SET `email` = 'razanshriif@gmail.com', `firstname` = 'Razan', `lastname` = 'Shriif', `passwd` = '$2a$10$0tBccA58dMgOgcaK8.Q5qugQMMrqmtF7xhVPqVI2Jobnv2c6a5HVC', `role` = 'ADMIN', `status` = 'ACTIVE' WHERE `id` = 1;
-- If user 1 didn't exist at all, INSERT it
INSERT IGNORE INTO `_user` (`id`, `email`, `firstname`, `lastname`, `passwd`, `role`, `status`) 
VALUES (1, 'razanshriif@gmail.com', 'Razan', 'Shriif', '$2a$10$0tBccA58dMgOgcaK8.Q5qugQMMrqmtF7xhVPqVI2Jobnv2c6a5HVC', 'ADMIN', 'ACTIVE');

-- Seed Famous Clients (linked to owner_id = 1)
INSERT IGNORE INTO `client` (`code`, `nom`, `client`, `adresse`, `ville`, `pays`, `email`, `telephone`, `statut`, `owner_id`, `profile_completed`, `registration_approved`, `codeclient`, `confiere`)
VALUES
  (100, 'Amazon Logistics', 'AMAZON', '1240 12th Ave S', 'Seattle', 'USA', 'contact@amazon.com', '+1-206-266-1000', 'CONFIRME', 1, 1, 1, 'AMZ-001', 1),
  (101, 'DHL International', 'DHL', 'Charles-de-Gaulle-Str. 20', 'Bonn', 'Germany', 'info@dhl.com', '+49-228-182-0', 'CONFIRME', 1, 1, 1, 'DHL-002', 1),
  (102, 'Tesla Motors', 'TESLA', '3500 Deer Creek Road', 'Palo Alto', 'USA', 'sales@tesla.com', '+1-888-518-3752', 'CONFIRME', 1, 1, 1, 'TSL-003', 1),
  (103, 'Apple Inc.', 'APPLE', 'One Apple Park Way', 'Cupertino', 'USA', 'service@apple.com', '+1-408-996-1010', 'CONFIRME', 1, 1, 1, 'APL-004', 1),
  (104, 'FedEx Ground', 'FEDEX', '942 S Shady Grove Rd', 'Memphis', 'USA', 'support@fedex.com', '+1-800-463-3339', 'CONFIRME', 1, 1, 1, 'FDX-005', 1),
  (105, 'Walmart Stores', 'WALMART', '702 SW 8th St', 'Bentonville', 'USA', 'contact@walmart.com', '+1-479-273-4000', 'CONFIRME', 1, 1, 1, 'WMT-006', 1),
  (106, 'Coca-Cola Company', 'COCACOLA', '1 Coca Cola Pl NW', 'Atlanta', 'USA', 'info@cocacola.com', '+1-404-676-2121', 'CONFIRME', 1, 1, 1, 'KO-007', 1),
  (107, 'Nestlé S.A.', 'NESTLE', 'Avenue Nestlé 55', 'Vevey', 'Switzerland', 'support@nestle.com', '+41-21-924-2111', 'CONFIRME', 1, 1, 1, 'NES-008', 1),
  (108, 'Carrefour France', 'CARREFOUR', '33 Avenue Emile Zola', 'Boulogne-Billancourt', 'France', 'contact@carrefour.fr', '+33-1-41-04-26-00', 'CONFIRME', 1, 1, 1, 'CRF-009', 1),
  (109, 'Zara (Inditex)', 'ZARA', 'Av. de la Diputación, s/n', 'Arteixo', 'Spain', 'service@zara.com', '+34-981-185-400', 'CONFIRME', 1, 1, 1, 'ZRA-010', 1);

