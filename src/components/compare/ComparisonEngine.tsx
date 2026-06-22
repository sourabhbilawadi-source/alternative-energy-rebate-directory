import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft } from 'lucide-react';

interface CitySpecs {
  key: string;
  name: string;
  state: string;
  country: string;
  gridRate: number;
  sunHours: number;
  gridEmissions: number;
  costPerWatt: number;
  incentives: {
    federalTaxCreditPct: number;
    stateRebate: number;
    utilityRebate: number;
  };
}

export default function ComparisonEngine() {
  const cities: CitySpecs[] = [
    {
      key: 'la',
      name: 'Los Angeles',
      state: 'California',
      country: 'United States',
      gridRate: 0.28,
      sunHours: 1800,
      gridEmissions: 0.52,
      costPerWatt: 3.10,
      incentives: { federalTaxCreditPct: 0.30, stateRebate: 1500, utilityRebate: 500 }
    },
    {
      key: 'houston',
      name: 'Houston',
      state: 'Texas',
      country: 'United States',
      gridRate: 0.14,
      sunHours: 1950,
      gridEmissions: 0.82,
      costPerWatt: 2.70,
      incentives: { federalTaxCreditPct: 0.30, stateRebate: 0, utilityRebate: 400 }
    },
    {
      key: 'nyc',
      name: 'New York City',
      state: 'New York',
      country: 'United States',
      gridRate: 0.23,
      sunHours: 1250,
      gridEmissions: 0.66,
      costPerWatt: 3.25,
      incentives: { federalTaxCreditPct: 0.30, stateRebate: 1000, utilityRebate: 500 }
    },
    {
      key: 'london',
      name: 'London',
      state: 'England',
      country: 'United Kingdom',
      gridRate: 0.32,
      sunHours: 1050,
      gridEmissions: 0.40,
      costPerWatt: 3.40,
      incentives: { federalTaxCreditPct: 0.0, stateRebate: 1200, utilityRebate: 300 }
    },
    {
      key: 'berlin',
      name: 'Berlin',
      state: 'Berlin',
      country: 'Germany',
      gridRate: 0.38,
      sunHours: 1100,
      gridEmissions: 0.70,
      costPerWatt: 2.90,
      incentives: { federalTaxCreditPct: 0.0, stateRebate: 1500, utilityRebate: 400 }
    },
    {
      key: 'sydney',
      name: 'Sydney',
      state: 'New South Wales',
      country: 'Australia',
      gridRate: 0.26,
      sunHours: 2100,
      gridEmissions: 0.75,
      costPerWatt: 1.80,
      incentives: { federalTaxCreditPct: 0.0, stateRebate: 2000, utilityRebate: 800 }
    },
    {
      key: 'toronto',
      name: 'Toronto',
      state: 'Ontario',
      country: 'Canada',
      gridRate: 0.16,
      sunHours: 1300,
      gridEmissions: 0.12,
      costPerWatt: 2.80,
      incentives: { federalTaxCreditPct: 0.0, stateRebate: 2500, utilityRebate: 600 }
    }
  ];

  const [cityAKey, setCityAKey] = useState('la');
  const [cityBKey, setCityBKey] = useState('houston');
  const [monthlyBill, setMonthlyBill] = useState(250);
  const [roofArea, setRoofArea] = useState(1200);

  const cityA = cities.find(c => c.key === cityAKey) || cities[0];
  const cityB = cities.find(c => c.key === cityBKey) || cities[1];

  // Helper to compute ROI parameters
  const calculateROI = (city: CitySpecs) => {
    const systemSizeIdeal = (12 * monthlyBill) / (city.gridRate * city.sunHours);
    const systemSizeCapped = Math.min(roofArea / 150, systemSizeIdeal);
    const capitalCost = systemSizeCapped * 1000 * city.costPerWatt;
    
    // Incentives
    const fedCreditVal = capitalCost * city.incentives.federalTaxCreditPct;
    const totalIncentives = Math.min(capitalCost, fedCreditVal + city.incentives.stateRebate + city.incentives.utilityRebate);
    const netCost = capitalCost - totalIncentives;

    // Generation & Savings
    const annualGeneration = systemSizeCapped * city.sunHours;
    const annualSavings = annualGeneration * city.gridRate;
    const payback = annualSavings > 0 ? Math.max(0.5, netCost / annualSavings) : 0;

    // Ecological
    const carbonAbated = (systemSizeCapped * city.sunHours * city.gridEmissions) / 2000;

    return {
      size: systemSizeCapped,
      cost: netCost,
      savings: annualSavings,
      payback,
      carbon: carbonAbated
    };
  };

  const roiA = calculateROI(cityA);
  const roiB = calculateROI(cityB);

  return (
    <div className="space-y-8">
      {/* Parameters Panel */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-[var(--text-main)]">Average Monthly Utility Bill</span>
            <span className="text-[var(--color-accent)] text-lg font-bold">${monthlyBill}</span>
          </div>
          <input 
            type="range" min="50" max="1000" step="10" value={monthlyBill} 
            onChange={(e) => setMonthlyBill(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--color-border)] accent-[var(--color-accent)]"
          />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-[var(--text-main)]">Usable Roof Area</span>
            <span className="text-[var(--color-accent)] text-lg font-bold">{roofArea} sq ft</span>
          </div>
          <input 
            type="range" min="100" max="5000" step="50" value={roofArea} 
            onChange={(e) => setRoofArea(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--color-border)] accent-[var(--color-accent)]"
          />
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[var(--bg-primary)] border border-[var(--color-border)] p-6 rounded-3xl shadow-sm">
        <div className="w-full md:w-2/5 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Region A</label>
          <select 
            value={cityAKey} 
            onChange={(e) => setCityAKey(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--color-border)] text-[var(--text-main)] font-semibold rounded-xl py-3 px-4 outline-none focus:border-[var(--color-accent)]"
          >
            {cities.map(c => <option key={c.key} value={c.key} disabled={c.key === cityBKey}>{c.name} ({c.state})</option>)}
          </select>
        </div>

        <div className="p-3 bg-[var(--bg-secondary)] rounded-full border border-[var(--color-border)] shadow-sm text-[var(--text-muted)]">
          <ArrowRightLeft className="w-5 h-5" />
        </div>

        <div className="w-full md:w-2/5 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Region B</label>
          <select 
            value={cityBKey} 
            onChange={(e) => setCityBKey(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--color-border)] text-[var(--text-main)] font-semibold rounded-xl py-3 px-4 outline-none focus:border-[var(--color-accent)]"
          >
            {cities.map(c => <option key={c.key} value={c.key} disabled={c.key === cityAKey}>{c.name} ({c.state})</option>)}
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Region A Column */}
        <motion.div 
          key={`colA-${cityAKey}`}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 bg-[var(--bg-secondary)]/30 border border-[var(--color-border)] rounded-3xl p-6 space-y-6 flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-bold text-[var(--text-muted)] tracking-widest uppercase">{cityA.country}</div>
            <h2 className="text-3xl font-black text-[var(--text-main)] mt-1">{cityA.name}</h2>
            <p className="text-sm text-[var(--text-muted)]">{cityA.state}</p>
          </div>

          <div className="space-y-4 my-6">
            <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
              <span className="text-xs font-bold text-[var(--text-muted)]">Payback Timeline:</span>
              <span className="text-xl font-extrabold text-[var(--text-main)]">{roiA.payback.toFixed(1)} yrs</span>
            </div>
            <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
              <span className="text-xs font-bold text-[var(--text-muted)]">Net Installation Cost:</span>
              <span className="text-xl font-extrabold text-[var(--text-main)]">${Math.round(roiA.cost).toLocaleString()}</span>
            </div>
            <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
              <span className="text-xs font-bold text-[var(--text-muted)]">Annual bill savings:</span>
              <span className="text-xl font-extrabold text-[var(--text-main)]">${Math.round(roiA.savings).toLocaleString()}</span>
            </div>
            <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
              <span className="text-xs font-bold text-[var(--text-muted)]">System Size Capped:</span>
              <span className="text-xl font-extrabold text-[var(--text-main)]">{roiA.size.toFixed(2)} kW</span>
            </div>
            <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
              <span className="text-xs font-bold text-[var(--text-muted)]">Annual Carbon Abatement:</span>
              <span className="text-xl font-extrabold text-[var(--text-main)]">{roiA.carbon.toFixed(1)} Tons</span>
            </div>
          </div>

          <div className="bg-[var(--bg-primary)]/40 p-4 rounded-2xl border border-[var(--color-border)] text-xs space-y-1">
            <div className="font-bold mb-1 text-[var(--text-main)]">Regional Policy Specs:</div>
            <div className="text-[var(--text-muted)]">Grid Rate: <strong>${cityA.gridRate}/kWh</strong></div>
            <div className="text-[var(--text-muted)]">Resource Hours: <strong>{cityA.sunHours} hrs/yr</strong></div>
            <div className="text-[var(--text-muted)]">Tax Credit: <strong>{cityA.incentives.federalTaxCreditPct * 100}%</strong></div>
          </div>
        </motion.div>

        {/* Mid comparison matrix indicators */}
        <div className="lg:col-span-2 flex flex-col justify-center items-center gap-6 py-6 text-center">
          <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Comparison Metrics</div>
          
          <div className="space-y-8 w-full px-4">
            <div className="border-b border-[var(--color-border)] pb-2">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Faster Payback</div>
              <div className="text-sm font-black text-[var(--color-accent)] mt-1">
                {roiA.payback < roiB.payback ? cityA.name : cityB.name}
              </div>
            </div>

            <div className="border-b border-[var(--color-border)] pb-2">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Lower Net Cost</div>
              <div className="text-sm font-black text-[var(--color-accent)] mt-1">
                {roiA.cost < roiB.cost ? cityA.name : cityB.name}
              </div>
            </div>

            <div className="border-b border-[var(--color-border)] pb-2">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase">More CO₂ Abated</div>
              <div className="text-sm font-black text-[var(--color-accent)] mt-1">
                {roiA.carbon > roiB.carbon ? cityA.name : cityB.name}
              </div>
            </div>
          </div>
        </div>

        {/* Region B Column */}
        <motion.div 
          key={`colB-${cityBKey}`}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 bg-[var(--bg-secondary)]/30 border border-[var(--color-border)] rounded-3xl p-6 space-y-6 flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-bold text-[var(--text-muted)] tracking-widest uppercase">{cityB.country}</div>
            <h2 className="text-3xl font-black text-[var(--text-main)] mt-1">{cityB.name}</h2>
            <p className="text-sm text-[var(--text-muted)]">{cityB.state}</p>
          </div>

          <div className="space-y-4 my-6">
            <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
              <span className="text-xs font-bold text-[var(--text-muted)]">Payback Timeline:</span>
              <span className="text-xl font-extrabold text-[var(--text-main)]">{roiB.payback.toFixed(1)} yrs</span>
            </div>
            <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
              <span className="text-xs font-bold text-[var(--text-muted)]">Net Installation Cost:</span>
              <span className="text-xl font-extrabold text-[var(--text-main)]">${Math.round(roiB.cost).toLocaleString()}</span>
            </div>
            <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
              <span className="text-xs font-bold text-[var(--text-muted)]">Annual bill savings:</span>
              <span className="text-xl font-extrabold text-[var(--text-main)]">${Math.round(roiB.savings).toLocaleString()}</span>
            </div>
            <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
              <span className="text-xs font-bold text-[var(--text-muted)]">System Size Capped:</span>
              <span className="text-xl font-extrabold text-[var(--text-main)]">{roiB.size.toFixed(2)} kW</span>
            </div>
            <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
              <span className="text-xs font-bold text-[var(--text-muted)]">Annual Carbon Abatement:</span>
              <span className="text-xl font-extrabold text-[var(--text-main)]">{roiB.carbon.toFixed(1)} Tons</span>
            </div>
          </div>

          <div className="bg-[var(--bg-primary)]/40 p-4 rounded-2xl border border-[var(--color-border)] text-xs space-y-1">
            <div className="font-bold mb-1 text-[var(--text-main)]">Regional Policy Specs:</div>
            <div className="text-[var(--text-muted)]">Grid Rate: <strong>${cityB.gridRate}/kWh</strong></div>
            <div className="text-[var(--text-muted)]">Resource Hours: <strong>{cityB.sunHours} hrs/yr</strong></div>
            <div className="text-[var(--text-muted)]">Tax Credit: <strong>{cityB.incentives.federalTaxCreditPct * 100}%</strong></div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
