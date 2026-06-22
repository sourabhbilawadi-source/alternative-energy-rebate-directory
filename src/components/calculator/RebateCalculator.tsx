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

export default function RebateCalculator({
  defaultGridRate,
  defaultSunHours,
  defaultGridEmissions,
  defaultCostPerWatt,
  federalTaxCreditPct,
  stateRebate,
  utilityRebate,
  city,
  state
}: RebateCalculatorProps) {
  // Input states
  const [zipCode, setZipCode] = useState('90210');
  const [monthlyBill, setMonthlyBill] = useState(250);
  const [roofArea, setRoofArea] = useState(1200);
  const [batteryEnabled, setBatteryEnabled] = useState(false);

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
  
  // Total localized incentives
  const fedTaxCredit = capitalCost * federalTaxCreditPct;
  const totalIncentives = Math.min(capitalCost, fedTaxCredit + stateRebate + utilityRebate);
  const netSystemCost = capitalCost - totalIncentives;

  // Annual Generation (E_annual = P_sz * eta_sun)
  const annualGeneration = systemSizeCapped * sunHours; // kWh

  // Peak Avoidance Uplift through Battery Integration (Delta_peak)
  // Delta_peak = E_annual * (Phi_peak - Phi_off) * alpha_eff
  // Assuming standard TOU difference of $0.25 and 85% roundtrip efficiency
  const deltaPeak = batteryEnabled ? annualGeneration * (0.42 - 0.16) * 0.88 : 0;

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 shadow-xl"
    >
      
      {/* ----------------- LEFT PANEL: INPUT FIELDS ----------------- */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-1">Calculate Sizing & ROI</h2>
          <p className="text-sm text-[var(--text-muted)]">Configure parameters to customize the system model.</p>
        </div>

        {/* Location ZIP locator */}
        <div className="space-y-2">
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
            <input 
              type="text" 
              maxLength={5}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-3 px-4 pl-11 outline-none focus:border-[var(--color-accent)] transition-all font-semibold"
              placeholder="Enter ZIP code"
            />
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
          </div>
        </div>

        {/* Monthly Utility Bill Slider */}
        <div className="space-y-3">
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
        </div>

        {/* Usable Roof Area Slider */}
        <div className="space-y-3">
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
        </div>

        {/* Battery Storage Toggle */}
        <div className="bg-[var(--bg-primary)] p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
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
            className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${batteryEnabled ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'}`}
            aria-label="Toggle Battery Integration"
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-all duration-300 ${batteryEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Local Rate Details Card */}
        <div className="bg-[var(--bg-primary)]/50 border border-[var(--color-border)] rounded-2xl p-4 space-y-2 text-xs">
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
        </div>
      </div>

      {/* ----------------- RIGHT PANEL: DYNAMIC RESULTS ----------------- */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-1">Financial & Ecological ROI</h2>
          <p className="text-sm text-[var(--text-muted)]">Calculated results model your custom solar offsets.</p>
        </div>

        {/* Payback period large callout */}
        <div className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden">
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
            Based on a net system installation cost of <strong className="text-[var(--text-main)]">${Math.round(netSystemCost).toLocaleString()}</strong> after incentives.
          </div>
        </div>

        {/* Sizing, Savings and Carbon detail grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Recommended System Size */}
          <div className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span className="text-xs font-bold uppercase tracking-wider">System Capacity</span>
              <Sun className="w-4 h-4 text-[var(--color-accent)]" />
            </div>
            <div className="text-2xl font-black text-[var(--text-main)]">
              <AnimatedNumber value={systemSizeCapped} formatter={(v) => v.toFixed(2)} /> <span className="text-sm font-bold text-[var(--text-muted)]">kW</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Capped by {roofArea} sq ft usable roof space.
            </p>
          </div>

          {/* Capped Annual Savings */}
          <div className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-2">
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
          </div>

          {/* Annual Carbon Abatement */}
          <div className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-2">
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
          </div>

          {/* Trees planted emotional metric */}
          <div className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-2">
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
          </div>

        </div>

        {/* Incentives Applied overview */}
        <div className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <span className="text-[var(--text-muted)]">Applied Incentives:</span>
            <strong className="text-[var(--text-main)]">${Math.round(totalIncentives).toLocaleString()}</strong>
          </div>
          <div className="text-[var(--text-muted)] text-right">
            <span>Incl. {federalTaxCreditPct * 100}% Federal Tax Credit</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
