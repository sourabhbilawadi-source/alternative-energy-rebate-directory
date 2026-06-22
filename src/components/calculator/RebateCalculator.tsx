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
  Building
} from 'lucide-react';

export interface DbRebate {
  id: string;
  authority_name: string;
  technology_category: string;
  incentive_value: number;
  incentive_type: string; // 'fixed', 'percentage', 'per_watt'
  max_limit: number | null;
}

interface RebateCalculatorProps {
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
}

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
function EnergyFlowVisualizer({ batteryEnabled, sunHours, systemSize }: { batteryEnabled: boolean; sunHours: number; systemSize: number }) {
  // Calculate flow speed (duration of dot animation): higher generation = faster movement (shorter duration)
  const flowSpeed = Math.max(1.2, 8.5 - Math.min(6.5, (sunHours * systemSize) / 400));

  return (
    <div className="bg-[var(--bg-primary)]/40 border border-[var(--color-border)] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
      <div className="text-[10px] font-bold text-[var(--text-muted)] mb-3 uppercase tracking-wider">
        Interactive Sizing flow
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
  dbRebates
}: RebateCalculatorProps) {
  // Input states
  const [zipCode, setZipCode] = useState('90210');
  const [monthlyBill, setMonthlyBill] = useState(250);
  const [roofArea, setRoofArea] = useState(1200);
  const [batteryEnabled, setBatteryEnabled] = useState(false);
  const [batteryCapacity, setBatteryCapacity] = useState(10); // NEW: Storage capacity slider

  // Dynamic regional specs (updated on ZIP changes)
  const [gridRate, setGridRate] = useState(defaultGridRate);
  const [sunHours, setSunHours] = useState(defaultSunHours);
  const [gridEmissions, setGridEmissions] = useState(defaultGridEmissions);
  const [costPerWatt, setCostPerWatt] = useState(defaultCostPerWatt);
  const [localCity, setLocalCity] = useState(city);
  const [localState, setLocalState] = useState(state);
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle dynamic ZIP lookup simulation
  useEffect(() => {
    if (zipCode.length < 5) return;

    setIsUpdating(true);
    const timer = setTimeout(() => {
      const firstDigit = zipCode.charAt(0);
      
      // Simulating database lookup for ZIP codes
      if (firstDigit === '9') { // California/West
        setGridRate(0.29);
        setSunHours(1850);
        setGridEmissions(0.51);
        setCostPerWatt(3.15);
        setLocalCity('Los Angeles');
        setLocalState('California');
      } else if (firstDigit === '7') { // Texas/South
        setGridRate(0.14);
        setSunHours(1920);
        setGridEmissions(0.81);
        setCostPerWatt(2.75);
        setLocalCity('Austin');
        setLocalState('Texas');
      } else if (firstDigit === '0' || firstDigit === '1') { // Northeast
        setGridRate(0.23);
        setSunHours(1250);
        setGridEmissions(0.66);
        setCostPerWatt(3.25);
        setLocalCity('Boston');
        setLocalState('Massachusetts');
      } else { // Fallback / Mid-west
        setGridRate(0.19);
        setSunHours(1480);
        setGridEmissions(0.72);
        setCostPerWatt(2.95);
        setLocalCity('Denver');
        setLocalState('Colorado');
      }
      setIsUpdating(false);
    }, 400); // Small delay to feel like a real API request

    return () => clearTimeout(timer);
  }, [zipCode]);

  // Sizing and savings calculations
  // S = (12 * B_m) / (E_u * eta_sun)
  const systemSizeIdeal = (12 * monthlyBill) / (gridRate * sunHours); // kW
  
  // P_sz = min( A_roof / F_sqft, S ) where F_sqft = 150
  const systemSizeCapped = Math.min(roofArea / 150, systemSizeIdeal); // kW
  
  // System capital cost: kW * WattsPerkW * CostPerWatt
  const capitalCost = systemSizeCapped * 1000 * costPerWatt;
  
  // Total localized incentives (from database or fallback static presets)
  const calculateIncentives = () => {
    if (dbRebates && dbRebates.length > 0) {
      let fedCreditVal = 0;
      let otherIncentivesVal = 0;

      dbRebates.forEach((rebate) => {
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
          fedCreditVal += value;
        } else {
          otherIncentivesVal += value;
        }
      });

      const totalApplied = Math.min(capitalCost, fedCreditVal + otherIncentivesVal);
      return {
        fedTaxCredit: fedCreditVal,
        totalIncentives: totalApplied,
      };
    }

    const fedCreditVal = capitalCost * federalTaxCreditPct;
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

  // Carbon abatement (CO2_tons = (P_sz * eta_sun * delta_grid) / 2000)
  const carbonAbatementTons = (systemSizeCapped * sunHours * gridEmissions) / 2000;
  
  // Trees equivalent = CO2_tons * 25 * 16.5
  const treesEquivalent = carbonAbatementTons * 25 * 16.5;

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
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-1">Calculate Sizing & ROI</h2>
          <p className="text-sm text-[var(--text-muted)]">Configure parameters to customize the system model.</p>
        </motion.div>

        {/* Location ZIP locator */}
        <motion.div variants={itemVariants} className="space-y-2">
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
              maxLength={5}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-3 px-4 pl-11 outline-none focus:border-[var(--color-accent)] transition-all font-semibold"
              placeholder="Enter ZIP code"
            />
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
          </div>
        </motion.div>

        {/* Monthly Utility Bill Slider */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-[var(--text-main)]">Average Monthly Utility Bill</span>
            <span className="text-[var(--color-accent)] text-lg font-bold">${monthlyBill}</span>
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
            <span>$50</span>
            <span>$500</span>
            <span>$1,000</span>
          </div>
        </motion.div>

        {/* Usable Roof Area Slider */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-[var(--text-main)]">Usable Roof Area</span>
            <span className="text-[var(--color-accent)] text-lg font-bold">{roofArea} sq ft</span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="5000" 
            step="50"
            value={roofArea} 
            onChange={(e) => setRoofArea(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--color-border)] accent-[var(--color-accent)]"
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>100 sq ft</span>
            <span>2,500 sq ft</span>
            <span>5,000 sq ft</span>
          </div>
        </motion.div>

        {/* Battery Storage Toggle & Collapsible Options */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="bg-[var(--bg-primary)] p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-500/10 text-green-500">
                <Battery className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">Integrate Home Battery</h3>
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
                  <span>Battery Capacity (kWh)</span>
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
                  Estimated battery cost: <strong className="text-[var(--text-main)]">${(batteryCapacity * 750).toLocaleString()}</strong>. Yields an extra <strong className="text-[var(--text-main)]">${Math.round(batteryCapacity * 365 * 0.26 * 0.88)}/yr</strong> in peak shifting offsets.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Local Rate Details Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-[var(--bg-primary)]/50 border border-[var(--color-border)] rounded-2xl p-4 space-y-2 text-xs shadow-sm"
        >
          <h4 className="font-bold flex items-center gap-1.5 text-[var(--text-main)]">
            <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" />
            Active Regional Sizing Presets
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[var(--text-muted)]">
            <div>Local Utility Rate: <strong className="text-[var(--text-main)]">${gridRate.toFixed(2)}/kWh</strong></div>
            <div>Solar Resource Coeff: <strong className="text-[var(--text-main)]">{sunHours} hrs/yr</strong></div>
            <div>Grid Carbon Factor: <strong className="text-[var(--text-main)]">{gridEmissions.toFixed(2)} lbs/kWh</strong></div>
            <div>Avg Installation Cost: <strong className="text-[var(--text-main)]">${costPerWatt.toFixed(2)}/W</strong></div>
          </div>
        </motion.div>

        {/* Dynamic Energy Flow Visualizer */}
        <motion.div variants={itemVariants}>
          <EnergyFlowVisualizer batteryEnabled={batteryEnabled} sunHours={sunHours} systemSize={systemSizeCapped} />
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
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-1">Financial & Ecological ROI</h2>
          <p className="text-sm text-[var(--text-muted)]">Calculated results model your custom solar offsets.</p>
        </motion.div>

        {/* Payback period large callout - animates and pops on value change */}
        <motion.div 
          variants={itemVariants}
          key={`payback-${paybackYears.toFixed(1)}`}
          initial={{ scale: 0.98, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300"
        >
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-[var(--color-accent)]/5 rounded-full blur-xl" />
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[var(--text-muted)] tracking-wider uppercase">Estimated Payback Period</span>
            <span className="px-2.5 py-1 text-xs font-bold bg-green-500/10 text-green-500 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High Return
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-5xl md:text-6xl font-black tracking-tight text-[var(--text-main)]">
              <AnimatedNumber value={paybackYears} formatter={(v) => v.toFixed(1)} />
            </span>
            <span className="text-xl font-bold text-[var(--text-muted)]">Years</span>
          </div>

          <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 border-t border-[var(--color-border)] pt-3">
            <HelpCircle className="w-4 h-4" />
            Based on a net system installation cost of <strong className="text-[var(--text-main)]">${Math.round(netSystemCost).toLocaleString()}</strong> after incentives{batteryEnabled && " and battery components"}.
          </div>
        </motion.div>

        {/* Sizing, Savings and Carbon detail grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Recommended System Size */}
          <motion.div 
            variants={itemVariants}
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
              Capped by {roofArea} sq ft usable roof space.
            </p>
          </motion.div>

          {/* Capped Annual Savings */}
          <motion.div 
            variants={itemVariants}
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
              $<AnimatedNumber value={annualSavingsCapped} /> <span className="text-sm font-bold text-[var(--text-muted)]">/ yr</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Saves <strong className="text-[var(--text-main)]">${Math.round(annualSavingsCapped / 12)}</strong> average per month.
            </p>
          </motion.div>

          {/* Annual Carbon Abatement */}
          <motion.div 
            variants={itemVariants}
            key={`co2-${carbonAbatementTons.toFixed(1)}`}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-2 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span className="text-xs font-bold uppercase tracking-wider">Carbon Abated</span>
              <Leaf className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-black text-[var(--text-main)]">
              <AnimatedNumber value={carbonAbatementTons} formatter={(v) => v.toFixed(1)} /> <span className="text-sm font-bold text-[var(--text-muted)]">Tons CO₂</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Annually removed from the regional power grid.
            </p>
          </motion.div>

          {/* Trees planted emotional metric */}
          <motion.div 
            variants={itemVariants}
            key={`trees-${Math.round(treesEquivalent)}`}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-2 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span className="text-xs font-bold uppercase tracking-wider">Tree Equivalents</span>
              <Building className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-black text-[var(--text-main)]">
              <AnimatedNumber value={treesEquivalent} /> <span className="text-sm font-bold text-[var(--text-muted)]">Trees</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Mature trees absorbing carbon over a 25-yr lifespan.
            </p>
          </motion.div>

        </div>

        {/* Incentives Applied overview */}
        <motion.div 
          variants={itemVariants} 
          className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 flex flex-col gap-2 text-xs shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <span className="text-[var(--text-muted)]">Applied Incentives:</span>
              <strong className="text-[var(--text-main)]">${Math.round(totalIncentives).toLocaleString()}</strong>
            </div>
            <div className="text-[var(--text-muted)] text-right font-medium">
              {dbRebates && dbRebates.length > 0 ? (
                <span>{dbRebates.length} Regional Programs</span>
              ) : (
                <span>Incl. {federalTaxCreditPct * 100}% Federal Tax Credit</span>
              )}
            </div>
          </div>
          {dbRebates && dbRebates.length > 0 && (
            <div className="border-t border-[var(--color-border)] pt-2 mt-1 space-y-1">
              {dbRebates.map((rebate, index) => (
                <div key={rebate.id || index} className="flex justify-between text-[var(--text-muted)]">
                  <span>• {rebate.authority_name} ({rebate.technology_category})</span>
                  <span>
                    {rebate.incentive_type === 'percentage' && `${rebate.incentive_value}%`}
                    {rebate.incentive_type === 'fixed' && `$${rebate.incentive_value}`}
                    {rebate.incentive_type === 'per_watt' && `$${rebate.incentive_value}/W`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
