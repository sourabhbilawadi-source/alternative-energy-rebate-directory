import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { isValidSource } from '../../../data/regions';
import type { RegionEntry } from '../../../data/regions';

interface DataSourcesBlockProps {
  hasAnyRealSource: boolean | undefined;
  regionEntry: RegionEntry | undefined;
  itemVariants: any;
}

export default function DataSourcesBlock({ hasAnyRealSource, regionEntry, itemVariants }: DataSourcesBlockProps) {
  if (!hasAnyRealSource || !regionEntry) return null;

  return (
    <motion.div
      variants={itemVariants as any}
      className="bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-2xl p-4 text-[10px] text-[var(--text-muted)] space-y-1.5 shadow-sm"
    >
      <div className="font-bold text-[var(--text-main)] mb-1 flex items-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-accent)]" />
        Data Sources & Verification
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-[var(--color-border)]/50">
        {isValidSource((regionEntry as any).gridRateSource) && (
          <div>
            Grid Rate: {(regionEntry as any).gridRateSource.sourceUrl !== '#' ? (
              <a href={(regionEntry as any).gridRateSource.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline font-semibold">{(regionEntry as any).gridRateSource.sourceName}</a>
            ) : (
              <span className="font-semibold">{(regionEntry as any).gridRateSource.sourceName}</span>
            )}
            {(regionEntry as any).gridRateSource.lastVerified && <span className="opacity-80"> (Verified: {(regionEntry as any).gridRateSource.lastVerified})</span>}
          </div>
        )}
        {isValidSource((regionEntry as any).costPerWattSource) && (
          <div>
            Cost/W: {(regionEntry as any).costPerWattSource.sourceUrl !== '#' ? (
              <a href={(regionEntry as any).costPerWattSource.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline font-semibold">{(regionEntry as any).costPerWattSource.sourceName}</a>
            ) : (
              <span className="font-semibold">{(regionEntry as any).costPerWattSource.sourceName}</span>
            )}
            {(regionEntry as any).costPerWattSource.lastVerified && <span className="opacity-80"> (Verified: {(regionEntry as any).costPerWattSource.lastVerified})</span>}
          </div>
        )}
        {isValidSource((regionEntry as any).federalTaxCreditSource) && (
          <div>
            Federal Credit: {(regionEntry as any).federalTaxCreditSource.sourceUrl !== '#' ? (
              <a href={(regionEntry as any).federalTaxCreditSource.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline font-semibold">{(regionEntry as any).federalTaxCreditSource.sourceName}</a>
            ) : (
              <span className="font-semibold">{(regionEntry as any).federalTaxCreditSource.sourceName}</span>
            )}
            {(regionEntry as any).federalTaxCreditSource.lastVerified && <span className="opacity-80"> (Verified: {(regionEntry as any).federalTaxCreditSource.lastVerified})</span>}
          </div>
        )}
        {isValidSource((regionEntry as any).stateRebateSource) && (
          <div>
            State Rebate: {(regionEntry as any).stateRebateSource.sourceUrl !== '#' ? (
              <a href={(regionEntry as any).stateRebateSource.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline font-semibold">{(regionEntry as any).stateRebateSource.sourceName}</a>
            ) : (
              <span className="font-semibold">{(regionEntry as any).stateRebateSource.sourceName}</span>
            )}
            {(regionEntry as any).stateRebateSource.lastVerified && <span className="opacity-80"> (Verified: {(regionEntry as any).stateRebateSource.lastVerified})</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}
