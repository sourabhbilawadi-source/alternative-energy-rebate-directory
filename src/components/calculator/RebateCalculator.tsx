import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Battery, 
  TrendingUp, 
  Leaf, 
  DollarSign, 
  Zap, 
  Search, 
  HelpCircle,
  ShieldCheck,
  Building,
  Truck,
  Flame
} from 'lucide-react';
import { useTranslations } from '../../lib/i18n';
import { queryLocationSpecs } from '../../lib/energyApi';
import type { RegionEntry, MetricSource } from '../../data/regions';
import LeadCaptureCta from './LeadCaptureCta';
import { getCountryConfig } from '../../utils/countryConfig';

export interface DbRebate {
  id: string;
  authority_name: string;
  technology_category: string;
  incentive_value: number;
  incentive_type: string; // 'fixed', 'percentage', 'per_watt'
  max_limit: number | null;
}

interface RebateCalculatorProps {
  key?: string;
  defaultGridRate: number;
  defaultSunHours: number;
  defaultGridEmissions: number;
  defaultCostPerWatt: number;
  federalTaxCreditPct: number;
  stateRebate: number;
  utilityRebate: number;
  city: string;
  state: string;
  dbRebates?: DbRebate[];
  lang?: string;
  regionEntry?: RegionEntry;
  defaultPostalCode?: string;
}

// Helper to validate and hide temporary "TODO" source values
// TEMPORARY: Mark this as temporary until real data is backfilled
const isValidSource = (source: any): source is MetricSource => {
  return !!(
    source &&
    source.sourceName &&
    source.sourceName.trim() !== '' &&
    source.sourceName.trim() !== 'TODO' &&
    source.lastVerified &&
    source.lastVerified.trim() !== '' &&
    source.lastVerified.trim() !== 'TODO'
  );
};

