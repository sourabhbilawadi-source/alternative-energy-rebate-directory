import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Info } from 'lucide-react';
import { useTranslations } from '../../lib/i18n';
import { regionsData } from '../../data/regions';

interface DatabaseRebate {
  id: string;
  authority_name: string;
  technology_category: string;
  incentive_value: number;
  incentive_type: string;
  max_limit: number | null;
}

interface CitySpecs {
  key: string;
  name: string;
  state: string;
  country: string;
  countryCode: string;
  gridRate: number;
  sunHours: number;
  gridEmissions: number;
  costPerWatt: number;
  rebates: DatabaseRebate[];
  hasActiveRebates: boolean;
}

const getCountryConfig = (code: string) => {
  const c = code.toLowerCase();
  switch (c) {
    case 'de':
    case 'fr':
    case 'ie':
    case 'nl':
      return { symbol: '€', area: 'm²', carbon: 't', isMetric: true };
    case 'uk':
      return { symbol: '£', area: 'm²', carbon: 't', isMetric: true };
    case 'au':
      return { symbol: 'A$', area: 'm²', carbon: 't', isMetric: true };
    case 'ca':
      return { symbol: 'C$', area: 'm²', carbon: 't', isMetric: true };
    case 'nz':
      return { symbol: 'NZ$', area: 'm²', carbon: 't', isMetric: true };
    case 'jp':
      return { symbol: '¥', area: 'm²', carbon: 't', isMetric: true };
    default:
      return { symbol: '$', area: 'sq ft', carbon: 'Tons', isMetric: false };
  }
};

const matchCountry = (c1: string, c2: string) => {
  const cc1 = c1.toLowerCase();
  const cc2 = c2.toLowerCase();
  return cc1 === cc2 || (cc1 === 'gb' && cc2 === 'uk') || (cc1 === 'uk' && cc2 === 'gb');
};

