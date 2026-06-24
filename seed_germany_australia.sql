-- seed_germany_australia.sql
-- Database migration script to register Germany and Australia regions/rebates

-- 1. Insert new regions
INSERT INTO public.regions (id, country_code, state_province, city, postal_code, grid_rate, sun_hours, grid_emissions, cost_per_watt)
VALUES
  (55, 'de', 'North Rhine-Westphalia', 'Düsseldorf', '40210', 0.36, 1100, 0.38, 2.80),
  (56, 'au', 'Northern Territory', 'Darwin', '0800', 0.26, 2400, 0.70, 1.80)
ON CONFLICT (id) DO UPDATE SET
  grid_rate = EXCLUDED.grid_rate,
  sun_hours = EXCLUDED.sun_hours,
  grid_emissions = EXCLUDED.grid_emissions,
  cost_per_watt = EXCLUDED.cost_per_watt;

-- Reset identity sequence to 57 to prevent conflicts
ALTER TABLE public.regions ALTER COLUMN id RESTART WITH 57;

-- 2. Clear existing rebates for all 16 German and Australian regions to ensure clean seeding
DELETE FROM public.rebates 
WHERE region_id IN (
  5,  -- Berlin
  16, -- Munich
  50, -- Hamburg
  51, -- Frankfurt
  52, -- Cologne
  53, -- Stuttgart
  54, -- Leipzig
  55, -- Düsseldorf
  6,  -- Sydney
  18, -- Melbourne
  45, -- Brisbane
  46, -- Perth
  47, -- Adelaide
  48, -- Canberra
  49, -- Hobart
  56  -- Darwin
);

-- 3. Insert researched rebates for GERMANY (Regions 5, 16, 50, 51, 52, 53, 54, 55)
-- National-level programs apply across all German cities
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active)
VALUES
  -- Berlin (5)
  (5, 'EEG Feed-in Tariff (€0.0786/kWh partial export)', 'National Feed-in Tariff', 0.0786, 'per_watt', NULL, true),
  (5, '0% VAT Exemption (§12 Abs. 3 UStG)', 'Tax Exemption', 19, 'percentage', NULL, true),
  (5, 'KfW 270 Low-Interest Solar Loan (~3.27% APR)', 'Clean Energy Loan', 0, 'fixed', NULL, true),
  (5, 'KfW 442 Solar & Battery Grant', 'Battery Storage Grant', 3200, 'fixed', 3200, true),
  
  -- Munich (16)
  (16, 'EEG Feed-in Tariff (€0.0786/kWh partial export)', 'National Feed-in Tariff', 0.0786, 'per_watt', NULL, true),
  (16, '0% VAT Exemption (§12 Abs. 3 UStG)', 'Tax Exemption', 19, 'percentage', NULL, true),
  (16, 'KfW 270 Low-Interest Solar Loan (~3.27% APR)', 'Clean Energy Loan', 0, 'fixed', NULL, true),
  (16, 'KfW 442 Solar & Battery Grant', 'Battery Storage Grant', 3200, 'fixed', 3200, true),
  
  -- Hamburg (50)
  (50, 'EEG Feed-in Tariff (€0.0786/kWh partial export)', 'National Feed-in Tariff', 0.0786, 'per_watt', NULL, true),
  (50, '0% VAT Exemption (§12 Abs. 3 UStG)', 'Tax Exemption', 19, 'percentage', NULL, true),
  (50, 'KfW 270 Low-Interest Solar Loan (~3.27% APR)', 'Clean Energy Loan', 0, 'fixed', NULL, true),
  (50, 'KfW 442 Solar & Battery Grant', 'Battery Storage Grant', 3200, 'fixed', 3200, true),
  
  -- Frankfurt (51)
  (51, 'EEG Feed-in Tariff (€0.0786/kWh partial export)', 'National Feed-in Tariff', 0.0786, 'per_watt', NULL, true),
  (51, '0% VAT Exemption (§12 Abs. 3 UStG)', 'Tax Exemption', 19, 'percentage', NULL, true),
  (51, 'KfW 270 Low-Interest Solar Loan (~3.27% APR)', 'Clean Energy Loan', 0, 'fixed', NULL, true),
  (51, 'KfW 442 Solar & Battery Grant', 'Battery Storage Grant', 3200, 'fixed', 3200, true),
  
  -- Cologne (52)
  (52, 'EEG Feed-in Tariff (€0.0786/kWh partial export)', 'National Feed-in Tariff', 0.0786, 'per_watt', NULL, true),
  (52, '0% VAT Exemption (§12 Abs. 3 UStG)', 'Tax Exemption', 19, 'percentage', NULL, true),
  (52, 'KfW 270 Low-Interest Solar Loan (~3.27% APR)', 'Clean Energy Loan', 0, 'fixed', NULL, true),
  (52, 'KfW 442 Solar & Battery Grant', 'Battery Storage Grant', 3200, 'fixed', 3200, true),
  
  -- Stuttgart (53)
  (53, 'EEG Feed-in Tariff (€0.0786/kWh partial export)', 'National Feed-in Tariff', 0.0786, 'per_watt', NULL, true),
  (53, '0% VAT Exemption (§12 Abs. 3 UStG)', 'Tax Exemption', 19, 'percentage', NULL, true),
  (53, 'KfW 270 Low-Interest Solar Loan (~3.27% APR)', 'Clean Energy Loan', 0, 'fixed', NULL, true),
  (53, 'KfW 442 Solar & Battery Grant', 'Battery Storage Grant', 3200, 'fixed', 3200, true),
  
  -- Leipzig (54)
  (54, 'EEG Feed-in Tariff (€0.0786/kWh partial export)', 'National Feed-in Tariff', 0.0786, 'per_watt', NULL, true),
  (54, '0% VAT Exemption (§12 Abs. 3 UStG)', 'Tax Exemption', 19, 'percentage', NULL, true),
  (54, 'KfW 270 Low-Interest Solar Loan (~3.27% APR)', 'Clean Energy Loan', 0, 'fixed', NULL, true),
  (54, 'KfW 442 Solar & Battery Grant', 'Battery Storage Grant', 3200, 'fixed', 3200, true),
  
  -- Düsseldorf (55)
  (55, 'EEG Feed-in Tariff (€0.0786/kWh partial export)', 'National Feed-in Tariff', 0.0786, 'per_watt', NULL, true),
  (55, '0% VAT Exemption (§12 Abs. 3 UStG)', 'Tax Exemption', 19, 'percentage', NULL, true),
  (55, 'KfW 270 Low-Interest Solar Loan (~3.27% APR)', 'Clean Energy Loan', 0, 'fixed', NULL, true),
  (55, 'KfW 442 Solar & Battery Grant', 'Battery Storage Grant', 3200, 'fixed', 3200, true);

