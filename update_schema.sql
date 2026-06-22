-- update_schema.sql
-- Run these statements in the Supabase SQL Editor to add specs columns to the regions table.

-- 1. Add specs columns to regions table if they don't exist
ALTER TABLE public.regions ADD COLUMN IF NOT EXISTS grid_rate NUMERIC;
ALTER TABLE public.regions ADD COLUMN IF NOT EXISTS sun_hours INTEGER;
ALTER TABLE public.regions ADD COLUMN IF NOT EXISTS grid_emissions NUMERIC;
ALTER TABLE public.regions ADD COLUMN IF NOT EXISTS cost_per_watt NUMERIC;

-- 2. Update existing regions with their respective solar resource and energy profile specifications
UPDATE public.regions SET grid_rate = 0.28, sun_hours = 1800, grid_emissions = 0.52, cost_per_watt = 3.10 WHERE id = 1; -- Los Angeles
UPDATE public.regions SET grid_rate = 0.14, sun_hours = 1950, grid_emissions = 0.82, cost_per_watt = 2.70 WHERE id = 2; -- Houston
UPDATE public.regions SET grid_rate = 0.23, sun_hours = 1250, grid_emissions = 0.66, cost_per_watt = 3.25 WHERE id = 3; -- New York City
UPDATE public.regions SET grid_rate = 0.22, sun_hours = 1050, grid_emissions = 0.40, cost_per_watt = 3.40 WHERE id = 4; -- London
UPDATE public.regions SET grid_rate = 0.38, sun_hours = 1100, grid_emissions = 0.70, cost_per_watt = 2.90 WHERE id = 5; -- Berlin
UPDATE public.regions SET grid_rate = 0.26, sun_hours = 2100, grid_emissions = 0.75, cost_per_watt = 1.80 WHERE id = 6; -- Sydney
UPDATE public.regions SET grid_rate = 0.16, sun_hours = 1300, grid_emissions = 0.12, cost_per_watt = 2.80 WHERE id = 7; -- Toronto
