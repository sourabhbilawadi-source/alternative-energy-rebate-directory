-- seed_data.sql
-- Run these statements in the Supabase SQL Editor to populate your tables for testing

-- Clear existing data if you want to re-seed
TRUNCATE public.rebates CASCADE;
TRUNCATE public.regions CASCADE;

-- 1. Insert mock regions (corresponds to dynamic route parameters, including energy profiles)
INSERT INTO public.regions (id, country_code, state_province, city, postal_code, grid_rate, sun_hours, grid_emissions, cost_per_watt) 
VALUES
  -- Existing Cities
  (1, 'us', 'California', 'Los Angeles', '90210', 0.28, 1800, 0.52, 3.10),
  (2, 'us', 'Texas', 'Houston', '77001', 0.14, 1950, 0.82, 2.70),
  (3, 'us', 'New York', 'New York City', '10001', 0.23, 1250, 0.66, 3.25),
  (4, 'gb', 'England', 'London', 'EC1A', 0.22, 1050, 0.40, 3.40),
  (5, 'de', 'Berlin', 'Berlin', '10115', 0.38, 1100, 0.70, 2.90),
  (6, 'au', 'New South Wales', 'Sydney', '2000', 0.26, 2100, 0.75, 1.80),
  (7, 'ca', 'Ontario', 'Toronto', 'M5V', 0.16, 1300, 0.12, 2.80),
  
  -- New Cities (Expanding Database Reach)
  (8, 'us', 'Illinois', 'Chicago', '60601', 0.17, 1350, 0.68, 3.00),
  (9, 'us', 'Arizona', 'Phoenix', '85001', 0.15, 2100, 0.72, 2.60),
  (10, 'us', 'Florida', 'Miami', '33101', 0.14, 1900, 0.58, 2.85),
  (11, 'us', 'Washington', 'Seattle', '98101', 0.11, 1000, 0.08, 3.30),
  (12, 'us', 'Massachusetts', 'Boston', '02108', 0.29, 1200, 0.62, 3.50),
  (13, 'us', 'California', 'San Francisco', '94101', 0.34, 1600, 0.48, 3.40),
  (14, 'us', 'Colorado', 'Denver', '80201', 0.16, 1750, 0.78, 2.95),
  (15, 'gb', 'Scotland', 'Edinburgh', 'EH1', 0.24, 950, 0.38, 3.30),
  (16, 'de', 'Bavaria', 'Munich', '80331', 0.37, 1250, 0.68, 3.00),
  (17, 'ca', 'British Columbia', 'Vancouver', 'V6B', 0.13, 1150, 0.05, 3.10),
  (18, 'au', 'Victoria', 'Melbourne', '3000', 0.28, 1850, 0.88, 1.90);

-- Restart identity sequences
ALTER TABLE public.regions ALTER COLUMN id RESTART WITH 19;

-- 2. Insert mock rebates for Los Angeles, California (region_id = 1)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (1, 'Federal Solar Tax Credit', 'Federal Tax Incentive', 30, 'percentage', NULL, true),
  (1, 'California SGIP Battery Rebate', 'Battery Storage Program', 2000, 'fixed', 5000, true),
  (1, 'LADWP Solar Net Incentive', 'Local Utility Rebate', 0.50, 'per_watt', 1500, true);

-- 3. Insert mock rebates for Houston, Texas (region_id = 2)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (2, 'Federal Solar Tax Credit', 'Federal Tax Incentive', 30, 'percentage', NULL, true),
  (2, 'CenterPoint Energy Solar Rebate', 'Local Utility Rebate', 0.75, 'per_watt', 2500, true);

-- 4. Insert mock rebates for New York City, NY (region_id = 3)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (3, 'Federal Solar Tax Credit', 'Federal Tax Incentive', 30, 'percentage', NULL, true),
  (3, 'NYSERDA Megawatt Block Incentive', 'State Solar Rebate', 0.20, 'per_watt', 2000, true),
  (3, 'NYC Solar Property Tax Abatement', 'Property Tax Offset', 8.75, 'percentage', 5000, true);

-- 5. Insert mock rebates for London, UK (region_id = 4)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (4, 'UK Smart Export Guarantee (SEG)', 'National Feed-in Tariff', 0.05, 'per_watt', NULL, true),
  (4, 'Boiler Upgrade Scheme Grant', 'Heat Pump Subsidy', 7500, 'fixed', 7500, true);

-- 6. Insert mock rebates for Berlin, Germany (region_id = 5)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (5, 'German EEG Solar Feed-in Tariff', 'National Feed-in Tariff', 0.08, 'per_watt', NULL, true),
  (5, 'Berlin Solarplus Battery Grant', 'State Storage Incentive', 1500, 'fixed', 3000, true);

-- 7. Insert mock rebates for Sydney, Australia (region_id = 6)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (6, 'Australian Small-scale Tech Certificate (STC)', 'Federal Rebate Scheme', 0.65, 'per_watt', 3000, true),
  (6, 'NSW Peak Demand Reduction Battery Rebate', 'State Storage Program', 1600, 'fixed', 2400, true);

