import type { SearchRebate } from './types';

export const categories = ['all', 'solar', 'battery', 'heat pump', 'utility', 'tax', 'rebate'];

export const getCategoryLabel = (cat: string, lang: string, t: any) => {
  if (cat === 'all') return t.search.allCategories;
  if (lang === 'de-de') {
    if (cat === 'solar') return 'Solar';
    if (cat === 'battery') return 'Batterie';
    if (cat === 'heat pump') return 'Wärmepumpe';
    if (cat === 'utility') return 'Versorger';
    if (cat === 'tax') return 'Steuern';
    if (cat === 'rebate') return 'Zuschüsse';
  }
  if (lang === 'fr-fr') {
    if (cat === 'solar') return 'Solaire';
    if (cat === 'battery') return 'Batterie';
    if (cat === 'heat pump') return 'Pompe à chaleur';
    if (cat === 'utility') return 'Réseau';
    if (cat === 'tax') return 'Impôts';
    if (cat === 'rebate') return 'Subventions';
  }
  if (cat === 'heat pump') return 'Heat Pump';
  return cat;
};

export const filterRebates = (
  rebates: SearchRebate[],
  query: string,
  postalQuery: string,
  selectedCategory: string,
  selectedCountry: string
) => {
  return rebates.filter((item) => {
    // 1. Text Search matching authority, technology, city, state, or postal code
    const searchStr = `${item.authority_name} ${item.technology_category} ${item.region.city} ${item.region.state_province} ${item.region.postal_code}`.toLowerCase();
    const textMatches = searchStr.includes(query.toLowerCase());

    // 2. Postal Code specific filtering
    const postalMatches = postalQuery === '' || item.region.postal_code.toLowerCase().includes(postalQuery.toLowerCase().trim());

    // 3. Category Filter
    let catMatches = true;
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'rebate') {
        const catStr = `${item.technology_category} ${item.authority_name}`.toLowerCase();
        catMatches = catStr.includes('rebate') || catStr.includes('grant') || catStr.includes('subsidy');
      } else {
        catMatches = item.technology_category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                     item.authority_name.toLowerCase().includes(selectedCategory.toLowerCase());
      }
    }

    // 4. Country Filter
    let countryMatches = true;
    if (selectedCountry !== 'all') {
      const itemCountry = item.region.country_code.toLowerCase() === 'gb' ? 'uk' : item.region.country_code.toLowerCase();
      countryMatches = itemCountry === selectedCountry.toLowerCase();
    }

    return textMatches && postalMatches && catMatches && countryMatches;
  });
};

export const getCategoryCount = (
  category: string,
  rebates: SearchRebate[],
  query: string,
  postalQuery: string,
  selectedCountry: string
) => {
  let tempFiltered = rebates.filter((item) => {
    const searchStr = `${item.authority_name} ${item.technology_category} ${item.region.city} ${item.region.state_province} ${item.region.postal_code}`.toLowerCase();
    const textMatches = searchStr.includes(query.toLowerCase());
    const postalMatches = postalQuery === '' || item.region.postal_code.toLowerCase().includes(postalQuery.toLowerCase().trim());

    let countryMatches = true;
    if (selectedCountry !== 'all') {
      const itemCountry = item.region.country_code.toLowerCase() === 'gb' ? 'uk' : item.region.country_code.toLowerCase();
      countryMatches = itemCountry === selectedCountry.toLowerCase();
    }

    return textMatches && postalMatches && countryMatches;
  });

  if (category === 'all') return tempFiltered.length;

  if (category === 'rebate') {
    return tempFiltered.filter((item) => {
      const catStr = `${item.technology_category} ${item.authority_name}`.toLowerCase();
      return catStr.includes('rebate') || catStr.includes('grant') || catStr.includes('subsidy');
    }).length;
  }

  return tempFiltered.filter((item) => {
    return item.technology_category.toLowerCase().includes(category.toLowerCase()) ||
           item.authority_name.toLowerCase().includes(category.toLowerCase());
  }).length;
};
