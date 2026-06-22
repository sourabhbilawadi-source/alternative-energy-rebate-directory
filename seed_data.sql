-- seed_data.sql
-- Run these statements in the Supabase SQL Editor to populate your tables for testing

-- Clear existing data if you want to re-seed
TRUNCATE public.rebates CASCADE;
TRUNCATE public.regions CASCADE;

-- 1. Insert mock regions (corresponds to dynamic route parameters, including energy profiles)
INSERT INTO public.regions (id, country_code, state_province, city, postal_code, grid_rate, sun_hours, grid_emissions, cost_per_watt) 
VALUES
  (1, 'us', 'California', 'Los Angeles', '90210', 0.28, 1800, 0.52, 3.10),
  (2, 'us', 'Texas', 'Houston', '77001', 0.14, 1950, 0.82, 2.70),
  (3, 'us', 'New York', 'New York City', '10001', 0.23, 1250, 0.66, 3.25),
  (4, 'gb', 'England', 'London', 'EC1A', 0.22, 1050, 0.40, 3.40),
  (5, 'de', 'Berlin', 'Berlin', '10115', 0.38, 1100, 0.70, 2.90),
  (6, 'au', 'New South Wales', 'Sydney', '2000', 0.26, 2100, 0.75, 1.80),
  (7, 'ca', 'Ontario', 'Toronto', 'M5V', 0.16, 1300, 0.12, 2.80);

-- Restart identity sequences
ALTER TABLE public.regions ALTER COLUMN id RESTART WITH 8;

-- 2. Insert mock rebates for Los Angeles, California (region_id = 1)
-- Matches: /en-us/directory/us/california/los-angeles
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (1, 'Federal Solar Tax Credit', 'Federal Tax Incentive', 30, 'percentage', NULL, true),
  (1, 'California SGIP Battery Rebate', 'Battery Storage Program', 2000, 'fixed', 5000, true),
  (1, 'LADWP Solar Net Incentive', 'Local Utility Rebate', 0.50, 'per_watt', 1500, true);

-- 3. Insert mock rebates for Houston, Texas (region_id = 2)
-- Matches: /en-us/directory/us/texas/houston
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (2, 'Federal Solar Tax Credit', 'Federal Tax Incentive', 30, 'percentage', NULL, true),
  (2, 'CenterPoint Energy Solar Rebate', 'Local Utility Rebate', 0.75, 'per_watt', 2500, true);

-- 4. Insert mock rebates for New York City, NY (region_id = 3)
-- Matches: /en-us/directory/us/new-york/new-york-city
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (3, 'Federal Solar Tax Credit', 'Federal Tax Incentive', 30, 'percentage', NULL, true),
  (3, 'NYSERDA Megawatt Block Incentive', 'State Solar Rebate', 0.20, 'per_watt', 2000, true),
  (3, 'NYC Solar Property Tax Abatement', 'Property Tax Offset', 8.75, 'percentage', 5000, true);

-- 5. Insert mock rebates for London, UK (region_id = 4)
-- Matches: /en-us/directory/uk/england/london
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (4, 'UK Smart Export Guarantee (SEG)', 'National Feed-in Tariff', 0.05, 'per_watt', NULL, true),
  (4, 'Boiler Upgrade Scheme Grant', 'Heat Pump Subsidy', 7500, 'fixed', 7500, true);

-- 6. Insert mock rebates for Berlin, Germany (region_id = 5)
-- Matches: /en-us/directory/de/berlin/berlin
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (5, 'German EEG Solar Feed-in Tariff', 'National Feed-in Tariff', 0.08, 'per_watt', NULL, true),
  (5, 'Berlin Solarplus Battery Grant', 'State Storage Incentive', 1500, 'fixed', 3000, true);

-- 7. Insert mock rebates for Sydney, Australia (region_id = 6)
-- Matches: /en-us/directory/au/new-south-wales/sydney
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (6, 'Australian Small-scale Tech Certificate (STC)', 'Federal Rebate Scheme', 0.65, 'per_watt', 3000, true),
  (6, 'NSW Peak Demand Reduction Battery Rebate', 'State Storage Program', 1600, 'fixed', 2400, true);

-- 8. Insert mock rebates for Toronto, Canada (region_id = 7)
-- Matches: /en-us/directory/ca/ontario/toronto
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (7, 'Canada Greener Homes Grant', 'Federal Clean Energy Grant', 5000, 'fixed', 5000, true),
  (7, 'Toronto Home Energy Loan Program (HELP)', 'Clean Energy Loan', 2.0, 'percentage', NULL, true);