-- 8. Insert mock rebates for Toronto, Canada (region_id = 7)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (7, 'Canada Greener Homes Grant', 'Federal Clean Energy Grant', 5000, 'fixed', 5000, true),
  (7, 'Toronto Home Energy Loan Program (HELP)', 'Clean Energy Loan', 2.0, 'percentage', NULL, true);

-- 9. Insert mock rebates for Chicago, Illinois (region_id = 8)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (8, 'Federal Solar Tax Credit', 'Federal Tax Incentive', 30, 'percentage', NULL, true),
  (8, 'Illinois Shines Solar Block Program', 'State Solar Credit', 0.80, 'per_watt', 3000, true),
  (8, 'ComEd Smart Battery Storage Incentive', 'Local Utility Rebate', 1500, 'fixed', 3000, true);

-- 10. Insert mock rebates for Phoenix, Arizona (region_id = 9)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (9, 'Federal Solar Tax Credit', 'Federal Tax Incentive', 30, 'percentage', NULL, true),
  (9, 'Arizona Residential Solar Credit', 'State Tax Incentive', 1000, 'fixed', 1000, true),
  (9, 'SRP Residential Battery Storage program', 'Local Utility Rebate', 1800, 'fixed', 3600, true);

-- 11. Insert mock rebates for Miami, Florida (region_id = 10)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (10, 'Federal Solar Tax Credit', 'Federal Tax Incentive', 30, 'percentage', NULL, true),
  (10, 'Florida Solar Property Tax Exemption', 'Property Tax Offset', 100, 'percentage', NULL, true),
  (10, 'FPL Battery Peak Rewards', 'Local Utility Rebate', 1200, 'fixed', 2400, true);

-- 12. Insert mock rebates for Seattle, Washington (region_id = 11)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (11, 'Federal Solar Tax Credit', 'Federal Tax Incentive', 30, 'percentage', NULL, true),
  (11, 'Seattle City Light Heat Pump Rebate', 'Local Utility Rebate', 2000, 'fixed', 2000, true),
  (11, 'Washington Solar Sales Tax Exemption', 'Sales Tax Incentive', 6.5, 'percentage', NULL, true);

-- 13. Insert mock rebates for Boston, Massachusetts (region_id = 12)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (12, 'Federal Solar Tax Credit', 'Federal Tax Incentive', 30, 'percentage', NULL, true),
  (12, 'Mass Save Residential Heat Pump Rebate', 'State Clean Energy Grant', 10000, 'fixed', 10000, true),
  (12, 'Massachusetts ConnectedSolutions Storage', 'Battery Storage Program', 2500, 'fixed', 5000, true);

-- 14. Insert mock rebates for San Francisco, California (region_id = 13)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (13, 'Federal Solar Tax Credit', 'Federal Tax Incentive', 30, 'percentage', NULL, true),
  (13, 'California SGIP Battery Rebate', 'Battery Storage Program', 2000, 'fixed', 5000, true),
  (13, 'PG&E NEM 3.0 Storage Incentive', 'Local Utility Rebate', 0.15, 'per_watt', 1500, true);

-- 15. Insert mock rebates for Denver, Colorado (region_id = 14)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (14, 'Federal Solar Tax Credit', 'Federal Tax Incentive', 30, 'percentage', NULL, true),
  (14, 'Colorado Residential Solar Credit', 'State Tax Incentive', 10, 'percentage', 2000, true),
  (14, 'Xcel Energy Solar Rewards Program', 'Local Utility Rebate', 0.04, 'per_watt', 1000, true);

-- 16. Insert mock rebates for Edinburgh, Scotland (region_id = 15)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (15, 'Home Energy Scotland Heat Grant', 'National Clean Energy Grant', 7500, 'fixed', 7500, true),
  (15, 'UK Smart Export Guarantee (SEG)', 'National Feed-in Tariff', 0.05, 'per_watt', NULL, true);

-- 17. Insert mock rebates for Munich, Germany (region_id = 16)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (16, 'German EEG Solar Feed-in Tariff', 'National Feed-in Tariff', 0.08, 'per_watt', NULL, true),
  (16, 'Munich Klimaschutz Solar Program', 'State Storage Incentive', 1200, 'fixed', 2400, true);

-- 18. Insert mock rebates for Vancouver, Canada (region_id = 17)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (17, 'CleanBC Better Homes Heat Pump Rebate', 'Provincial Energy Grant', 3000, 'fixed', 3000, true),
  (17, 'BC Hydro Net Metering Incentive', 'Local Utility Rebate', 0.10, 'per_watt', NULL, true);

-- 19. Insert mock rebates for Melbourne, Australia (region_id = 18)
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active) 
VALUES
  (18, 'Victoria Solar Homes Program Grant', 'State Clean Energy Grant', 1400, 'fixed', 1400, true),
  (18, 'Solar Victoria Battery Rebate Scheme', 'State Storage Program', 1600, 'fixed', 2400, true);