-- 4. Insert researched rebates for AUSTRALIA (Regions 6, 18, 45, 46, 47, 48, 49, 56)
-- Federal incentives apply across all cities, plus state-specific ones
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active)
VALUES
  -- Sydney, NSW (6)
  (6, 'Small-scale Technology Certificates (STC Scheme)', 'Federal Rebate Scheme', 4000, 'fixed', 4000, true),
  (6, 'Cheaper Home Batteries Program (CHBP)', 'Federal Storage Program', 30, 'percentage', NULL, true),
  (6, 'Empowering Homes Subsidised Battery Loan', 'State Storage Program', 0, 'fixed', NULL, true),
  (6, 'NSW Peak Demand Reduction VPP Rebate', 'State Storage Program', 1600, 'fixed', 2400, true),

  -- Melbourne, VIC (18)
  (18, 'Small-scale Technology Certificates (STC Scheme)', 'Federal Rebate Scheme', 4000, 'fixed', 4000, true),
  (18, 'Cheaper Home Batteries Program (CHBP)', 'Federal Storage Program', 30, 'percentage', NULL, true),
  (18, 'Solar Victoria Rebate (50% up to $1400, Income-tested)', 'State Clean Energy Grant', 1400, 'fixed', 1400, true),

  -- Brisbane, QLD (45) - Federal only
  (45, 'Small-scale Technology Certificates (STC Scheme)', 'Federal Rebate Scheme', 4000, 'fixed', 4000, true),
  (45, 'Cheaper Home Batteries Program (CHBP)', 'Federal Storage Program', 30, 'percentage', NULL, true),

  -- Perth, WA (46)
  (46, 'Small-scale Technology Certificates (STC Scheme)', 'Federal Rebate Scheme', 4000, 'fixed', 4000, true),
  (46, 'Cheaper Home Batteries Program (CHBP)', 'Federal Storage Program', 30, 'percentage', NULL, true),
  (46, 'WA Residential Solar Battery Rebate', 'State Storage Program', 1000, 'fixed', 1000, true),
  (46, 'Synergy DEBS Feed-in Tariff (2.25c/kWh, 3pm-9pm)', 'Local Feed-in Tariff', 0.0225, 'per_watt', NULL, true),

  -- Adelaide, SA (47) - Federal only
  (47, 'Small-scale Technology Certificates (STC Scheme)', 'Federal Rebate Scheme', 4000, 'fixed', 4000, true),
  (47, 'Cheaper Home Batteries Program (CHBP)', 'Federal Storage Program', 30, 'percentage', NULL, true),

  -- Canberra, ACT (48)
  (48, 'Small-scale Technology Certificates (STC Scheme)', 'Federal Rebate Scheme', 4000, 'fixed', 4000, true),
  (48, 'Cheaper Home Batteries Program (CHBP)', 'Federal Storage Program', 30, 'percentage', NULL, true),
  (48, 'ACT Sustainable Household Interest-Free Loan', 'Clean Energy Loan', 0, 'fixed', NULL, true),

  -- Hobart, TAS (49) - Federal only (Zone 4)
  (49, 'Small-scale Technology Certificates (STC Scheme)', 'Federal Rebate Scheme', 4000, 'fixed', 4000, true),
  (49, 'Cheaper Home Batteries Program (CHBP)', 'Federal Storage Program', 30, 'percentage', NULL, true),

  -- Darwin, NT (56) - Federal only (Zone 1)
  (56, 'Small-scale Technology Certificates (STC Scheme)', 'Federal Rebate Scheme', 4000, 'fixed', 4000, true),
  (56, 'Cheaper Home Batteries Program (CHBP)', 'Federal Storage Program', 30, 'percentage', NULL, true);
