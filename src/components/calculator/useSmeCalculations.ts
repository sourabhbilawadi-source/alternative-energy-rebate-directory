export interface SmeCalculationsProps {
  financeModel: 'purchase' | 'ppa' | 'lease';
  facilityArea: number;
  monthlyKwh: number;
  gridRate: number;
  sunHours: number;
  gridEmissions: number;
  costPerWattVal: number;
  isMetric: boolean;
}

export function useSmeCalculations({
  financeModel,
  facilityArea,
  monthlyKwh,
  gridRate,
  sunHours,
  gridEmissions,
  costPerWattVal,
  isMetric,
}: SmeCalculationsProps) {
  // Commercial scale cost discounts (15% discount for enterprise sizes)
  const costPerWatt = costPerWattVal * 0.85;

  // Commercial sizing calculations
  // Max capacity based on usable rooftop area (approx 120 sq ft per kW commercial panels)
  const facilityAreaSqFt = isMetric ? facilityArea * 10.764 : facilityArea;
  const capacityFromRoof = facilityAreaSqFt / 120; // kW

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
      return { netCost, annualSavings, payback, firstYearROI, ppaRate, monthlyLease: undefined };
    } else if (financeModel === 'lease') {
      // Lease: $0 down, pay fixed monthly rent (approx $16/kW per month)
      const monthlyLease = systemSize * 16;
      const netCost = 0;
      const annualSavings = (annualGeneration * gridRate) - (monthlyLease * 12);
      const payback = 0; // Immediate savings
      const firstYearROI = 100;
      return { netCost, annualSavings, payback, firstYearROI, ppaRate: undefined, monthlyLease };
    } else {
      // Direct Purchase: full capital, claims 30% Federal ITC + MACRS Depreciation tax shield (NPV approx 18% of gross cost)
      const federalITC = capitalCost * 0.30;
      const macrsBenefit = capitalCost * 0.18;
      const stateCommercialGrant = 5000;
      const netCost = Math.max(0, capitalCost - federalITC - macrsBenefit - stateCommercialGrant);
      const annualSavings = annualGeneration * gridRate;
      const payback = annualSavings > 0 ? netCost / annualSavings : 0;
      const firstYearROI = netCost > 0 ? (annualSavings / netCost) * 100 : 100;
      return { netCost, annualSavings, payback, firstYearROI, ppaRate: undefined, monthlyLease: undefined };
    }
  };

  const metrics = getFinancingMetrics();

  // Dynamic commercial yield/savings evaluation
  const getYieldTier = () => {
    if (financeModel === 'ppa' || financeModel === 'lease') {
      return {
        label: 'Instant Savings',
        className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      };
    }

    const payback = metrics.payback;
    if (payback === 0) return { label: 'No Savings', className: 'bg-red-500/10 text-red-500' };
    if (payback < 4) {
      return {
        label: 'Excellent Yield',
        className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      };
    } else if (payback >= 4 && payback <= 7) {
      return {
        label: 'High Yield',
        className: 'bg-green-500/10 text-green-600 dark:text-green-400'
      };
    } else if (payback > 7 && payback <= 10) {
      return {
        label: 'Moderate Yield',
        className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
      };
    } else {
      return {
        label: 'Slow Yield',
        className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
      };
    }
  };
  const yieldTier = getYieldTier();

  // Carbon Abatement Scope 2 equivalents
  const carbonTons = isMetric
    ? (annualGeneration * gridEmissions) / 1000
    : (annualGeneration * gridEmissions) / 907.185;
  const equivalentCars = carbonTons * 0.22;
  const equivalentCoal = carbonTons * 0.96;
  const equivalentForest = isMetric ? (carbonTons * 1.2 * 0.4047) : (carbonTons * 1.2);

  return {
    costPerWatt,
    systemSize,
    annualGeneration,
    metrics,
    yieldTier,
    carbonTons,
    equivalentCars,
    equivalentCoal,
    equivalentForest,
  };
}
