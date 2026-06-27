-- seed_expansion_v2.sql
-- Run these statements in the Supabase SQL Editor to expand city/region coverage across US, UK, DE, AU, CA.

-- Insert 36 new regions with placeholder values (clearly flagged as unverified regional estimates)
INSERT INTO public.regions (id, country_code, state_province, city, postal_code, grid_rate, sun_hours, grid_emissions, cost_per_watt)
VALUES
  -- United States (us)
  (19, 'us', 'Georgia', 'Atlanta', '30301', 0.18, 1450, 0.36, 3.00),
  (20, 'us', 'Pennsylvania', 'Philadelphia', '19101', 0.18, 1450, 0.36, 3.00),
  (21, 'us', 'Pennsylvania', 'Pittsburgh', '15201', 0.18, 1450, 0.36, 3.00),
  (22, 'us', 'Texas', 'Dallas', '75201', 0.18, 1450, 0.36, 3.00),
  (23, 'us', 'Texas', 'Austin', '78701', 0.18, 1450, 0.36, 3.00),
  (24, 'us', 'California', 'San Diego', '92101', 0.18, 1450, 0.36, 3.00),
  (25, 'us', 'Nevada', 'Las Vegas', '89101', 0.18, 1450, 0.36, 3.00),
  (26, 'us', 'Florida', 'Orlando', '32801', 0.18, 1450, 0.36, 3.00),
  (27, 'us', 'North Carolina', 'Charlotte', '28201', 0.18, 1450, 0.36, 3.00),
  (28, 'us', 'Tennessee', 'Nashville', '37201', 0.18, 1450, 0.36, 3.00),
  (29, 'us', 'Ohio', 'Columbus', '43201', 0.18, 1450, 0.36, 3.00),
  (30, 'us', 'Michigan', 'Detroit', '48201', 0.18, 1450, 0.36, 3.00),
  (31, 'us', 'Minnesota', 'Minneapolis', '55401', 0.18, 1450, 0.36, 3.00),
  (32, 'us', 'Oregon', 'Portland', '97201', 0.18, 1450, 0.36, 3.00),
  (33, 'us', 'Hawaii', 'Honolulu', '96801', 0.18, 1450, 0.36, 3.00),
  (34, 'us', 'Maryland', 'Baltimore', '21201', 0.18, 1450, 0.36, 3.00),

  -- United Kingdom (gb)
  (35, 'gb', 'England', 'Birmingham', 'B1', 0.30, 1050, 0.15, 3.20),
  (36, 'gb', 'England', 'Manchester', 'M1', 0.30, 1050, 0.15, 3.20),
  (37, 'gb', 'Scotland', 'Glasgow', 'G1', 0.30, 1050, 0.15, 3.20),
  (38, 'gb', 'Wales', 'Cardiff', 'CF10', 0.30, 1050, 0.15, 3.20),
  (39, 'gb', 'Northern Ireland', 'Belfast', 'BT1', 0.30, 1050, 0.15, 3.20),

  -- Canada (ca)
  (40, 'ca', 'Quebec', 'Montreal', 'H2Y', 0.14, 1200, 0.12, 2.70),
  (41, 'ca', 'Alberta', 'Calgary', 'T2P', 0.14, 1200, 0.12, 2.70),
  (42, 'ca', 'Alberta', 'Edmonton', 'T5J', 0.14, 1200, 0.12, 2.70),
  (43, 'ca', 'Ontario', 'Ottawa', 'K1P', 0.14, 1200, 0.12, 2.70),
  (44, 'ca', 'Manitoba', 'Winnipeg', 'R3C', 0.14, 1200, 0.12, 2.70),

  -- Australia (au)
  (45, 'au', 'Queensland', 'Brisbane', '4000', 0.25, 1850, 0.68, 1.90),
  (46, 'au', 'Western Australia', 'Perth', '6000', 0.25, 1850, 0.68, 1.90),
  (47, 'au', 'South Australia', 'Adelaide', '5000', 0.25, 1850, 0.68, 1.90),
  (48, 'au', 'Australian Capital Territory', 'Canberra', '2600', 0.25, 1850, 0.68, 1.90),
  (49, 'au', 'Tasmania', 'Hobart', '7000', 0.25, 1850, 0.68, 1.90),

  -- Germany (de)
  (50, 'de', 'Hamburg', 'Hamburg', '20095', 0.36, 1100, 0.38, 2.80),
  (51, 'de', 'Hesse', 'Frankfurt', '60311', 0.36, 1100, 0.38, 2.80),
  (52, 'de', 'North Rhine-Westphalia', 'Cologne', '50667', 0.36, 1100, 0.38, 2.80),
  (53, 'de', 'Baden-Württemberg', 'Stuttgart', '70173', 0.36, 1100, 0.38, 2.80),
  (54, 'de', 'Saxony', 'Leipzig', '04109', 0.36, 1100, 0.38, 2.80)
ON CONFLICT (id) DO UPDATE SET
  country_code = EXCLUDED.country_code,
  state_province = EXCLUDED.state_province,
  city = EXCLUDED.city,
  postal_code = EXCLUDED.postal_code,
  grid_rate = EXCLUDED.grid_rate,
  sun_hours = EXCLUDED.sun_hours,
  grid_emissions = EXCLUDED.grid_emissions,
  cost_per_watt = EXCLUDED.cost_per_watt;

-- Restart regions identity sequence to 55 for future inserts
ALTER TABLE public.regions ALTER COLUMN id RESTART WITH 55;