// Custom animated counter using requestAnimationFrame for high performance
function AnimatedNumber({ value, formatter }: { value: number; formatter?: (v: number) => string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 600; // ms
    const startTime = performance.now();
    let animationFrameId: number;

    const updateNumber = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
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

// Interactive SVG energy flow simulation to visually engage the user
function EnergyFlowVisualizer({ batteryEnabled, sunHours, systemSize, lang }: { batteryEnabled: boolean; sunHours: number; systemSize: number; lang: string }) {
  const t = useTranslations(lang);
  // Calculate flow speed (duration of dot animation): higher generation = faster movement (shorter duration)
  const flowSpeed = Math.max(1.2, 8.5 - Math.min(6.5, (sunHours * systemSize) / 400));

  return (
    <div className="bg-[var(--bg-primary)]/40 border border-[var(--color-border)] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
      <div className="text-[10px] font-bold text-[var(--text-muted)] mb-3 uppercase tracking-wider">
        {t.calculator.simulationTitle}
      </div>
      
      <svg viewBox="0 0 300 120" className="w-full max-w-[280px] h-24">
        <defs>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDB813" />
            <stop offset="100%" stopColor="#F38120" />
          </linearGradient>
          <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Sun (50,30) to Panel (150,30) */}
        <path 
          id="sunToPanel" 
          d="M 66 30 L 134 30" 
          stroke="var(--color-border)" 
          strokeWidth="1.5" 
          strokeDasharray="4 4"
        />
        
        {/* Panel (150,30) to House (250,30) */}
        <path 
          id="panelToHouse" 
          d="M 166 30 L 234 30" 
          stroke="var(--color-border)" 
          strokeWidth="1.5"
        />

        {/* Panel (150,30) to Battery (150,90) */}
        {batteryEnabled && (
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4 }}
            d="M 150 46 L 150 74" 
            stroke="var(--color-border)" 
            strokeWidth="1.5"
          />
        )}

        {/* Battery (150,90) to House (250,30) */}
        {batteryEnabled && (
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
            d="M 166 90 L 245 46" 
            stroke="var(--color-border)" 
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* Animated Flow Dots */}
        {/* Sun -> Panel */}
        <circle r="3" fill="#FDB813">
          <animateMotion dur={`${flowSpeed}s`} repeatCount="indefinite" path="M 66 30 L 134 30" />
        </circle>
        
        {/* Panel -> House */}
        <circle r="3" fill="var(--color-accent)">
          <animateMotion dur={`${flowSpeed * 0.8}s`} repeatCount="indefinite" path="M 166 30 L 234 30" />
        </circle>

        {/* Panel -> Battery */}
        {batteryEnabled && (
          <circle r="3" fill="#10B981">
            <animateMotion dur={`${flowSpeed * 1.2}s`} repeatCount="indefinite" path="M 150 46 L 150 74" />
          </circle>
        )}

        {/* Battery -> House */}
        {batteryEnabled && (
          <circle r="3" fill="#10B981">
            <animateMotion dur={`${flowSpeed}s`} repeatCount="indefinite" path="M 166 90 L 245 46" />
          </circle>
        )}

        {/* Sun Node */}
        <motion.circle 
          cx="50" 
          cy="30" 
          r="16" 
          fill="url(#sunGrad)"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
        <text x="50" y="34" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">☀️</text>

        {/* Solar Panel Node */}
        <rect x="135" y="15" width="30" height="30" rx="5" fill="#1E3B8A" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="135" y1="25" x2="165" y2="25" stroke="#3B82F6" strokeWidth="0.5" />
        <line x1="135" y1="35" x2="165" y2="35" stroke="#3B82F6" strokeWidth="0.5" />
        <line x1="145" y1="15" x2="145" y2="45" stroke="#3B82F6" strokeWidth="0.5" />
        <line x1="155" y1="15" x2="155" y2="45" stroke="#3B82F6" strokeWidth="0.5" />

        {/* House Node */}
        <rect x="234" y="15" width="32" height="30" rx="5" fill="var(--bg-secondary)" stroke="var(--color-border)" strokeWidth="1.5" />
        <polygon points="230,17 250,3 270,17" fill="var(--color-accent)" />
        <text x="250" y="32" textAnchor="middle" fontSize="10">🏡</text>

        {/* Battery Node */}
        <AnimatePresence>
          {batteryEnabled && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
            >
              <rect x="135" y="75" width="30" height="26" rx="4" fill="url(#batteryGrad)" stroke="var(--color-border)" strokeWidth="1" />
              <rect x="146" y="71" width="8" height="4" rx="1" fill="#10B981" />
              <text x="150" y="92" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">🔋</text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}

export default function RebateCalculator({
  defaultGridRate,
  defaultSunHours,
  defaultGridEmissions,
  defaultCostPerWatt,
  federalTaxCreditPct,
  stateRebate,
  utilityRebate,
  city,
  state,
  dbRebates: initialDbRebates = [],
  lang = 'en-us',
  regionEntry,
  defaultPostalCode
}: RebateCalculatorProps) {
  const t = useTranslations(lang);


  const hasAnyRealSource = regionEntry && (
    isValidSource(regionEntry.gridRateSource) ||
    isValidSource(regionEntry.costPerWattSource) ||
    isValidSource(regionEntry.federalTaxCreditSource) ||
    isValidSource(regionEntry.stateRebateSource)
  );

  // Input states
  const [ownership, setOwnership] = useState<'purchase' | 'lease'>('purchase');
  const [localCountry, setLocalCountry] = useState(regionEntry?.countryCode || 'us');
  const config = getCountryConfig(localCountry);

  const [zipCode, setZipCode] = useState(() => {
    if (defaultPostalCode) return defaultPostalCode;
    const c = city ? city.toLowerCase().trim() : '';
    if (c.includes('houston')) return '77001';
    if (c.includes('los angeles')) return '90001';
    if (c.includes('new york')) return '10001';
    if (c.includes('london')) return 'SW1A 1AA';
    
    // Germany
    if (c.includes('berlin')) return '10115';
    if (c.includes('munich')) return '80331';
    if (c.includes('hamburg')) return '20095';
    if (c.includes('cologne')) return '50667';
    if (c.includes('frankfurt')) return '60311';
    if (c.includes('stuttgart')) return '70173';
    if (c.includes('leipzig')) return '04109';
    if (c.includes('düsseldorf') || c.includes('dusseldorf')) return '40210';
    
    // Australia
    if (c.includes('sydney')) return '2000';
    if (c.includes('melbourne')) return '3000';
    if (c.includes('brisbane')) return '4000';
    if (c.includes('perth')) return '6000';
    if (c.includes('adelaide')) return '5000';
    if (c.includes('canberra')) return '2600';
    if (c.includes('hobart')) return '7000';
    if (c.includes('darwin')) return '0800';

    // Canada
    if (c.includes('toronto')) return 'M5V 1J2';
    if (c.includes('vancouver')) return 'V6B 1A1';
    if (c.includes('montreal')) return 'H2Y 1Y9';
    if (c.includes('calgary')) return 'T2P 2M5';
    if (c.includes('edmonton')) return 'T5J 2R7';
    if (c.includes('ottawa')) return 'K1P 1J1';
    if (c.includes('winnipeg')) return 'R3C 1A1';

    return '90210'; // Default fallback
  });
  const [monthlyBill, setMonthlyBill] = useState(250);
  const [roofArea, setRoofArea] = useState(config.isMetric ? 120 : 1200);
  const [batteryEnabled, setBatteryEnabled] = useState(false);
  const [batteryCapacity, setBatteryCapacity] = useState(10);

  // Dynamic regional specs (updated on ZIP changes)
  const [gridRate, setGridRate] = useState(defaultGridRate);
  const [sunHours, setSunHours] = useState(defaultSunHours);
  const [gridEmissions, setGridEmissions] = useState(defaultGridEmissions);
  const [costPerWatt, setCostPerWatt] = useState(defaultCostPerWatt);
  const [localCity, setLocalCity] = useState(city);
  const [localState, setLocalState] = useState(state);
  const [dbRebates, setDbRebates] = useState<DbRebate[]>(initialDbRebates);
  const [isUpdating, setIsUpdating] = useState(false);

  // Adjust roof area default if country changes
  useEffect(() => {
    const isMetric = ['de', 'uk', 'au', 'ca'].includes(localCountry.toLowerCase());
    if (isMetric && roofArea > 1000) {
      setRoofArea(120);
    } else if (!isMetric && roofArea < 500) {
      setRoofArea(1200);
    }
  }, [localCountry]);

  // Merge database presets with any localStorage overrides (Option B) on mount and city change
  useEffect(() => {
    try {
      const localRegionsRaw = localStorage.getItem('local_regions');
      const localRebatesRaw = localStorage.getItem('local_rebates');
      
      let matchedRegionId = '';
      if (localRegionsRaw) {
        const localRegions = JSON.parse(localRegionsRaw);
        const matched = localRegions.find((r: any) => 
          r.city.toLowerCase().replace(/-/g, ' ') === city.toLowerCase().replace(/-/g, ' ')
        );
        if (matched) {
          setGridRate(Number(matched.grid_rate));
          setSunHours(Number(matched.sun_hours));
          setGridEmissions(Number(matched.grid_emissions));
          setCostPerWatt(Number(matched.cost_per_watt));
          matchedRegionId = String(matched.id);
        }
      }

      let mergedRebates = [...initialDbRebates];
      if (localRebatesRaw && matchedRegionId) {
        const localRebates = JSON.parse(localRebatesRaw);
        const filteredLocal = localRebates
          .filter((r: any) => String(r.region_id) === matchedRegionId && r.is_active !== false)
          .map((r: any) => ({
            id: r.id,
            authority_name: r.authority_name,
            technology_category: r.technology_category,
            incentive_value: Number(r.incentive_value),
            incentive_type: r.incentive_type,
            max_limit: r.max_limit ? Number(r.max_limit) : null
          }));
        
        // Merge without duplicating IDs
        const existingIds = new Set(mergedRebates.map(r => r.id));
        filteredLocal.forEach((r: DbRebate) => {
          if (!existingIds.has(r.id)) {
            mergedRebates.push(r);
          }
        });
      }
      setDbRebates(mergedRebates);
    } catch (err) {
      console.error('Failed to parse local overrides in calculator:', err);
    }
  }, [city, initialDbRebates]);

  // Handle dynamic ZIP lookup using Nominatim + Open-Meteo (Option C)
  useEffect(() => {
    const cleanZip = zipCode.trim();
    if (cleanZip.length < 3) return;

    setIsUpdating(true);
    const timer = setTimeout(async () => {
      const specs = await queryLocationSpecs(cleanZip, localCountry);
      if (specs) {
        setGridRate(specs.gridRate);
        setSunHours(specs.sunHours);
        setGridEmissions(specs.gridEmissions);
        setCostPerWatt(specs.costPerWatt);
        setLocalCity(specs.city);
        setLocalState(specs.state);
        setLocalCountry(specs.countryCode);

        // Check if there are local rebates registered for this postal code in localStorage
        try {
          const localRegionsRaw = localStorage.getItem('local_regions');
          const localRebatesRaw = localStorage.getItem('local_rebates');
          if (localRegionsRaw && localRebatesRaw) {
            const localRegions = JSON.parse(localRegionsRaw);
            const localRebates = JSON.parse(localRebatesRaw);
            
            const matchedReg = localRegions.find((r: any) => 
              r.postal_code.toLowerCase().trim() === cleanZip.toLowerCase().trim()
            );

            if (matchedReg) {
              const matchedRebates = localRebates
                .filter((r: any) => String(r.region_id) === String(matchedReg.id) && r.is_active !== false)
                .map((r: any) => ({
                  id: r.id,
                  authority_name: r.authority_name,
                  technology_category: r.technology_category,
                  incentive_value: Number(r.incentive_value),
                  incentive_type: r.incentive_type,
                  max_limit: r.max_limit ? Number(r.max_limit) : null
                }));
              
              setDbRebates(matchedRebates);
            } else {
              setDbRebates([]);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      setIsUpdating(false);
    }, 600); // Debounce API requests

    return () => clearTimeout(timer);
  }, [zipCode]);

  // Sizing and savings calculations
  // S = (12 * B_m) / (E_u * eta_sun)
  const systemSizeIdeal = (12 * monthlyBill) / (gridRate * sunHours); // kW
  
  // P_sz = min( A_roof / F_sqft, S ) where F_sqft = 150
  const roofAreaSqFt = config.isMetric ? roofArea * 10.764 : roofArea;
  const systemSizeCapped = Math.min(roofAreaSqFt / 150, systemSizeIdeal); // kW
  
  // System capital cost: kW * WattsPerkW * CostPerWatt
  const capitalCost = systemSizeCapped * 1000 * costPerWatt;
  
  const isUs = localCountry === 'us';

  // Total localized incentives
  const calculateIncentives = () => {
    const effectiveFedCreditPct = isUs
      ? (ownership === 'lease' ? 0.30 : 0.0)
      : federalTaxCreditPct;

    if (dbRebates && dbRebates.length > 0) {
      let fedCreditVal = 0;
      let otherIncentivesVal = 0;

      dbRebates.forEach((rebate) => {
        if (rebate.technology_category === 'Clean Energy Loan') {
          return;
        }
        let value = 0;
        if (rebate.incentive_type === 'percentage') {
          value = capitalCost * (Number(rebate.incentive_value) / 100);
        } else if (rebate.incentive_type === 'per_watt') {
          value = systemSizeCapped * 1000 * Number(rebate.incentive_value);
        } else if (rebate.incentive_type === 'fixed') {
          value = Number(rebate.incentive_value);
        }

        if (rebate.max_limit !== null) {
          value = Math.min(value, Number(rebate.max_limit));
        }

        if (
          rebate.technology_category.toLowerCase().includes('federal') || 
          rebate.authority_name.toLowerCase().includes('federal')
        ) {
          if (isUs && ownership === 'purchase') {
            value = 0;
          } else if (isUs && ownership === 'lease') {
            value = capitalCost * 0.30;
          }
          fedCreditVal += value;
        } else {
          otherIncentivesVal += value;
        }
      });

      if (isUs && ownership === 'lease') {
        const hasFedInDb = dbRebates.some(
          (r) =>
            r.technology_category.toLowerCase().includes('federal') ||
            r.authority_name.toLowerCase().includes('federal')
        );
        if (!hasFedInDb) {
          fedCreditVal = capitalCost * 0.30;
        }
      }

      const totalApplied = Math.min(capitalCost, fedCreditVal + otherIncentivesVal);
      return {
        fedTaxCredit: fedCreditVal,
        totalIncentives: totalApplied,
      };
    }

    const fedCreditVal = capitalCost * effectiveFedCreditPct;
    const totalApplied = Math.min(capitalCost, fedCreditVal + stateRebate + utilityRebate);
    return {
      fedTaxCredit: fedCreditVal,
      totalIncentives: totalApplied,
    };
  };

  const { fedTaxCredit, totalIncentives } = calculateIncentives();
  
  // Battery capital cost overlay ($750/kWh estimate)
  const batteryCost = batteryEnabled ? batteryCapacity * 750 : 0;
  const netSystemCost = capitalCost + batteryCost - totalIncentives;

  // Annual Generation (E_annual = P_sz * eta_sun)
  const annualGeneration = systemSizeCapped * sunHours; // kWh

  // Peak Avoidance Uplift through Battery Integration (Delta_peak)
  // Delta_peak = batteryCapacity * 365 * (Phi_peak - Phi_off) * alpha_eff
  const deltaPeak = batteryEnabled ? batteryCapacity * 365 * 0.26 * 0.88 : 0;

  // Annual savings (A_save = E_annual * E_u + Delta_peak)
  const annualSavings = (annualGeneration * gridRate) + deltaPeak;
  
  // Capped at total electric bill plus peak avoidance value
  const annualBillTotal = 12 * monthlyBill;
  const annualSavingsCapped = Math.min(annualBillTotal + deltaPeak, annualSavings);

  // Payback timeline (P_back = (C_sys - I_r) / A_save)
  const paybackYears = annualSavingsCapped > 0 ? Math.max(0.5, netSystemCost / annualSavingsCapped) : 0;

  // Dynamic payback yield evaluation
  const getPaybackTier = (years: number) => {
    if (years === 0) return { label: 'No Savings', className: 'bg-red-500/10 text-red-500' };
    if (years < 5) {
      return {
        label: 'Excellent Yield',
        className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      };
    } else if (years >= 5 && years <= 8) {
      return {
        label: 'High Return',
        className: 'bg-green-500/10 text-green-600 dark:text-green-400'
      };
    } else if (years > 8 && years <= 12) {
      return {
        label: 'Moderate Return',
        className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
      };
    } else {
      return {
        label: 'Slow Return',
        className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
      };
    }
  };
  const paybackTier = getPaybackTier(paybackYears);

  // Carbon abatement (CO2_tons = (P_sz * eta_sun * delta_grid) / 2000)
  const carbonAbatementTons = config.isMetric ? (systemSizeCapped * sunHours * gridEmissions) / 1000 : (systemSizeCapped * sunHours * gridEmissions) / 907.185;

  // Carbon equivalents
  const equivalentCars = carbonAbatementTons * 0.22;
  const equivalentCoal = carbonAbatementTons * 0.96;
  const equivalentForest = config.isMetric ? (carbonAbatementTons * 1.2 * 0.4047) : (carbonAbatementTons * 1.2);

  // Animation layout variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 130, damping: 15 } 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 16 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 shadow-xl"
    >
      
      {/* ----------------- LEFT PANEL: INPUT FIELDS ----------------- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="lg:col-span-5 space-y-6"
      >
        <motion.div variants={itemVariants as any}>
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-1">{t.common.calculate}</h2>
          <p className="text-sm text-[var(--text-muted)]">Configure parameters to customize the system model.</p>
        </motion.div>

        {/* Location ZIP locator */}
        <motion.div variants={itemVariants as any} className="space-y-2">
          <label className="block text-sm font-semibold text-[var(--text-main)] flex justify-between h-5">
            <span>ZIP / Postal Code</span>
            <AnimatePresence mode="wait">
              {isUpdating ? (
                <motion.span 
                  key="loading"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="text-xs text-[var(--color-accent)] font-bold"
                >
                  Syncing grid data...
                </motion.span>
              ) : (
                <motion.span 
                  key="active"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="text-xs text-[var(--text-muted)] font-normal"
                >
                  Active: {localCity}, {localState}
                </motion.span>
              )}
            </AnimatePresence>
          </label>
          <div className="relative">
            <motion.input 
              whileFocus={{ scale: 1.01, borderColor: 'var(--color-accent)' }}
              type="text" 
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-3 px-4 pl-11 outline-none focus:border-[var(--color-accent)] transition-all font-semibold"
              placeholder="Enter ZIP code"
            />
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
          </div>
        </motion.div>

        {/* Ownership Model Toggle for US */}
        {isUs && (
          <motion.div variants={itemVariants as any} className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--text-main)]">
              Ownership Model
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[var(--bg-primary)] p-1 rounded-2xl border border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setOwnership('purchase')}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all border-none outline-none cursor-pointer ${
                  ownership === 'purchase'
                    ? 'bg-[var(--color-accent)] text-white shadow-sm font-bold'
                    : 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Purchased Outright
              </button>
              <button
                type="button"
                onClick={() => setOwnership('lease')}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all border-none outline-none cursor-pointer ${
                  ownership === 'lease'
                    ? 'bg-[var(--color-accent)] text-white shadow-sm font-bold'
                    : 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Lease / PPA (Third-Party)
              </button>
            </div>
          </motion.div>
        )}

        {/* Monthly Utility Bill Slider */}
        <motion.div variants={itemVariants as any} className="space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-[var(--text-main)]">{t.calculator.monthlyBill}</span>
            <span className="text-[var(--color-accent)] text-lg font-bold">{config.symbol}{monthlyBill}</span>
          </div>
          <input 
            type="range" 
            min="50" 
            max="1000" 
            step="10"
            value={monthlyBill} 
            onChange={(e) => setMonthlyBill(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--color-border)] accent-[var(--color-accent)]"
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>{config.symbol}50</span>
            <span>{config.symbol}500</span>
            <span>{config.symbol}1,000</span>
          </div>
        </motion.div>

        {/* Usable Roof Area Slider */}
        <motion.div variants={itemVariants as any} className="space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-[var(--text-main)]">{t.calculator.roofArea}</span>
            <span className="text-[var(--color-accent)] text-lg font-bold">{roofArea} {config.area}</span>
          </div>
          <input 
            type="range" 
            min={config.isMetric ? 10 : 100} 
            max={config.isMetric ? 500 : 5000} 
            step={config.isMetric ? 5 : 50}
            value={roofArea} 
            onChange={(e) => setRoofArea(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--color-border)] accent-[var(--color-accent)]"
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>{config.isMetric ? "10 m²" : "100 sq ft"}</span>
            <span>{config.isMetric ? "250 m²" : "2,500 sq ft"}</span>
            <span>{config.isMetric ? "500 m²" : "5,000 sq ft"}</span>
          </div>
        </motion.div>

        {/* Battery Storage Toggle & Collapsible Options */}
        <motion.div variants={itemVariants as any} className="space-y-3">
          <div className="bg-[var(--bg-primary)] p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-500/10 text-green-500">
                <Battery className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">{t.calculator.batteryOption}</h3>
                <p className="text-xs text-[var(--text-muted)]">Model Time-of-Use peak avoidance</p>
              </div>
            </div>
            <button 
              onClick={() => setBatteryEnabled(!batteryEnabled)}
              className="w-14 h-8 rounded-full p-1 relative flex items-center cursor-pointer border-none outline-none transition-colors duration-300"
              style={{ backgroundColor: batteryEnabled ? 'var(--color-accent)' : 'var(--color-border)' }}
              aria-label="Toggle Battery Integration"
            >
              <motion.div 
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                className="w-6 h-6 rounded-full bg-white shadow-md"
                style={{ x: batteryEnabled ? 24 : 0 }}
              />
            </button>
          </div>

          <AnimatePresence>
            {batteryEnabled && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                className="overflow-hidden bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3 shadow-inner"
              >
                <div className="flex justify-between items-center text-xs font-semibold text-[var(--text-main)]">
                  <span>{t.calculator.batteryCapacity} (kWh)</span>
                  <span className="text-[var(--color-accent)] font-bold">{batteryCapacity} kWh</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="30" 
                  step="1"
                  value={batteryCapacity} 
                  onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-[var(--color-border)] accent-[var(--color-accent)]"
                />
                <div className="text-[11px] text-[var(--text-muted)] border-t border-[var(--color-border)]/50 pt-2 leading-relaxed">
                  Estimated battery cost: <strong className="text-[var(--text-main)]">{config.symbol}{(batteryCapacity * 750).toLocaleString()}</strong>. Yields an extra <strong className="text-[var(--text-main)]">{config.symbol}{Math.round(batteryCapacity * 365 * 0.26 * 0.88)}/yr</strong> in peak shifting offsets.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Local Rate Details Card */}
        <motion.div 
          variants={itemVariants as any}
          className="bg-[var(--bg-primary)]/50 border border-[var(--color-border)] rounded-2xl p-4 space-y-2 text-xs shadow-sm"
        >
          <h4 className="font-bold flex items-center gap-1.5 text-[var(--text-main)]">
            <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" />
            {t.calculator.localAveragesTitle}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[var(--text-muted)] font-semibold">
            <div>{t.calculator.gridRate}: <strong className="text-[var(--text-main)]">{config.symbol}{gridRate.toFixed(2)}/kWh</strong></div>
            <div>{t.calculator.sunHours}: <strong className="text-[var(--text-main)]">{sunHours} hrs/yr</strong></div>
            <div>{t.calculator.gridEmissions}: <strong className="text-[var(--text-main)]">{gridEmissions.toFixed(2)} kg/kWh</strong></div>
            <div>{t.calculator.costPerWatt}: <strong className="text-[var(--text-main)]">{config.symbol}{costPerWatt.toFixed(2)}/W</strong></div>
          </div>
        </motion.div>

        {/* Dynamic Energy Flow Visualizer */}
        <motion.div variants={itemVariants as any}>
          <EnergyFlowVisualizer batteryEnabled={batteryEnabled} sunHours={sunHours} systemSize={systemSizeCapped} lang={lang} />
        </motion.div>

        {/* Only show the Data Sources block if at least one real source is present */}
        {hasAnyRealSource && (
          <motion.div 
            variants={itemVariants as any}
            className="bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-2xl p-4 text-[10px] text-[var(--text-muted)] space-y-1.5 shadow-sm"
          >
            <div className="font-bold text-[var(--text-main)] mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              Data Sources & Verification
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-[var(--color-border)]/50">
              {isValidSource(regionEntry.gridRateSource) && (
                <div>
                  Grid Rate: {regionEntry.gridRateSource.sourceUrl !== '#' ? (
                    <a href={regionEntry.gridRateSource.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline font-semibold">{regionEntry.gridRateSource.sourceName}</a>
                  ) : (
                    <span className="font-semibold">{regionEntry.gridRateSource.sourceName}</span>
                  )}
                  {regionEntry.gridRateSource.lastVerified && <span className="opacity-80"> (Verified: {regionEntry.gridRateSource.lastVerified})</span>}
                </div>
              )}
              {isValidSource(regionEntry.costPerWattSource) && (
                <div>
                  Cost/W: {regionEntry.costPerWattSource.sourceUrl !== '#' ? (
                    <a href={regionEntry.costPerWattSource.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline font-semibold">{regionEntry.costPerWattSource.sourceName}</a>
                  ) : (
                    <span className="font-semibold">{regionEntry.costPerWattSource.sourceName}</span>
                  )}
                  {regionEntry.costPerWattSource.lastVerified && <span className="opacity-80"> (Verified: {regionEntry.costPerWattSource.lastVerified})</span>}
                </div>
              )}
              {isValidSource(regionEntry.federalTaxCreditSource) && (
                <div>
                  Federal Credit: {regionEntry.federalTaxCreditSource.sourceUrl !== '#' ? (
                    <a href={regionEntry.federalTaxCreditSource.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline font-semibold">{regionEntry.federalTaxCreditSource.sourceName}</a>
                  ) : (
                    <span className="font-semibold">{regionEntry.federalTaxCreditSource.sourceName}</span>
                  )}
                  {regionEntry.federalTaxCreditSource.lastVerified && <span className="opacity-80"> (Verified: {regionEntry.federalTaxCreditSource.lastVerified})</span>}
                </div>
              )}
              {isValidSource(regionEntry.stateRebateSource) && (
                <div>
                  State Rebate: {regionEntry.stateRebateSource.sourceUrl !== '#' ? (
                    <a href={regionEntry.stateRebateSource.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline font-semibold">{regionEntry.stateRebateSource.sourceName}</a>
                  ) : (
                    <span className="font-semibold">{regionEntry.stateRebateSource.sourceName}</span>
                  )}
                  {regionEntry.stateRebateSource.lastVerified && <span className="opacity-80"> (Verified: {regionEntry.stateRebateSource.lastVerified})</span>}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ----------------- RIGHT PANEL: DYNAMIC RESULTS ----------------- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="lg:col-span-7 flex flex-col justify-between space-y-6"
      >
        <motion.div variants={itemVariants as any}>
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-1">{t.calculator.roiTitle}</h2>
          <p className="text-sm text-[var(--text-muted)]">Calculated results model your custom solar offsets.</p>
        </motion.div>

        {/* Payback period large callout - animates and pops on value change */}
        <motion.div 
          variants={itemVariants as any}
          key={`payback-${paybackYears.toFixed(1)}`}
          initial={{ scale: 0.98, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300"
        >
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-[var(--color-accent)]/5 rounded-full blur-xl" />
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[var(--text-muted)] tracking-wider uppercase">{t.calculator.paybackPeriod}</span>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1 border border-current/10 ${paybackTier.className}`}>
              <TrendingUp className="w-3.5 h-3.5" /> {paybackTier.label}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-5xl md:text-6xl font-black tracking-tight text-[var(--text-main)]">
              <AnimatedNumber value={paybackYears} formatter={(v) => v.toFixed(1)} />
            </span>
            <span className="text-xl font-bold text-[var(--text-muted)]">{t.calculator.years}</span>
          </div>

          <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 border-t border-[var(--color-border)] pt-3">
            <HelpCircle className="w-4 h-4" />
            Based on a net system installation cost of <strong className="text-[var(--text-main)]">{config.symbol}{Math.round(netSystemCost).toLocaleString()}</strong> after incentives{batteryEnabled && " and battery components"}.
          </div>
        </motion.div>

        <LeadCaptureCta region={`${city}, ${state}`} calculatorType="residential" />

        {/* Sizing, Savings and Carbon detail grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Recommended System Size */}
          <motion.div 
            variants={itemVariants as any}
            key={`size-${systemSizeCapped.toFixed(2)}`}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-2 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span className="text-xs font-bold uppercase tracking-wider">System Capacity</span>
              <Sun className="w-4 h-4 text-[var(--color-accent)] animate-spin-slow" />
            </div>
            <div className="text-2xl font-black text-[var(--text-main)]">
              <AnimatedNumber value={systemSizeCapped} formatter={(v) => v.toFixed(2)} /> <span className="text-sm font-bold text-[var(--text-muted)]">kW</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Capped by {roofArea} {config.area} usable roof space.
            </p>
          </motion.div>

          {/* Capped Annual Savings */}
          <motion.div 
            variants={itemVariants as any}
            key={`savings-${Math.round(annualSavingsCapped)}`}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-2 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span className="text-xs font-bold uppercase tracking-wider">Annual Bill Reduction</span>
              <Zap className="w-4 h-4 text-[var(--color-accent)]" />
            </div>
            <div className="text-2xl font-black text-[var(--text-main)]">
              {config.symbol}<AnimatedNumber value={annualSavingsCapped} /> <span className="text-sm font-bold text-[var(--text-muted)]">/ yr</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Saves <strong className="text-[var(--text-main)]">{config.symbol}{Math.round(annualSavingsCapped / 12)}</strong> average per month.
            </p>
          </motion.div>

        </div>

        {/* Carbon Offset Analytics Drawer */}
        <motion.div 
          variants={itemVariants as any}
          key={`carbon-offset-${carbonAbatementTons.toFixed(2)}`}
          className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3 shadow-inner"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-green-500" />
              {t.calculator.carbonOffset}
            </span>
            <span className="text-sm font-black text-green-500">
              <AnimatedNumber value={carbonAbatementTons} formatter={(v) => v.toFixed(1)} /> {config.carbon}
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

        {/* Incentives Applied overview */}
        <motion.div 
          variants={itemVariants as any}
          className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 flex flex-col gap-2 text-xs shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <span className="text-[var(--text-muted)]">{t.calculator.activeRebatesTitle}:</span>
              <strong className="text-[var(--text-main)]">{config.symbol}{Math.round(totalIncentives).toLocaleString()}</strong>
            </div>
            <div className="text-[var(--text-muted)] text-right font-medium">
              {dbRebates && dbRebates.length > 0 ? (
                <span>{dbRebates.length} Regional Programs</span>
              ) : (
                <span>Incl. {isUs ? (ownership === 'lease' ? 30 : 0) : (federalTaxCreditPct * 100)}% {t.calculator.federalIncentive}</span>
              )}
            </div>
          </div>
          {((dbRebates && dbRebates.length > 0) || isUs) && (
            <div className="border-t border-[var(--color-border)] pt-2 mt-1 space-y-1">
              {dbRebates.map((rebate, index) => {
                const isFed = rebate.technology_category.toLowerCase().includes('federal') || rebate.authority_name.toLowerCase().includes('federal');
                return (
                  <div key={rebate.id || index} className="flex justify-between text-[var(--text-muted)]">
                    <span>• {rebate.authority_name} ({rebate.technology_category})</span>
                    <span>
                      {isFed ? (isUs ? (ownership === 'lease' ? '30%' : '0%') : `${rebate.incentive_value}%`) : (
                        <>
                          {rebate.incentive_type === 'percentage' && `${rebate.incentive_value}%`}
                          {rebate.incentive_type === 'fixed' && `${config.symbol}${rebate.incentive_value}`}
                          {rebate.incentive_type === 'per_watt' && `${config.symbol}${rebate.incentive_value}/W`}
                        </>
                      )}
                    </span>
                  </div>
                );
              })}
              {isUs && !dbRebates.some(r => r.technology_category.toLowerCase().includes('federal') || r.authority_name.toLowerCase().includes('federal')) && (
                <div className="flex justify-between text-[var(--text-muted)] font-semibold">
                  <span>• Federal Tax Credit (Section 25D/48)</span>
                  <span>{ownership === 'lease' ? '30%' : '0%'}</span>
                </div>
              )}
            </div>
          )}

          {isUs && (
            <div className="mt-2 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--color-border)] text-[var(--text-muted)] leading-relaxed space-y-1">
              <div className="font-bold text-[var(--text-main)] flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                Federal Tax Credit Rules (2026)
              </div>
              {ownership === 'purchase' ? (
                <p>
                  Federal tax credit for homeowner-purchased systems ended Dec 31, 2025. Third-party owned (lease/PPA) systems may still qualify—consult your installer.
                </p>
              ) : (
                <p>
                  Third-party owned (lease/PPA) systems may qualify for the 30% federal credit (Sec 48), claimed by the developer and typically reflected as lower monthly lease payments.
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Germany-specific EEG Reform Disclaimer */}
        {localCountry === 'de' && (
          <motion.div
            variants={itemVariants as any}
            className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-[var(--text-muted)] space-y-1 shadow-sm animate-pulse-subtle"
          >
            <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              {lang === 'de-de' ? 'EEG-Reform-Entwurf' : 'EEG Reform Draft'}
            </div>
            <p className="leading-relaxed">
              {lang === 'de-de' 
                ? 'Ein Referentenentwurf des BMWK (April 2026) sieht vor, die feste Einspeisevergütung für neue Aufdachanlagen ab dem 1. Januar 2027 abzuschaffen. Dies ist noch kein geltendes Recht.'
                : 'A ministerial draft (BMWK Referentenentwurf, April 2026) proposes abolishing fixed feed-in tariffs for new residential systems from Jan 1, 2027. This is not yet final law.'
              }
            </p>
          </motion.div>
        )}

      </motion.div>
    </motion.div>
  );
}
