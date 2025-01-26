-- Voeg dummy loodgieters toe
INSERT INTO plumbers (id, company_name, contact_person, email, phone, address, city, postal_code, kvk_number, description, credits, subscription_type, subscription_end_date)
VALUES
  ('1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 'Loodgietersbedrijf Van der Leiding', 'Jan van der Leiding', 'jan@vanderleiding.nl', '0612345678', 'Pijpstraat 1', 'Amsterdam', '1234 AB', '12345678', 'Specialist in lekdetectie en ontstopping', 100, 'premium', '2024-12-31'),
  ('2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q', 'De Snelle Ontstopper', 'Petra de Vries', 'petra@snelleonstopper.nl', '0687654321', 'Afvoerweg 10', 'Rotterdam', '3000 XY', '87654321', '24/7 beschikbaar voor spoedklussen', 50, 'standard', '2024-06-30'),
  ('3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r', 'Eco Loodgieters', 'Mohammed El Amrani', 'info@ecoloodgieters.nl', '0698765432', 'Duurzaamlaan 5', 'Utrecht', '4321 CD', '56789012', 'Gespecialiseerd in duurzame oplossingen', 75, 'premium', '2024-12-31'),
  ('4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s', 'Badkamer Experts', 'Sophie Jansen', 'sophie@badkamerexperts.nl', '0623456789', 'Tegelplein 8', 'Eindhoven', '5678 EF', '34567890', 'Complete badkamer renovaties', 25, 'standard', '2024-09-30'),
  ('5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t', 'CV Ketel Meesters', 'Bram de Boer', 'bram@cvketelmeesters.nl', '0634567890', 'Warmtelaan 15', 'Groningen', '9876 GH', '45678901', 'Specialist in CV-ketel onderhoud en installatie', 60, 'premium', '2024-12-31');

-- Voeg dummy offertes toe
INSERT INTO quotes (id, customer_name, email, phone, address, city, postal_code, service_type, description, preferred_date, urgency, status, created_at, assigned_plumber_id)
VALUES
  ('a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', 'Alice Bakker', 'alice@email.com', '0611111111', 'Lekkagestraat 1', 'Amsterdam', '1111 AA', 'Lekkage reparatie', 'Lekkage onder de gootsteen in de keuken', '2023-06-15', 'high', 'pending', '2023-06-10 09:00:00', NULL),
  ('b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7', 'Bob Visser', 'bob@email.com', '0622222222', 'Verstoptweg 5', 'Rotterdam', '2222 BB', 'Ontstopping', 'Verstopte afvoer in de badkamer', '2023-06-12', 'urgent', 'assigned', '2023-06-11 10:30:00', '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q'),
  ('c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8', 'Charlie de Groot', 'charlie@email.com', '0633333333', 'Renovatielaan 10', 'Utrecht', '3333 CC', 'Badkamer renovatie', 'Volledige renovatie van een oude badkamer', '2023-07-01', 'low', 'pending', '2023-06-09 14:15:00', NULL),
  ('d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9', 'Diana Janssen', 'diana@email.com', '0644444444', 'Ketelweg 8', 'Eindhoven', '4444 DD', 'CV ketel onderhoud', 'Jaarlijks onderhoud van CV ketel', '2023-06-20', 'normal', 'completed', '2023-06-08 11:45:00', '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t'),
  ('e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', 'Erik Meijer', 'erik@email.com', '0655555555', 'Lekstraat 3', 'Groningen', '5555 EE', 'Lekkage reparatie', 'Lekkage in het dak', '2023-06-13', 'urgent', 'in_progress', '2023-06-12 08:00:00', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'),
  ('f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1', 'Fiona Peters', 'fiona@email.com', '0666666666', 'Duurzaamplein 12', 'Amsterdam', '6666 FF', 'Duurzame installatie', 'Installatie van een zonneboiler', '2023-06-25', 'normal', 'pending', '2023-06-11 16:20:00', NULL),
  ('g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2', 'Gerard de Vries', 'gerard@email.com', '0677777777', 'Gootweg 7', 'Rotterdam', '7777 GG', 'Dakgoot reparatie', 'Lekkende dakgoot aan de voorzijde van het huis', '2023-06-18', 'high', 'assigned', '2023-06-13 13:10:00', '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r'),
  ('h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3', 'Hannah Smit', 'hannah@email.com', '0688888888', 'Toiletstraat 9', 'Utrecht', '8888 HH', 'Toilet installatie', 'Installatie van een nieuw toilet', '2023-06-30', 'low', 'pending', '2023-06-10 09:45:00', NULL),
  ('i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4', 'Iris van Dijk', 'iris@email.com', '0699999999', 'Warmtelaan 11', 'Eindhoven', '9999 II', 'Vloerverwarming', 'Aanleg van vloerverwarming in de woonkamer', '2023-07-05', 'normal', 'pending', '2023-06-12 11:30:00', NULL),
  ('j0k1l2m3-n4o5-p6q7-r8s9-t0u1v2w3x4y5', 'Jeroen Bakker', 'jeroen@email.com', '0610101010', 'Leidingweg 6', 'Groningen', '1010 JJ', 'Leidingwerk', 'Vernieuwen van oude waterleidingen', '2023-06-22', 'high', 'in_progress', '2023-06-13 15:00:00', '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s');

