import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Truck, Flame, Building } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

interface CarbonDrawerProps {
  carbonTons: number;
  equivalentCars: number;
  equivalentCoal: number;
  equivalentForest: number;
  config: any;
  lang: string;
  t: any;
  itemVariants: any;
}

export default function CarbonDrawer({
  carbonTons,
  equivalentCars,
  equivalentCoal,
  equivalentForest,
  config,
  lang,
  t,
  itemVariants
}: CarbonDrawerProps) {
  return (
    <motion.div
      variants={itemVariants as any}
      className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3 shadow-inner"
    >
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
          <Leaf className="w-4 h-4 text-green-500" />
          {t.calculator.carbonOffset}
        </span>
        <span className="text-sm font-black text-green-500">
          <AnimatedNumber value={carbonTons} formatter={(v) => v.toFixed(1)} /> {config.carbon}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-[var(--color-border)]/40 pt-3 text-center text-[10px] text-[var(--text-muted)]">
        <div className="space-y-1.5 p-2 bg-[var(--bg-secondary)]/50 rounded-xl border border-[var(--color-border)]/40">
          <Truck className="w-4 h-4 text-[var(--text-muted)] mx-auto" />
          <div className="font-bold text-[var(--text-main)]">
            <AnimatedNumber value={equivalentCars} /> Cars
          </div>
          <div>{t.calculator.equivalentCars}</div>
        </div>
        <div className="space-y-1.5 p-2 bg-[var(--bg-secondary)]/50 rounded-xl border border-[var(--color-border)]/40">
          <Flame className="w-4 h-4 text-[var(--text-muted)] mx-auto" />
          <div className="font-bold text-[var(--text-main)]">
            <AnimatedNumber value={equivalentCoal} /> Tons
          </div>
          <div>{t.calculator.equivalentCoal}</div>
        </div>
        <div className="space-y-1.5 p-2 bg-[var(--bg-secondary)]/50 rounded-xl border border-[var(--color-border)]/40">
          <Building className="w-4 h-4 text-[var(--text-muted)] mx-auto" />
          <div className="font-bold text-[var(--text-main)]">
            <AnimatedNumber value={equivalentForest} /> {config.land}
          </div>
          <div>
            {lang === 'de-de'
              ? 'Waldfläche gerettet (Hektar)'
              : (config.land === 'Hectares' ? 'Forest hectares saved' : t.calculator.equivalentForest)
            }
          </div>
        </div>
      </div>
    </motion.div>
  );
}
