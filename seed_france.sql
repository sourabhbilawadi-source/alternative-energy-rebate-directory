-- seed_france.sql
-- Database migration script to register French regions (Paris, Marseille, Lyon) and their respective rebates

-- 1. Insert new regions (Paris, Marseille, Lyon)
INSERT INTO public.regions (country_code, state_province, city, postal_code, grid_rate, sun_hours, grid_emissions, cost_per_watt, state_slug, country_slug)
VALUES 
  ('fr', 'Île-de-France', 'Paris', '75001', 0.25, 1660, 0.05, 2.40, 'ile-de-france', 'fr'),
  ('fr', 'Provence-Alpes-Côte d''Azur', 'Marseille', '13001', 0.25, 2800, 0.05, 2.40, 'provence-alpes-cote-d-azur', 'fr'),
  ('fr', 'Auvergne-Rhône-Alpes', 'Lyon', '69001', 0.25, 2000, 0.05, 2.40, 'auvergne-rhone-alpes', 'fr')
ON CONFLICT (country_code, state_province, city) DO UPDATE SET
  postal_code = EXCLUDED.postal_code,
  grid_rate = EXCLUDED.grid_rate,
  sun_hours = EXCLUDED.sun_hours,
  grid_emissions = EXCLUDED.grid_emissions,
  cost_per_watt = EXCLUDED.cost_per_watt,
  state_slug = EXCLUDED.state_slug,
  country_slug = EXCLUDED.country_slug;

-- 2. Insert rebates linked to the new French regions
-- Note: Subqueries are used to dynamically look up the generated region IDs
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active, slug, description, eligibility, official_url)
SELECT 
  reg.id,
  r.authority_name,
  r.technology_category,
  r.incentive_value,
  r.incentive_type,
  r.max_limit,
  true,
  lower(regexp_replace(regexp_replace(regexp_replace(r.authority_name || '-' || reg.city, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'), '-+', '-', 'g')),
  r.authority_name || ' offers ' || 
    (CASE 
      WHEN r.incentive_type = 'percentage' THEN r.incentive_value || '%'
      WHEN r.incentive_type = 'per_watt' THEN '€' || r.incentive_value || '/W'
      WHEN r.incentive_type = 'fixed' THEN '€' || r.incentive_value
      ELSE '€' || r.incentive_value || ' ' || r.incentive_type
    END) || 
    (CASE 
      WHEN r.max_limit IS NOT NULL THEN ' (up to €' || r.max_limit || ')' 
      ELSE '' 
    END) || 
    ' for ' || lower(r.technology_category) || ' in ' || reg.city || ', ' || reg.state_province || '.',
  r.eligibility,
  r.official_url
FROM public.regions reg
CROSS JOIN (
  VALUES 
    ('EDF Obligation d''Achat Feed-in Tariff', 'National Feed-in Tariff', 0.011, 'per_watt', NULL::numeric, 
     'Residential rooftop solar installations <= 9 kWc must use autoconsommation with surplus export. Works must be installed by a certified RGE professional.',
     'https://www.service-public.fr/particuliers/vosdroits/F31487'),
    
    ('Reduced 5.5% VAT (14.5% Tax Savings)', 'Tax Exemption', 14.5, 'percentage', NULL::numeric,
     'Applies to residential solar PV systems <= 9 kWc and heat pump installations on dwellings completed over 2 years ago, when installed by an RGE contractor.',
     'https://www.service-public.fr/particuliers/vosdroits/F35444'),
     
    ('Eco-Prêt à Taux Zéro (Eco-PTZ)', 'Clean Energy Loan', 0, 'fixed', 50000::numeric,
     'Homeowners or landlords performing eligible energy efficiency works (including heat pumps or solar thermal). No income conditions.',
     'https://www.service-public.fr/particuliers/vosdroits/F19905'),
     
    ('MaPrimeRénov'' Air-to-Water Heat Pump Grant', 'Heat Pump Subsidy', 3000, 'fixed', 5000::numeric,
     'Available to homeowners occupying a principal residence older than 15 years, using an RGE QualiPAC contractor. Headline value of €3,000 represents the lowest qualifying intermediate income tier (Violet); higher grants up to €5,000 are available for low (Jaune) and very-low (Bleu) income households.',
     'https://france-renov.gouv.fr/aides-financieres/maprimerenov'),
     
    ('MaPrimeRénov'' Geothermal Heat Pump Grant', 'Heat Pump Subsidy', 6000, 'fixed', 11000::numeric,
     'Available to homeowners occupying a principal residence older than 15 years, using an RGE contractor. Headline value of €6,000 represents the lowest qualifying intermediate income tier (Violet); higher grants up to €11,000 are available for low (Jaune) and very-low (Bleu) income households.',
     'https://france-renov.gouv.fr/aides-financieres/maprimerenov'),
     
    ('Prime CEE (Coup de Pouce Chauffage)', 'Heat Pump Subsidy', 3000, 'fixed', 5000::numeric,
     'Available when replacing an old fossil-fuel boiler (oil, gas, coal) with a high-efficiency heat pump. Installed by an RGE contractor.',
     'https://www.service-public.fr/particuliers/vosdroits/F34421')
) r(authority_name, technology_category, incentive_value, incentive_type, max_limit, eligibility, official_url)
WHERE reg.country_code = 'fr'
ON CONFLICT (slug) DO UPDATE SET
  incentive_value = EXCLUDED.incentive_value,
  max_limit = EXCLUDED.max_limit,
  eligibility = EXCLUDED.eligibility,
  official_url = EXCLUDED.official_url,
  description = EXCLUDED.description;

-- 3. Insert Marseille-specific local heating grant
INSERT INTO public.rebates (region_id, authority_name, technology_category, incentive_value, incentive_type, max_limit, is_active, slug, description, eligibility, official_url)
SELECT 
  reg.id,
  'Provence Éco-Rénov Heating Grant',
  'Local Utility Rebate',
  4000,
  'fixed',
  8000,
  true,
  'provence-eco-renov-heating-grant-marseille',
  'Provence Éco-Rénov Heating Grant offers €4000 (up to €8000) for local utility rebate in Marseille, Provence-Alpes-Côte d''Azur.',
  'Owners of principal residences built before 2000 in the Bouches-du-Rhône department, subject to income ceilings. Covers heat pumps and insulation.',
  'https://www.departement13.fr/nos-actions/logement/dispositifs/provence-eco-renov/'
FROM public.regions reg
WHERE reg.city = 'Marseille' AND reg.country_code = 'fr'
ON CONFLICT (slug) DO UPDATE SET
  incentive_value = EXCLUDED.incentive_value,
  max_limit = EXCLUDED.max_limit,
  eligibility = EXCLUDED.eligibility,
  official_url = EXCLUDED.official_url,
  description = EXCLUDED.description;
