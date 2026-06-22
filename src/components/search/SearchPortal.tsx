import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, MapPin, Zap, Tag, ArrowRight, Globe, Layers } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTranslations } from '../../lib/i18n';

interface SearchRebate {
  id: string;
  authority_name: string;
  technology_category: string;
  incentive_value: number;
  incentive_type: string;
  max_limit: number | null;
  region: {
    country_code: string;
    state_province: string;
    city: string;
    postal_code: string;
  };
}

interface SearchPortalProps {
  initialQuery?: string;
  lang: string;
}

export default function SearchPortal({ initialQuery = '', lang }: SearchPortalProps) {
  const t = useTranslations(lang);
  const [query, setQuery] = useState(initialQuery);
  const [postalQuery, setPostalQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [rebates, setRebates] = useState<SearchRebate[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchRebate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Preset mock database records for offline fallbacks
  const mockRebates: SearchRebate[] = [
    {
      id: 'mock-1',
      authority_name: 'Federal Solar Tax Credit',
      technology_category: 'Federal Tax Incentive',
      incentive_value: 30,
      incentive_type: 'percentage',
      max_limit: null,
      region: { country_code: 'us', state_province: 'California', city: 'Los Angeles', postal_code: '90210' }
    },
    {
      id: 'mock-2',
      authority_name: 'California SGIP Battery Rebate',
      technology_category: 'Battery Storage Program',
      incentive_value: 2000,
      incentive_type: 'fixed',
      max_limit: 5000,
      region: { country_code: 'us', state_province: 'California', city: 'Los Angeles', postal_code: '90210' }
    },
    {
      id: 'mock-3',
      authority_name: 'LADWP Solar Net Incentive',
      technology_category: 'Local Utility Rebate',
      incentive_value: 0.50,
      incentive_type: 'per_watt',
      max_limit: 1500,
      region: { country_code: 'us', state_province: 'California', city: 'Los Angeles', postal_code: '90210' }
    },
    {
      id: 'mock-4',
      authority_name: 'CenterPoint Energy Solar Rebate',
      technology_category: 'Local Utility Rebate',
      incentive_value: 0.75,
      incentive_type: 'per_watt',
      max_limit: 2500,
      region: { country_code: 'us', state_province: 'Texas', city: 'Houston', postal_code: '77001' }
    },
    {
      id: 'mock-5',
      authority_name: 'UK Smart Export Guarantee (SEG)',
      technology_category: 'National Feed-in Tariff',
      incentive_value: 0.05,
      incentive_type: 'per_watt',
      max_limit: null,
      region: { country_code: 'gb', state_province: 'England', city: 'London', postal_code: 'EC1A' }
    },
    {
      id: 'mock-6',
      authority_name: 'Boiler Upgrade Scheme Grant',
      technology_category: 'Heat Pump Subsidy',
      incentive_value: 7500,
      incentive_type: 'fixed',
      max_limit: 7500,
      region: { country_code: 'gb', state_province: 'England', city: 'London', postal_code: 'EC1A' }
    },
    {
      id: 'mock-7',
      authority_name: 'German EEG Solar Feed-in Tariff',
      technology_category: 'National Feed-in Tariff',
      incentive_value: 0.08,
      incentive_type: 'per_watt',
      max_limit: null,
      region: { country_code: 'de', state_province: 'Berlin', city: 'Berlin', postal_code: '10115' }
    },
    {
      id: 'mock-8',
      authority_name: 'Berlin Solarplus Battery Grant',
      technology_category: 'State Storage Incentive',
      incentive_value: 1500,
      incentive_type: 'fixed',
      max_limit: 3000,
      region: { country_code: 'de', state_province: 'Berlin', city: 'Berlin', postal_code: '10115' }
    }
  ];

  // Fetch from Supabase on load and merge with local storage overrides
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      let fetchedRebates: SearchRebate[] = [];

      // 1. Fetch from Supabase if active
      if (supabase) {
        try {
          const { data: rebatesData, error } = await supabase
            .from('rebates')
            .select(`
              id,
              authority_name,
              technology_category,
              incentive_value,
              incentive_type,
              max_limit,
              regions (
                country_code,
                state_province,
                city,
                postal_code
              )
            `)
            .eq('is_active', true);

          if (rebatesData && !error) {
            fetchedRebates = rebatesData.map((item: any) => ({
              id: item.id,
              authority_name: item.authority_name,
              technology_category: item.technology_category,
              incentive_value: Number(item.incentive_value),
              incentive_type: item.incentive_type,
              max_limit: item.max_limit ? Number(item.max_limit) : null,
              region: {
                country_code: item.regions?.country_code || 'us',
                state_province: item.regions?.state_province || '',
                city: item.regions?.city || '',
                postal_code: item.regions?.postal_code || ''
              }
            }));
          }
        } catch (err) {
          console.error('Failed to query search database from Supabase, using mock local data:', err);
        }
      }

      // If Supabase fetch was empty or failed, use mock base
      if (fetchedRebates.length === 0) {
        fetchedRebates = [...mockRebates];
      }

      // 2. Fetch and merge from localStorage (Option B Admin additions)
      try {
        const localRegionsRaw = localStorage.getItem('local_regions');
        const localRebatesRaw = localStorage.getItem('local_rebates');
        if (localRebatesRaw) {
          const localRegions = localRegionsRaw ? JSON.parse(localRegionsRaw) : [];
          const localRebates = JSON.parse(localRebatesRaw);

          const formattedLocalRebates = localRebates
            .filter((item: any) => item.is_active !== false)
            .map((item: any) => {
              const matchedRegion = localRegions.find((r: any) => String(r.id) === String(item.region_id));
              return {
                id: item.id || `local-${Math.random()}`,
                authority_name: item.authority_name,
                technology_category: item.technology_category,
                incentive_value: Number(item.incentive_value),
                incentive_type: item.incentive_type,
                max_limit: item.max_limit ? Number(item.max_limit) : null,
                region: {
                  country_code: matchedRegion?.country_code || 'us',
                  state_province: matchedRegion?.state_province || '',
                  city: matchedRegion?.city || '',
                  postal_code: matchedRegion?.postal_code || ''
                }
              };
            });
          
          fetchedRebates = [...formattedLocalRebates, ...fetchedRebates];
        }
      } catch (err) {
        console.error('Failed to merge local storage rebates:', err);
      }

      setRebates(fetchedRebates);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Perform search filtering
  useEffect(() => {
    let filtered = rebates.filter((item) => {
      // 1. Text Search matching authority, technology, city, or state
      const searchStr = `${item.authority_name} ${item.technology_category} ${item.region.city} ${item.region.state_province}`.toLowerCase();
      const textMatches = searchStr.includes(query.toLowerCase());

      // 2. Postal Code specific filtering
      const postalMatches = postalQuery === '' || item.region.postal_code.toLowerCase().includes(postalQuery.toLowerCase().trim());

      // 3. Category Filter
      let catMatches = true;
      if (selectedCategory !== 'all') {
        catMatches = item.technology_category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                     item.authority_name.toLowerCase().includes(selectedCategory.toLowerCase());
      }

      // 4. Country Filter
      let countryMatches = true;
      if (selectedCountry !== 'all') {
        const itemCountry = item.region.country_code.toLowerCase() === 'gb' ? 'uk' : item.region.country_code.toLowerCase();
        countryMatches = itemCountry === selectedCountry.toLowerCase();
      }

      return textMatches && postalMatches && catMatches && countryMatches;
    });

    setFilteredResults(filtered);
  }, [query, postalQuery, selectedCategory, selectedCountry, rebates]);

  // Extended technology categories for filtering
  const categories = ['all', 'solar', 'battery', 'heat pump', 'utility', 'tax'];

  // Count matching rebates for each category (based on queries but independent of selectedCategory filter)
  const getCategoryCount = (category: string) => {
    let tempFiltered = rebates.filter((item) => {
      const searchStr = `${item.authority_name} ${item.technology_category} ${item.region.city} ${item.region.state_province}`.toLowerCase();
      const textMatches = searchStr.includes(query.toLowerCase());
      const postalMatches = postalQuery === '' || item.region.postal_code.toLowerCase().includes(postalQuery.toLowerCase().trim());

      let countryMatches = true;
      if (selectedCountry !== 'all') {
        const itemCountry = item.region.country_code.toLowerCase() === 'gb' ? 'uk' : item.region.country_code.toLowerCase();
        countryMatches = itemCountry === selectedCountry.toLowerCase();
      }

      return textMatches && postalMatches && countryMatches;
    });

    if (category === 'all') return tempFiltered.length;

    return tempFiltered.filter((item) => {
      return item.technology_category.toLowerCase().includes(category.toLowerCase()) ||
             item.authority_name.toLowerCase().includes(category.toLowerCase());
    }).length;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 140, damping: 15 } },
    exit: { opacity: 0, scale: 0.95, y: -15, transition: { duration: 0.2 } }
  };

  return (
    <div className="space-y-8">
      {/* Advanced Integrated Search Panels */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--color-border)] p-4 rounded-3xl shadow-lg grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Main query input */}
        <div className="relative md:col-span-6">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search.placeholder}
            className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-2xl py-3.5 px-4 pl-12 outline-none focus:border-[var(--color-accent)] transition-all font-semibold shadow-sm focus:shadow-md"
          />
          <Search className="absolute left-4 top-4 w-5 h-5 text-[var(--text-muted)]" />
        </div>

        {/* Postal Code query input */}
        <div className="relative md:col-span-3">
          <input 
            type="text"
            value={postalQuery}
            onChange={(e) => setPostalQuery(e.target.value)}
            placeholder="Postal / ZIP code..."
            className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-2xl py-3.5 px-4 pl-12 outline-none focus:border-[var(--color-accent)] transition-all font-semibold shadow-sm focus:shadow-md"
          />
          <MapPin className="absolute left-4 top-4 w-5 h-5 text-[var(--text-muted)]" />
        </div>

        {/* Country Selector */}
        <div className="relative md:col-span-3">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-2xl py-3.5 px-4 pl-12 outline-none focus:border-[var(--color-accent)] transition-all font-semibold shadow-sm focus:shadow-md appearance-none cursor-pointer"
          >
            <option value="all">{t.search.allCountries}</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="de">Germany</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
          </select>
          <Globe className="absolute left-4 top-4 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
        </div>
      </div>

      {/* Technology selector filters with count badges */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--bg-secondary)]/40 p-4 border border-[var(--color-border)] rounded-2xl shadow-inner">
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[var(--text-muted)] mr-2" />
          {categories.map((cat) => {
            const count = getCategoryCount(cat);
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize border transition-all flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-[var(--color-accent)] text-white border-transparent shadow-md' 
                    : 'bg-[var(--bg-primary)] border-[var(--color-border)] text-[var(--text-muted)] hover:border-[var(--color-accent)]'
                }`}
              >
                <span>{cat === 'all' ? t.search.allCategories : cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--color-border)]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          {filteredResults.length} matches found
        </div>
      </div>

      {/* Live Results Grid */}
      {isLoading ? (
        <div className="text-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[var(--text-muted)] font-semibold text-sm">{t.search.loadingMsg}</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredResults.length > 0 ? (
              filteredResults.map((rebate) => {
                const countryCode = rebate.region.country_code.toLowerCase() === 'gb' ? 'uk' : rebate.region.country_code.toLowerCase();
                const stateSlug = rebate.region.state_province.toLowerCase().replace(/\s+/g, '-');
                const citySlug = rebate.region.city.toLowerCase().replace(/\s+/g, '-');
                const detailUrl = `/${lang}/directory/${countryCode}/${stateSlug}/${citySlug}`;

                return (
                  <motion.div
                    layout
                    variants={itemVariants}
                    key={rebate.id}
                    className="bg-[var(--bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Background glow on hover */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/2 rounded-full blur-2xl pointer-events-none group-hover:bg-[var(--color-accent)]/5 transition-all"></div>

                    <div>
                      {/* Location & Sizing Badge */}
                      <div className="flex justify-between items-start gap-2 mb-4">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-secondary)] border border-[var(--color-border)] px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                          <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                          {rebate.region.city}, {rebate.region.state_province} {rebate.region.postal_code}
                        </span>
                        
                        <span className="text-[10px] font-black text-[var(--color-accent)] border border-[var(--color-accent)]/20 px-2.5 py-1 rounded-lg bg-[var(--color-accent)]/5 flex items-center gap-1 uppercase tracking-wide">
                          <Zap className="w-3 h-3 animate-pulse" />
                          {rebate.incentive_type === 'percentage' && 'Tax Credit'}
                          {rebate.incentive_type === 'fixed' && 'Cash Grant'}
                          {rebate.incentive_type === 'per_watt' && 'Utility Offset'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[var(--text-main)] mb-1.5 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                        {rebate.authority_name}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] mb-4 font-semibold tracking-wide uppercase flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        {rebate.technology_category}
                      </p>
                    </div>

                    <div className="border-t border-[var(--color-border)]/50 pt-4 mt-2 flex items-center justify-between">
                      {/* Value callout */}
                      <div>
                        <span className="text-3xl font-black text-[var(--text-main)] tracking-tight">
                          {rebate.incentive_type === 'percentage' && `${rebate.incentive_value}%`}
                          {rebate.incentive_type === 'fixed' && `$${rebate.incentive_value.toLocaleString()}`}
                          {rebate.incentive_type === 'per_watt' && `$${rebate.incentive_value}/W`}
                        </span>
                        <span className="block text-[10px] font-bold text-[var(--text-muted)] mt-0.5">
                          {rebate.max_limit ? `Capped at $${rebate.max_limit.toLocaleString()}` : 'No limit cap'}
                        </span>
                      </div>

                      {/* Action trigger link */}
                      <a 
                        href={detailUrl}
                        className="text-xs font-bold text-[var(--color-accent)] flex items-center gap-1 border border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white px-4 py-2 rounded-xl transition-all shadow-sm"
                      >
                        Calculate ROI <ArrowRight className="w-4 h-4 ml-0.5" />
                      </a>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                layout
                variants={itemVariants}
                className="col-span-full bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-2xl p-16 text-center shadow-inner"
              >
                <Tag className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-[var(--text-main)]">{t.search.noResults}</h3>
                <p className="text-sm text-[var(--text-muted)] mt-2 max-w-sm mx-auto">{t.search.noResultsDesc}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
