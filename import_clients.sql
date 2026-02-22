USE dataDivers;

-- Get the ID of the user
SET @ownerId = (SELECT id FROM _user WHERE email = 'razanshriif@gmail.com' LIMIT 1);

INSERT INTO client (code, adresse, civilite, client, code_iso, codeclient, codepostal, confiere, contact, email, fax, id_edi, id_tva, nom, numero_portable, pays, s_type, service, site_exploitation, societe_facturation, statut, telephone, type, ville, owner_id) VALUES
(2, 'GROMBALIA', 'TUN', 'AZIZA', 0, '05', 8040, 1, NULL, NULL, NULL, '0', '123', 'MAGAZIN AZIZA GROM', '72885662', 'TUN', NULL, 'MAG', 'GROM', 'AZIZA', 'CONFIRME', NULL, 'MAG', 'NABEUL', @ownerId),
(3, 'GROMBALIA', 'TUN', 'ANWAR', 0, '03', 45, 0, NULL, NULL, NULL, '0', '0', 'ANWAR', '72885662', 'TUN', NULL, 'MAG', 'GROM', 'ANWAR', 'CONFIRME', NULL, 'MAG', 'NABEUL', @ownerId),
(4, 'belli', 'TUN', 'aziza', 20025, '456', 8005, 0, NULL, NULL, NULL, '555', '475', 'aziza', '72885662', 'TUN', NULL, 'MAG', 'belli', 'aziza', 'CONFIRME', NULL, 'MAG', 'NABEUL', @ownerId),
(5, 'BAR', 'TUN', 'GIAS', 0, '499', 8005, 1, NULL, NULL, NULL, '0', '0', 'GIAS2', '72885600', 'TUN', NULL, 'GIAS', 'BAR', 'Gias2', 'CONFIRME', NULL, 'MAG', 'NABEUL', @ownerId);
