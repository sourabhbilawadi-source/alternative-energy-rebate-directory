import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, MapPin, Tag, Globe, Layers } from 'lucide-react';
import { useTranslations } from '../../lib/i18n';
import type { SearchRebate } from './types';
import { RebateCard } from './RebateCard';
import { useSearchData } from './useSearchData';
import { categories, filterRebates, getCategoryCount, getCategoryLabel } from './searchUtils';

interface SearchPortalProps {
  initialQuery?: string;
  lang: string;
  initialRebates?: SearchRebate[];
}

export default function SearchPortal({ initialQuery = '', lang, initialRebates = [] }: SearchPortalProps) {
  const t = useTranslations(lang);
  const [query, setQuery] = useState(initialQuery);
  const [postalQuery, setPostalQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [filteredResults, setFilteredResults] = useState<SearchRebate[]>([]);

  const { rebates, isLoading } = useSearchData(initialRebates);

  // Parse URL search params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get('q');
      if (q) {
        setQuery(q);
      }
    }
  }, []);

  // Perform search filtering
  useEffect(() => {
    const filtered = filterRebates(rebates, query, postalQuery, selectedCategory, selectedCountry);
    setFilteredResults(filtered);
  }, [query, postalQuery, selectedCategory, selectedCountry, rebates]);

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
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 140, damping: 15 } },
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
            aria-label="Search rebates by keywords"
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
            aria-label="Search rebates by postal or ZIP code"
          />
          <MapPin className="absolute left-4 top-4 w-5 h-5 text-[var(--text-muted)]" />
        </div>

        {/* Country Selector */}
        <div className="relative md:col-span-3">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-2xl py-3.5 px-4 pl-12 outline-none focus:border-[var(--color-accent)] transition-all font-semibold shadow-sm focus:shadow-md appearance-none cursor-pointer"
            aria-label="Filter rebates by country"
          >
            <option value="all">{t.search.allCountries}</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="de">Germany</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="fr">France</option>
            <option value="ie">Ireland</option>
            <option value="nl">Netherlands</option>
            <option value="nz">New Zealand</option>
            <option value="jp">Japan</option>
          </select>
          <Globe className="absolute left-4 top-4 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
        </div>
      </div>

      {/* Technology selector filters with count badges */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--bg-secondary)]/40 p-4 border border-[var(--color-border)] rounded-2xl shadow-inner">
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[var(--text-muted)] mr-2" />
          {categories.map((cat) => {
            const count = getCategoryCount(cat, rebates, query, postalQuery, selectedCountry);
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
                <span>{getCategoryLabel(cat, lang, t)}</span>
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
              filteredResults.map((rebate) => (
                <RebateCard
                  key={rebate.id}
                  rebate={rebate}
                  lang={lang}
                  itemVariants={itemVariants}
                />
              ))
            ) : (
              <motion.div 
                layout
                variants={itemVariants as any}
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
