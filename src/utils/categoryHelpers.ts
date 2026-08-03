export interface Rebate {
  id?: string;
  slug: string;
  authority_name: string;
  technology_category?: string;
  incentive_value: number;
  incentive_type: string;
  description: string;
  is_active?: boolean;
  regions?: {
    country_code?: string;
    state_province?: string;
    city?: string;
  };
  isGrouped?: boolean;
  citiesList?: string[];
}

export function slugifyCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function formatValue(value: number, type: string, countryCode?: string) {
  const code = (countryCode || 'us').toLowerCase();
  const symbol = (code === 'de' || code === 'fr' || code === 'ie' || code === 'nl')
    ? '€'
    : (code === 'gb' || code === 'uk')
      ? '£'
      : (code === 'jp')
        ? '¥'
        : (code === 'nz')
          ? 'NZ$'
          : '$';
  if (type === 'percentage') {
    return `${value}%`;
  }
  if (type === 'per_watt') {
    return `${symbol}${value}/W`;
  }
  if (type === 'fixed') {
    return `${symbol}${value}`;
  }
  return `${symbol}${value} ${type}`;
}

export function formatCitiesText(cities: string[] = []) {
  if (cities.length <= 4) {
    return `${cities.join(', ')}`;
  }
  return `${cities.slice(0, 3).join(', ')} +${cities.length - 3} more`;
}

export function cleanDescription(desc: string, city?: string, state?: string) {
  if (!desc) return desc;

  const suffixes = [
    ` in ${city}, ${state}.`,
    ` in ${city}, ${state}`,
    ` in ${city}.`,
    ` in ${city}`
  ];

  let cleaned = desc;
  for (const suffix of suffixes) {
    if (cleaned.endsWith(suffix)) {
      cleaned = cleaned.slice(0, -suffix.length);
      break;
    }
  }

  if (cleaned.endsWith('.')) {
    cleaned = cleaned.slice(0, -1);
  }

  return cleaned;
}

export function getInCountryPhrase(countryCode: string, lang: string): string {
  const code = countryCode.toLowerCase();
  if (lang === 'de-de') {
    const mapping: Record<string, string> = {
      us: 'in den USA',
      uk: 'in Großbritannien',
      de: 'in Deutschland',
      ca: 'in Kanada',
      au: 'in Australien',
      fr: 'in Frankreich'
    };
    return mapping[code] || `in ${code.toUpperCase()}`;
  }
  if (lang === 'fr-fr') {
    const mapping: Record<string, string> = {
      us: 'aux États-Unis',
      uk: 'au Royaume-Uni',
      de: 'en Allemagne',
      ca: 'au Canada',
      au: 'en Australie',
      fr: 'en France'
    };
    return mapping[code] || `en ${code.toUpperCase()}`;
  }
  const mapping: Record<string, string> = {
    us: 'in the United States',
    uk: 'in the United Kingdom',
    de: 'in Germany',
    ca: 'in Canada',
    au: 'in Australia',
    fr: 'in France'
  };
  return mapping[code] || `in ${code.toUpperCase()}`;
}

export function getGroupedSuffix(citiesCount: number, countryCode: string, stateName: string | null, lang: string) {
  const locationPhrase = stateName ? `in ${stateName}` : getInCountryPhrase(countryCode, lang);

  if (lang === 'de-de') {
    if (stateName) {
      return `, bundeslandweit verfügbar in ${citiesCount} Städten ${locationPhrase}.`;
    }
    return `, landesweit verfügbar in ${citiesCount} Städten ${locationPhrase}.`;
  }
  if (lang === 'fr-fr') {
    if (stateName) {
      return `, disponible dans tout l'État dans ${citiesCount} villes ${locationPhrase}.`;
    }
    return `, disponible à l'échelle nationale dans ${citiesCount} villes ${locationPhrase}.`;
  }
  if (stateName) {
    return `, available state-wide across ${citiesCount} cities in ${stateName}.`;
  }
  return `, available nationwide across ${citiesCount} cities ${locationPhrase}.`;
}

export function processGroupedRebates(rebates: Rebate[], lang: string) {
  const processedGroupedRebates: Record<string, { national: Rebate[], states: Record<string, Rebate[]> }> = {};

  const countryGroups: Record<string, Rebate[]> = {};
  rebates.forEach(r => {
    const country = r.regions?.country_code === 'gb' ? 'uk' : r.regions?.country_code?.toLowerCase() || 'us';
    if (!countryGroups[country]) {
      countryGroups[country] = [];
    }
    countryGroups[country].push(r);
  });

  Object.entries(countryGroups).forEach(([countryCode, countryRebates]) => {
    const authorityCounts: Record<string, number> = {};
    countryRebates.forEach(r => {
      authorityCounts[r.authority_name] = (authorityCounts[r.authority_name] || 0) + 1;
    });

    const national: Rebate[] = [];
    const states: Record<string, Rebate[]> = {};
    const processedNames = new Set<string>();

    countryRebates.forEach(r => {
      const isRepeated = authorityCounts[r.authority_name] > 1;

      if (isRepeated) {
        if (processedNames.has(r.authority_name)) return;
        processedNames.add(r.authority_name);

        const matches = countryRebates.filter(m => m.authority_name === r.authority_name);

        const sortedMatches = [...matches].sort((a, b) => {
          const cityA = a.regions?.city || '';
          const cityB = b.regions?.city || '';
          return cityA.localeCompare(cityB);
        });
        const representative = sortedMatches[0];

        const uniqueStates = [...new Set(matches.map(m => m.regions?.state_province).filter(Boolean))];
        const uniqueCities = [...new Set(matches.map(m => m.regions?.city).filter((c): c is string => Boolean(c)))].sort((a, b) => a.localeCompare(b));

        const cleanedDesc = cleanDescription(representative.description || '', representative.regions?.city, representative.regions?.state_province);
        const stateNameForSuffix = uniqueStates.length === 1 && uniqueStates[0] ? uniqueStates[0] : null;
        const newDesc = `${cleanedDesc || ''}${getGroupedSuffix(uniqueCities.length, countryCode, stateNameForSuffix || '', lang || 'en-us')}`;

        const groupedCard = {
          ...representative,
          isGrouped: true,
          citiesList: uniqueCities as string[],
          description: newDesc
        };

        if (uniqueStates.length === 1 && uniqueStates[0]) {
          const stateName = uniqueStates[0];
          if (!states[stateName]) states[stateName] = [];
          states[stateName].push(groupedCard);
        } else {
          national.push(groupedCard);
        }
      } else {
        const stateName = r.regions?.state_province || 'National';
        if (!states[stateName]) states[stateName] = [];
        states[stateName].push({
          ...r,
          isGrouped: false
        });
      }
    });

    processedGroupedRebates[countryCode] = { national, states };
  });

  return processedGroupedRebates;
}
