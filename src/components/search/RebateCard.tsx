import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, Tag, ArrowRight } from 'lucide-react';
import type { SearchRebate } from './types';

interface RebateCardProps {
  rebate: SearchRebate;
  lang: string;
  itemVariants: any;
}

export function RebateCard({ rebate, lang, itemVariants }: RebateCardProps) {
  const countryCode = rebate.region.country_code.toLowerCase() === 'gb' ? 'uk' : rebate.region.country_code.toLowerCase();
  const stateSlug = rebate.region.state_province.toLowerCase().replace(/\s+/g, '-');
  const citySlug = rebate.region.city.toLowerCase().replace(/\s+/g, '-');
  const detailUrl = `/${lang}/directory/${countryCode}/${stateSlug}/${citySlug}`;

  return (
    <motion.div
      layout
      variants={itemVariants as any}
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
}
