import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, MapPin, Zap, Tag, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
  };
}

interface SearchPortalProps {
  initialQuery?: string;
  lang: string;
}

export default function SearchPortal({ initialQuery = '', lang }: SearchPortalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [rebates, setRebates] = useState<SearchRebate[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchRebate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Preset mock database records for offline fallbacks
  const mockRebates: SearchRebate[] = [
    {
      id: '1',
      authority_name: 'Federal Solar Tax Credit',
      technology_category: 'Solar Sizing / Tax Program',
      incentive_value: 30,
      incentive_type: 'percentage',
      max_limit: null,
      region: { country_code: 'us', state_province: 'California', city: 'Los Angeles' }
    },
    {
      id: '2',
      authority_name: 'California SGIP Battery Rebate',
      technology_category: 'Battery Storage Program',
      incentive_value: 2000,
      incentive_type: 'fixed',
      max_limit: 5000,
      region: { country_code: 'us', state_province: 'California', city: 'Los Angeles' }
    },
    {
      id: '3',
      authority_name: 'LADWP Solar Net Incentive',
      technology_category: 'Local Utility Rebate',
      incentive_value: 0.50,
      incentive_type: 'per_watt',
      max_limit: 1500,
      region: { country_code: 'us', state_province: 'California', city: 'Los Angeles' }
    },
    {
      id: '4',
      authority_name: 'CenterPoint Energy Solar Rebate',
      technology_category: 'Local Utility Rebate',
      incentive_value: 0.75,
      incentive_type: 'per_watt',
      max_limit: 2500,
      region: { country_code: 'us', state_province: 'Texas', city: 'Houston' }
    },
    {
      id: '5',
      authority_name: 'UK Smart Export Guarantee (SEG)',
      technology_category: 'Feed-in Tariff',
      incentive_value: 0.05,
      incentive_type: 'per_watt',
      max_limit: null,
      region: { country_code: 'gb', state_province: 'England', city: 'London' }
    },
    {
      id: '6',
      authority_name: 'Boiler Upgrade Scheme Grant',
      technology_category: 'Heat Pump Subsidy',
      incentive_value: 7500,
      incentive_type: 'fixed',
      max_limit: 7500,
      region: { country_code: 'gb', state_province: 'England', city: 'London' }
    }
  ];

  // Fetch from Supabase on load
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
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
                city
              )
            `)
            .eq('is_active', true);

          if (rebatesData && !error) {
            // Translate structures
            const formatted = rebatesData.map((item: any) => ({
              id: item.id,
              authority_name: item.authority_name,
              technology_category: item.technology_category,
              incentive_value: item.incentive_value,
              incentive_type: item.incentive_type,
              max_limit: item.max_limit,
              region: {
                country_code: item.regions?.country_code || 'us',
                state_province: item.regions?.state_province || '',
                city: item.regions?.city || ''
              }
            }));
            setRebates(formatted);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error('Failed to query search database from Supabase, using mock local data:', err);
        }
      }
      // Fallback
      setRebates(mockRebates);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Perform search filtering
  useEffect(() => {
    let filtered = rebates.filter((item) => {
      // 1. Text Search matching authority, technology, city, state, or postal code
      const searchStr = `${item.authority_name} ${item.technology_category} ${item.region.city} ${item.region.state_province}`.toLowerCase();
      const textMatches = searchStr.includes(query.toLowerCase());

      // 2. Category Filter
      let catMatches = true;
      if (selectedCategory !== 'all') {
        catMatches = item.technology_category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                     item.authority_name.toLowerCase().includes(selectedCategory.toLowerCase());
      }

      // 3. Country Filter
      let countryMatches = true;
      if (selectedCountry !== 'all') {
        const itemCountry = item.region.country_code.toLowerCase() === 'gb' ? 'uk' : item.region.country_code.toLowerCase();
        countryMatches = itemCountry === selectedCountry.toLowerCase();
      }

      return textMatches && catMatches && countryMatches;
    });

    setFilteredResults(filtered);
  }, [query, selectedCategory, selectedCountry, rebates]);

  // Unique categories for filtering
  const categories = ['all', 'solar', 'battery', 'utility', 'heat pump'];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 140, damping: 15 } }
  };

  return (
    <div className="space-y-8">
      {/* Search Input Bar */}
      <div className="relative">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by city, state, utility agency, or rebate program name..."
          className="w-full bg-[var(--bg-secondary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-2xl py-4 px-6 pl-14 outline-none focus:border-[var(--color-accent)] transition-all font-semibold shadow-sm focus:shadow-md text-lg"
        />
        <Search className="absolute left-5 top-4.5 w-6 h-6 text-[var(--text-muted)]" />
      </div>

      {/* Filters Layout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--bg-secondary)]/50 p-4 border border-[var(--color-border)] rounded-2xl shadow-inner">
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[var(--text-muted)] mr-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize border transition-all ${
                selectedCategory === cat 
                  ? 'bg-[var(--color-accent)] text-white border-transparent shadow-sm' 
                  : 'bg-[var(--bg-primary)] border-[var(--color-border)] text-[var(--text-muted)] hover:border-[var(--color-accent)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--text-muted)] mr-1">Country:</span>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="text-xs font-bold bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-lg px-2.5 py-1.5 outline-none"
          >
            <option value="all">All Countries</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
          </select>
        </div>
      </div>

      {/* Results listing */}
      {isLoading ? (
        <div className="text-center py-16 space-y-4">
          <div className="w-10 h-10 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[var(--text-muted)] font-semibold text-sm">Searching policies & databases...</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence>
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
                    className="bg-[var(--bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Location Badge */}
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-secondary)] border border-[var(--color-border)] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {rebate.region.city}, {rebate.region.state_province}
                        </span>
                        
                        <span className="text-[10px] font-extrabold text-[var(--color-accent)] border border-[var(--color-accent)]/20 px-2.5 py-0.5 rounded-full bg-[var(--color-accent)]/5 flex items-center gap-1 uppercase">
                          <Zap className="w-2.5 h-2.5 animate-pulse" />
                          {rebate.incentive_type === 'percentage' && 'Tax Credit'}
                          {rebate.incentive_type === 'fixed' && 'Cash Grant'}
                          {rebate.incentive_type === 'per_watt' && 'Utility Offset'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[var(--text-main)] mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                        {rebate.authority_name}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] mb-4">{rebate.technology_category}</p>
                    </div>

                    <div className="border-t border-[var(--color-border)]/50 pt-4 mt-2 flex items-center justify-between">
                      {/* Value callout */}
                      <div>
                        <span className="text-2xl font-black text-[var(--text-main)]">
                          {rebate.incentive_type === 'percentage' && `${rebate.incentive_value}%`}
                          {rebate.incentive_type === 'fixed' && `$${rebate.incentive_value.toLocaleString()}`}
                          {rebate.incentive_type === 'per_watt' && `$${rebate.incentive_value}/W`}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] ml-1">
                          {rebate.max_limit ? `(Capped at $${rebate.max_limit.toLocaleString()})` : 'No Cap'}
                        </span>
                      </div>

                      {/* Action trigger link */}
                      <a 
                        href={detailUrl}
                        className="text-xs font-bold text-[var(--color-accent)] flex items-center gap-1 border border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white px-3.5 py-1.5 rounded-xl transition-all"
                      >
                        Calculate ROI <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                variants={itemVariants}
                className="col-span-full bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-2xl p-12 text-center"
              >
                <Tag className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-60" />
                <h3 className="text-lg font-bold text-[var(--text-main)]">No active rebate programs found</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Try refining your keyword query or expanding the technology filters.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