export default function ComparisonEngine({ 
  lang = 'en-us', 
  databaseRebates = [] 
}: { 
  lang?: string; 
  databaseRebates?: any[];
}) {
  const t = useTranslations(lang);

  const initialCities: CitySpecs[] = regionsData
    .filter(r => r.gridRate !== null)
    .map(r => {
      const matchedRebates = databaseRebates
        .filter((dbR: any) => {
          const reg = dbR.regions;
          if (!reg) return false;
          const countryMatch = matchCountry(reg.country_code, r.countryCode);
          const cityMatch = reg.city.toLowerCase() === r.cityName.toLowerCase() ||
                            reg.city.toLowerCase().replace(/\s+/g, '-') === r.citySlug.toLowerCase();
          return countryMatch && cityMatch;
        })
        .map((dbR: any) => ({
          id: dbR.id,
          authority_name: dbR.authority_name,
          technology_category: dbR.technology_category,
          incentive_value: Number(dbR.incentive_value),
          incentive_type: dbR.incentive_type,
          max_limit: dbR.max_limit ? Number(dbR.max_limit) : null
        }));

      return {
        key: r.citySlug,
        name: r.cityName,
        state: r.stateName,
        country: r.countryName,
        countryCode: r.countryCode,
        gridRate: r.gridRate!,
        sunHours: r.sunHours!,
        gridEmissions: r.gridEmissions!,
        costPerWatt: r.costPerWatt!,
        rebates: matchedRebates,
        hasActiveRebates: matchedRebates.length > 0
      };
    });

  const [cities, setCities] = useState<CitySpecs[]>(initialCities);
  const [cityAKey, setCityAKey] = useState('los-angeles');
  const [cityBKey, setCityBKey] = useState('houston');
  const [monthlyBill, setMonthlyBill] = useState(250);
  
  const cityA = cities.find(c => c.key === cityAKey) || cities[0];
  const cityB = cities.find(c => c.key === cityBKey) || cities[1];
  
  const configA = getCountryConfig(cityA.countryCode);
  const configB = getCountryConfig(cityB.countryCode);

  const [roofArea, setRoofArea] = useState(configA.isMetric ? 120 : 1200);

  // Adjust roof area default if City A's country changes
  useEffect(() => {
    if (configA.isMetric && roofArea > 1000) {
      setRoofArea(120);
    } else if (!configA.isMetric && roofArea < 500) {
      setRoofArea(1200);
    }
  }, [cityAKey]);

  // Sync custom regions created via Admin panel
  useEffect(() => {
    try {
      const localRegionsRaw = localStorage.getItem('local_regions');
      if (localRegionsRaw) {
        const localRegions = JSON.parse(localRegionsRaw);
        const formattedLocal: CitySpecs[] = localRegions.map((r: any) => ({
          key: `local-${r.id}`,
          name: r.city,
          state: r.state_province,
          country: r.country_code.toUpperCase(),
          countryCode: r.country_code,
          gridRate: Number(r.grid_rate),
          sunHours: Number(r.sun_hours),
          gridEmissions: Number(r.grid_emissions),
          costPerWatt: Number(r.cost_per_watt),
          rebates: [],
          hasActiveRebates: false
        }));

        const merged = [...initialCities];
        formattedLocal.forEach(localCity => {
          if (!merged.some(c => c.name.toLowerCase() === localCity.name.toLowerCase())) {
            merged.push(localCity);
          }
        });
        setCities(merged);
      }
    } catch (e) {
      console.error('Failed to parse local regions in ComparisonEngine:', e);
    }
  }, []);

  // Helper to compute ROI parameters
  const calculateROI = (city: CitySpecs) => {
    const config = getCountryConfig(city.countryCode);
    const systemSizeIdeal = (12 * monthlyBill) / (city.gridRate * city.sunHours);
    
    // Slider is in City A's local unit (m² if configA.isMetric, else sq ft)
    const roofAreaSqFt = configA.isMetric ? roofArea * 10.764 : roofArea;
    const systemSizeCapped = Math.min(roofAreaSqFt / 150, systemSizeIdeal);
    const systemSizeWatts = systemSizeCapped * 1000;
    const capitalCost = systemSizeWatts * city.costPerWatt;
    
    let upfrontIncentives = 0;
    let taxSavings = 0;

    for (const rebate of city.rebates) {
      let rebateVal = 0;
      if (rebate.incentive_type === 'percentage') {
        if (rebate.technology_category !== 'Clean Energy Loan') {
          rebateVal = capitalCost * (rebate.incentive_value / 100);
        }
      } else if (rebate.incentive_type === 'per_watt') {
        rebateVal = systemSizeWatts * rebate.incentive_value;
      } else if (rebate.incentive_type === 'fixed') {
        rebateVal = rebate.incentive_value;
      }

      if (rebate.max_limit !== null && rebate.max_limit > 0) {
        rebateVal = Math.min(rebateVal, rebate.max_limit);
      }

      // Classify based on technology_category
      const cat = rebate.technology_category;
      if (['Tax Exemption', 'Sales Tax Incentive', 'Federal Tax Incentive', 'Property Tax Offset'].includes(cat)) {
        taxSavings += rebateVal;
      } else if (cat !== 'Clean Energy Loan') {
        upfrontIncentives += rebateVal;
      }
    }

    upfrontIncentives = Math.min(capitalCost, upfrontIncentives);
    const netCost = capitalCost - upfrontIncentives;

    // Generation & Savings
    const annualGeneration = systemSizeCapped * city.sunHours;
    const annualSavings = annualGeneration * city.gridRate;
    const payback = annualSavings > 0 ? Math.max(0.5, netCost / annualSavings) : 0;

    // Ecological
    const carbonAbated = config.isMetric 
      ? (systemSizeCapped * city.sunHours * city.gridEmissions) / 1000
      : (systemSizeCapped * city.sunHours * city.gridEmissions) / 907.185;

    return {
      size: systemSizeCapped,
      cost: netCost,
      savings: annualSavings,
      payback,
      carbon: carbonAbated,
      taxSavings
    };
  };

  const getFedTaxCreditPct = (city: CitySpecs) => {
    return city.rebates
      .filter(r => r.incentive_type === 'percentage' && ['Federal Tax Incentive', 'Tax Exemption'].includes(r.technology_category))
      .reduce((sum, r) => sum + r.incentive_value, 0);
  };

  const roiA = calculateROI(cityA);
  const roiB = calculateROI(cityB);

  return (
    <div className="space-y-8">
      {/* Parameters Panel */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-[var(--text-main)]">{t.calculator.monthlyBill}</span>
            <span className="text-[var(--color-accent)] text-lg font-bold">{configA.symbol}{monthlyBill}</span>
          </div>
          <input 
            type="range" 
            min="50" 
            max="1500" 
            step="10" 
            value={monthlyBill} 
            onChange={(e) => setMonthlyBill(Number(e.target.value))}
            className="w-full h-1.5 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)] outline-none"
          />
          <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-bold uppercase">
            <span>{configA.symbol}50</span>
            <span>{configA.symbol}1,500</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-[var(--text-main)]">{t.calculator.roofArea}</span>
            <span className="text-[var(--color-accent)] text-lg font-bold">{roofArea} {configA.area}</span>
          </div>
          <input 
            type="range" 
            min={configA.isMetric ? "20" : "200"} 
            max={configA.isMetric ? "500" : "5000"} 
            step={configA.isMetric ? "5" : "50"} 
            value={roofArea} 
            onChange={(e) => setRoofArea(Number(e.target.value))}
            className="w-full h-1.5 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)] outline-none"
          />
          <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-bold uppercase">
            <span>{configA.isMetric ? "20 m²" : "200 sq ft"}</span>
            <span>{configA.isMetric ? "500 m²" : "5,000 sq ft"}</span>
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[var(--bg-secondary)]/50 border border-[var(--color-border)] rounded-3xl p-6 shadow-sm">
        <div className="w-full md:w-2/5 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Region A</label>
          <select 
            value={cityAKey} 
            onChange={(e) => setCityAKey(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--color-border)] text-[var(--text-main)] font-semibold rounded-xl py-3 px-4 outline-none focus:border-[var(--color-accent)] cursor-pointer"
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
            className="w-full bg-[var(--bg-secondary)] border border-[var(--color-border)] text-[var(--text-main)] font-semibold rounded-xl py-3 px-4 outline-none focus:border-[var(--color-accent)] cursor-pointer"
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
            <p className="text-sm text-[var(--text-muted)] font-semibold">{cityA.state}</p>
          </div>

          {!cityA.hasActiveRebates ? (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-2xl p-5 my-6 text-center space-y-2 flex flex-col items-center justify-center flex-grow">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-bold text-sm text-[var(--text-main)]">No Rebate Data Available</h3>
              <p className="text-[11px] text-[var(--text-muted)] max-w-[200px] leading-relaxed">
                No rebate data available for this location yet. Payback and ROI calculations are disabled.
              </p>
            </div>
          ) : (
            <div className="space-y-4 my-6 font-semibold">
              <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-muted)]">{t.calculator.paybackPeriod}:</span>
                <span className="text-xl font-extrabold text-[var(--text-main)]">{roiA.payback.toFixed(1)} {t.calculator.years}</span>
              </div>
              <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-muted)]">{t.calculator.netCost}:</span>
                <span className="text-xl font-extrabold text-[var(--text-main)]">{configA.symbol}{Math.round(roiA.cost).toLocaleString()}</span>
              </div>
              {roiA.taxSavings > 0 && (
                <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-dashed border-[var(--color-accent)]/40 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[var(--color-accent)]">{t.calculator.taxSavings}:</span>
                    <div className="relative group inline-block">
                      <Info className="w-3.5 h-3.5 cursor-help text-[var(--color-accent)]/70 hover:text-[var(--color-accent)] transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[var(--bg-secondary)] border border-[var(--color-border)] text-[var(--text-muted)] text-[10px] rounded-lg p-2.5 w-56 shadow-xl z-20 leading-relaxed font-normal text-left">
                        {t.calculator.taxSavingsTooltip}
                      </div>
                    </div>
                  </div>
                  <span className="text-xl font-extrabold text-[var(--color-accent)]">{configA.symbol}{Math.round(roiA.taxSavings).toLocaleString()}</span>
                </div>
              )}
              <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-muted)] font-semibold">Annual bill savings:</span>
                <span className="text-xl font-extrabold text-[var(--text-main)]">{configA.symbol}{Math.round(roiA.savings).toLocaleString()}</span>
              </div>
              <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-muted)]">System Size Capped:</span>
                <span className="text-xl font-extrabold text-[var(--text-main)]">{roiA.size.toFixed(2)} kW</span>
              </div>
              <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-muted)]">{t.calculator.carbonOffset}:</span>
                <span className="text-xl font-extrabold text-[var(--text-main)]">{roiA.carbon.toFixed(1)} {configA.carbon}</span>
              </div>
            </div>
          )}

          <div className="bg-[var(--bg-primary)]/40 p-4 rounded-2xl border border-[var(--color-border)] text-xs space-y-1">
            <div className="font-bold mb-1 text-[var(--text-main)]">Regional Policy Specs:</div>
            <div className="text-[var(--text-muted)] font-semibold">{t.calculator.gridRate}: <strong>{configA.symbol}{cityA.gridRate}/kWh</strong></div>
            <div className="text-[var(--text-muted)] font-semibold">{t.calculator.sunHours}: <strong>{cityA.sunHours} hrs/yr</strong></div>
            <div className="text-[var(--text-muted)] font-semibold">{t.calculator.federalIncentive}: <strong>{getFedTaxCreditPct(cityA)}%</strong></div>
          </div>
        </motion.div>

        {/* Mid comparison matrix indicators */}
        <div className="lg:col-span-2 flex flex-col justify-center items-center gap-6 py-6 text-center">
          <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Comparison Metrics</div>
          
          <div className="space-y-8 w-full px-4 font-semibold">
            <div className="border-b border-[var(--color-border)] pb-2">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Faster Payback</div>
              <div className="text-sm font-black text-[var(--color-accent)] mt-1">
                {!cityA.hasActiveRebates || !cityB.hasActiveRebates ? 'N/A' : (roiA.payback < roiB.payback ? cityA.name : cityB.name)}
              </div>
            </div>

            <div className="border-b border-[var(--color-border)] pb-2">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Lower Net Cost</div>
              <div className="text-sm font-black text-[var(--color-accent)] mt-1">
                {!cityA.hasActiveRebates || !cityB.hasActiveRebates ? 'N/A' : (roiA.cost < roiB.cost ? cityA.name : cityB.name)}
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
            <p className="text-sm text-[var(--text-muted)] font-semibold">{cityB.state}</p>
          </div>

          {!cityB.hasActiveRebates ? (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-2xl p-5 my-6 text-center space-y-2 flex flex-col items-center justify-center flex-grow">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-bold text-sm text-[var(--text-main)]">No Rebate Data Available</h3>
              <p className="text-[11px] text-[var(--text-muted)] max-w-[200px] leading-relaxed">
                No rebate data available for this location yet. Payback and ROI calculations are disabled.
              </p>
            </div>
          ) : (
            <div className="space-y-4 my-6 font-semibold">
              <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-muted)]">{t.calculator.paybackPeriod}:</span>
                <span className="text-xl font-extrabold text-[var(--text-main)]">{roiB.payback.toFixed(1)} {t.calculator.years}</span>
              </div>
              <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-muted)]">{t.calculator.netCost}:</span>
                <span className="text-xl font-extrabold text-[var(--text-main)]">{configB.symbol}{Math.round(roiB.cost).toLocaleString()}</span>
              </div>
              {roiB.taxSavings > 0 && (
                <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-dashed border-[var(--color-accent)]/40 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[var(--color-accent)]">{t.calculator.taxSavings}:</span>
                    <div className="relative group inline-block">
                      <Info className="w-3.5 h-3.5 cursor-help text-[var(--color-accent)]/70 hover:text-[var(--color-accent)] transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[var(--bg-secondary)] border border-[var(--color-border)] text-[var(--text-muted)] text-[10px] rounded-lg p-2.5 w-56 shadow-xl z-20 leading-relaxed font-normal text-left">
                        {t.calculator.taxSavingsTooltip}
                      </div>
                    </div>
                  </div>
                  <span className="text-xl font-extrabold text-[var(--color-accent)]">{configB.symbol}{Math.round(roiB.taxSavings).toLocaleString()}</span>
                </div>
              )}
              <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-muted)] font-semibold">Annual bill savings:</span>
                <span className="text-xl font-extrabold text-[var(--text-main)]">{configB.symbol}{Math.round(roiB.savings).toLocaleString()}</span>
              </div>
              <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-muted)]">System Size Capped:</span>
                <span className="text-xl font-extrabold text-[var(--text-main)]">{roiB.size.toFixed(2)} kW</span>
              </div>
              <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-muted)]">{t.calculator.carbonOffset}:</span>
                <span className="text-xl font-extrabold text-[var(--text-main)]">{roiB.carbon.toFixed(1)} {configB.carbon}</span>
              </div>
            </div>
          )}

          <div className="bg-[var(--bg-primary)]/40 p-4 rounded-2xl border border-[var(--color-border)] text-xs space-y-1">
            <div className="font-bold mb-1 text-[var(--text-main)]">Regional Policy Specs:</div>
            <div className="text-[var(--text-muted)] font-semibold">{t.calculator.gridRate}: <strong>{configB.symbol}{cityB.gridRate}/kWh</strong></div>
            <div className="text-[var(--text-muted)] font-semibold">{t.calculator.sunHours}: <strong>{cityB.sunHours} hrs/yr</strong></div>
            <div className="text-[var(--text-muted)] font-semibold">{t.calculator.federalIncentive}: <strong>{getFedTaxCreditPct(cityB)}%</strong></div>
          </div>
        </motion.div>

      </div>

      {/* Policy Footnote */}
      <div className="bg-[var(--bg-secondary)]/50 border border-[var(--color-border)] rounded-2xl p-4 text-xs text-[var(--text-muted)] leading-relaxed">
        <strong>Note on US Federal Tax Credits (2026):</strong> Residential payback calculations default to homeowner-purchased systems (direct cash/loan purchase) where the 30% federal tax credit (Section 25D) has ended as of Dec 31, 2025. Third-party owned residential systems (leases/PPAs) or commercial systems claiming under Section 48 may still qualify for a 30% credit.
      </div>
    </div>
  );
}
