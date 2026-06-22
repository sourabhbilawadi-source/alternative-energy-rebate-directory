import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  Leaf, 
  DollarSign, 
  Zap, 
  Scale, 
  ShieldCheck, 
  TrendingUp, 
  Truck, 
  Flame 
} from 'lucide-react';
import { useTranslations } from '../../lib/i18n';

interface SmeHubProps {
  defaultGridRate: number;
  defaultSunHours: number;
  defaultGridEmissions: number;
  defaultCostPerWatt: number;
  state: string;
  city: string;
  lang?: string;
}

// Custom high-performance animated number counter
function AnimatedNumber({ value, formatter }: { value: number; formatter?: (v: number) => string }) {
  const [displayValue, setDisplayValue] = React.useState(value);

  React.useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 500;
    const startTime = performance.now();
    let animationFrameId: number;

    const updateNumber = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateNumber);
      } else {
        setDisplayValue(end);
      }
    };

    animationFrameId = requestAnimationFrame(updateNumber);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return <span>{formatter ? formatter(displayValue) : Math.round(displayValue)}</span>;
}

export default function SmeHub({
  defaultGridRate: initialGridRate,
  defaultSunHours: initialSunHours,
  defaultGridEmissions: initialGridEmissions,
  defaultCostPerWatt: initialCostPerWatt,
  state,
  city,
  lang = 'en-us'
}: SmeHubProps) {
  const t = useTranslations(lang);

  // Dynamic regional specs (updated onmount/city/localStorage changes)
  const [gridRate, setGridRate] = useState(initialGridRate);
  const [sunHours, setSunHours] = useState(initialSunHours);
  const [gridEmissions, setGridEmissions] = useState(initialGridEmissions);
  const [costPerWattVal, setCostPerWattVal] = useState(initialCostPerWatt);

  // Input states
  const [facilityArea, setFacilityArea] = useState(25000); // sq ft
  const [monthlyKwh, setMonthlyKwh] = useState(35000); // kWh
  const [isOwned, setIsOwned] = useState(true); // Owned vs Leased
  const [financeModel, setFinanceModel] = useState<'purchase' | 'ppa' | 'lease'>('purchase');

  // Sync settings and merge localStorage admin overrides if present
  useEffect(() => {
    try {
      const localRegionsRaw = localStorage.getItem('local_regions');
      if (localRegionsRaw) {
        const localRegions = JSON.parse(localRegionsRaw);
        const matched = localRegions.find((r: any) => 
          r.city.toLowerCase().replace(/-/g, ' ') === city.toLowerCase().replace(/-/g, ' ')
        );
        if (matched) {
          setGridRate(Number(matched.grid_rate));
          setSunHours(Number(matched.sun_hours));
          setGridEmissions(Number(matched.grid_emissions));
          setCostPerWattVal(Number(matched.cost_per_watt));
          return;
        }
      }
    } catch (err) {
      console.error('Failed to parse local overrides in SME Hub:', err);
    }
    // Reset to defaults if no localStorage override is matching
    setGridRate(initialGridRate);
    setSunHours(initialSunHours);
    setGridEmissions(initialGridEmissions);
    setCostPerWattVal(initialCostPerWatt);
  }, [city, initialGridRate, initialSunHours, initialGridEmissions, initialCostPerWatt]);

  // Commercial scale cost discounts (15% discount for enterprise sizes)
  const costPerWatt = costPerWattVal * 0.85;

  // Commercial sizing calculations
  // Max capacity based on usable rooftop area (approx 120 sq ft per kW commercial panels)
  const capacityFromRoof = facilityArea / 120; // kW
  
  // Ideal system size based on consumption
  const capacityFromDemand = (monthlyKwh * 12) / sunHours; // kW
  
  // Capped capacity
  const systemSize = Math.min(capacityFromRoof, capacityFromDemand); // kW
  const capitalCost = systemSize * 1000 * costPerWatt; // gross cost
  
  // Annual generation
  const annualGeneration = systemSize * sunHours; // kWh

  // Financing models ROI logic
  const getFinancingMetrics = () => {
    if (financeModel === 'ppa') {
      // PPA: $0 down, buy electricity at fixed discount rate (approx 28% cheaper)
      const ppaRate = gridRate * 0.72;
      const netCost = 0;
      const annualSavings = annualGeneration * (gridRate - ppaRate);
      const payback = 0; // Immediate savings
      const firstYearROI = 100; // infinite / immediate
      return { netCost, annualSavings, payback, firstYearROI, ppaRate };
    } else if (financeModel === 'lease') {
      // Lease: $0 down, pay fixed monthly rent (approx $16/kW per month)
      const monthlyLease = systemSize * 16;
      const netCost = 0;
      const annualSavings = (annualGeneration * gridRate) - (monthlyLease * 12);
      const payback = 0; // Immediate savings
      const firstYearROI = 100;
      return { netCost, annualSavings, payback, firstYearROI, monthlyLease };
    } else {
      // Direct Purchase: full capital, claims 30% Federal ITC + MACRS Depreciation tax shield (NPV approx 18% of gross cost)
      const federalITC = capitalCost * 0.30;
      const macrsBenefit = capitalCost * 0.18;
      const stateCommercialGrant = 5000;
      const netCost = Math.max(0, capitalCost - federalITC - macrsBenefit - stateCommercialGrant);
      const annualSavings = annualGeneration * gridRate;
      const payback = annualSavings > 0 ? netCost / annualSavings : 0;
      const firstYearROI = netCost > 0 ? (annualSavings / netCost) * 100 : 100;
      return { netCost, annualSavings, payback, firstYearROI };
    }
  };

  const metrics = getFinancingMetrics();

  // Carbon Abatement Scope 2 equivalents
  const carbonTons = (annualGeneration * gridEmissions) / 2000;
  const equivalentCars = carbonTons * 0.22;
  const equivalentCoal = carbonTons * 0.96;
  const equivalentForest = carbonTons * 1.2;

  // Stagger animation setups
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 15 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 16 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 shadow-xl"
    >
      {/* ----------------- LEFT PANEL: COMMERCIAL INPUTS ----------------- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="lg:col-span-5 space-y-6"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-1">Commercial Sizing Engine</h2>
          <p className="text-sm text-[var(--text-muted)]">Configure parameters for enterprise energy audit.</p>
        </motion.div>

        {/* Property Status Owned vs Leased */}
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Property Ownership</label>
          <div className="grid grid-cols-2 gap-3 bg-[var(--bg-primary)] p-1.5 rounded-xl border border-[var(--color-border)]">
            <button 
              onClick={() => { setIsOwned(true); setFinanceModel('purchase'); }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                isOwned 
                  ? 'bg-[var(--color-accent)] text-white shadow-sm' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              🏢 Owned Property
            </button>
            <button 
              onClick={() => { setIsOwned(false); setFinanceModel('ppa'); }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                !isOwned 
                  ? 'bg-[var(--color-accent)] text-white shadow-sm' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              🔑 Leased Facility
            </button>
          </div>
        </motion.div>

        {/* Facility Area Slider */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-[var(--text-main)]">Rooftop Footprint</span>
            <span className="text-[var(--color-accent)] text-lg font-bold">{(facilityArea).toLocaleString()} sq ft</span>
          </div>
          <input 
            type="range" min="5000" max="250000" step="5000" value={facilityArea} 
            onChange={(e) => setFacilityArea(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--color-border)] accent-[var(--color-accent)]"
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>5K sq ft</span>
            <span>125K sq ft</span>
            <span>250K sq ft</span>
          </div>
        </motion.div>

        {/* Monthly Consumption Slider */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-[var(--text-main)]">Monthly Grid Draw</span>
            <span className="text-[var(--color-accent)] text-lg font-bold">{(monthlyKwh).toLocaleString()} kWh</span>
          </div>
          <input 
            type="range" min="5000" max="500000" step="5000" value={monthlyKwh} 
            onChange={(e) => setMonthlyKwh(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--color-border)] accent-[var(--color-accent)]"
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>5K kWh</span>
            <span>250K kWh</span>
            <span>500K kWh</span>
          </div>
        </motion.div>

        {/* Financing Model Selector */}
        <motion.div variants={itemVariants} className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{t.calculator.financingModel}</label>
          <div className="grid grid-cols-3 gap-2 bg-[var(--bg-primary)] p-1 rounded-xl border border-[var(--color-border)]">
            <button
              onClick={() => setFinanceModel('purchase')}
              disabled={!isOwned}
              className={`py-2 px-1 text-center rounded-lg text-[10px] font-bold transition-all ${
                !isOwned ? 'opacity-40 cursor-not-allowed' : ''
              } ${
                financeModel === 'purchase'
                  ? 'bg-[var(--color-accent)] text-white shadow-sm'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {t.calculator.purchase}
            </button>
            <button
              onClick={() => setFinanceModel('ppa')}
              className={`py-2 px-1 text-center rounded-lg text-[10px] font-bold transition-all ${
                financeModel === 'ppa'
                  ? 'bg-[var(--color-accent)] text-white shadow-sm'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              PPA ($0-Down)
            </button>
            <button
              onClick={() => setFinanceModel('lease')}
              className={`py-2 px-1 text-center rounded-lg text-[10px] font-bold transition-all ${
                financeModel === 'lease'
                  ? 'bg-[var(--color-accent)] text-white shadow-sm'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {t.calculator.lease}
            </button>
          </div>
        </motion.div>

        {/* active specs info card */}
        <motion.div 
          variants={itemVariants}
          className="bg-[var(--bg-primary)]/50 border border-[var(--color-border)] rounded-2xl p-4 text-xs space-y-1 shadow-sm"
        >
          <h4 className="font-bold flex items-center gap-1 text-[var(--text-main)] mb-1">
            <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" />
            Enterprise Policy Factors ({city})
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[var(--text-muted)] font-semibold">
            <div>Baseline Rate: <strong>${gridRate.toFixed(2)}/kWh</strong></div>
            <div>Commercial Cost: <strong>${costPerWatt.toFixed(2)}/W</strong></div>
            <div>Solar Resource: <strong>{sunHours} hrs/yr</strong></div>
            <div>Capital Tax ITC: <strong>30% (Sec 48)</strong></div>
          </div>
        </motion.div>
      </motion.div>

      {/* ----------------- RIGHT PANEL: DYNAMIC RESULTS ----------------- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="lg:col-span-7 flex flex-col justify-between space-y-6"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-1">Financial Yield & Decarbonization</h2>
          <p className="text-sm text-[var(--text-muted)]">Calculated commercial outputs for {city}, {state}.</p>
        </motion.div>

        {/* Primary Callout: Payback or Rent */}
        <motion.div 
          variants={itemVariants}
          key={`finance-${financeModel}`}
          initial={{ scale: 0.98, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
        >
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-[var(--color-accent)]/5 rounded-full blur-xl" />
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase">
              {financeModel === 'purchase' ? t.calculator.paybackPeriod : 'Net Annual Savings'}
            </span>
            <span className="px-2.5 py-1 text-xs font-bold bg-green-500/10 text-green-500 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High Yield
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            {financeModel === 'purchase' ? (
              <>
                <span className="text-5xl md:text-6xl font-black tracking-tight text-[var(--text-main)]">
                  <AnimatedNumber value={metrics.payback} formatter={(v) => v.toFixed(1)} />
                </span>
                <span className="text-xl font-bold text-[var(--text-muted)]">{t.calculator.years}</span>
              </>
            ) : (
              <>
                <span className="text-5xl md:text-6xl font-black tracking-tight text-[var(--text-main)]">
                  $<AnimatedNumber value={metrics.annualSavings} />
                </span>
                <span className="text-xl font-bold text-[var(--text-muted)]">/ year</span>
              </>
            )}
          </div>

          <div className="text-[11px] text-[var(--text-muted)] border-t border-[var(--color-border)]/60 pt-3 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[var(--color-accent)]" />
            {financeModel === 'purchase' && (
              <span>Claims 30% Federal ITC + 5-yr MACRS depreciation. Net cost: <strong>${Math.round(metrics.netCost).toLocaleString()}</strong>.</span>
            )}
            {financeModel === 'ppa' && (
              <span>$0 upfront capital. Power purchase rate: <strong>${metrics.ppaRate?.toFixed(3)}/kWh</strong> (Utility: ${gridRate.toFixed(2)}/kWh).</span>
            )}
            {financeModel === 'lease' && (
              <span>$0 upfront capital. Rent: <strong>${Math.round(metrics.monthlyLease || 0).toLocaleString()}/mo</strong>, net profit from day 1.</span>
            )}
          </div>
        </motion.div>

        {/* SME Metrics Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Capacity sized */}
          <motion.div 
            variants={itemVariants}
            key={`sys-${systemSize}`}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-1 hover:shadow-md transition-shadow"
          >
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Sized System Capacity</span>
            <div className="text-2xl font-black text-[var(--text-main)]">
              <AnimatedNumber value={systemSize} formatter={(v) => v.toFixed(1)} /> <span className="text-xs font-bold text-[var(--text-muted)]">kW</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">
              Outputs <strong className="text-[var(--text-main)]">{Math.round(annualGeneration).toLocaleString()} kWh/yr</strong>.
            </p>
          </motion.div>

          {/* First year ROI */}
          <motion.div 
            variants={itemVariants}
            key={`roi-${metrics.firstYearROI}`}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-1 hover:shadow-md transition-shadow"
          >
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.calculator.firstYearRoi}</span>
            <div className="text-2xl font-black text-[var(--text-main)]">
              {financeModel === 'purchase' ? (
                <span><AnimatedNumber value={metrics.firstYearROI} />%</span>
              ) : (
                <span>Immediate</span>
              )}
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">
              {financeModel === 'purchase' ? "Annual savings over net cost." : "Day-1 positive cashflow offset."}
            </p>
          </motion.div>
        </div>

        {/* Carbon Offset Analytics Drawer */}
        <motion.div 
          variants={itemVariants}
          className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3 shadow-inner"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-green-500" />
              {t.calculator.carbonOffset}
            </span>
            <span className="text-sm font-black text-green-500">
              <AnimatedNumber value={carbonTons} formatter={(v) => v.toFixed(1)} /> {t.calculator.tons}
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
                <AnimatedNumber value={equivalentForest} /> Acres
              </div>
              <div>{t.calculator.equivalentForest}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
