-- seed_data.sql
-- Run these statements in the Supabase SQL Editor to populate your tables for testing

-- 1. Insert mock regions (corresponds to dynamic route parameters)
INSERT INTO public.regions (country_code, state_province, city, postal_code) 
VALUES
  ('us', 'California', 'Los Angeles', '90210'),
  ('us', 'Texas', 'Houston', '77001'),
  ('gb', 'England', 'London', 'EC1A');

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

-- 4. Insert mock rebates for London, UK (region_id = 3)
-- Matches: /en-us/directory/uk/england/london
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (3, 'UK Smart Export Guarantee (SEG)', 'National Feed-in Tariff', 0.05, 'per_watt', NULL, true),
  (3, 'Boiler Upgrade Scheme Grant', 'Heat Pump Subsidy', 7500, 'fixed', 7500, true);
