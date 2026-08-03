export interface SearchRebate {
  id: string;
  authority_name: string;
  technology_category: string;
  incentive_value: number;
  incentive_type: string;
  max_limit: number | null;
  region: {
    country_code: string;
    state_province: string;
    city: string;
    postal_code: string;
  };
}

export interface SupabaseRebateItem {
  id: string;
  authority_name: string;
  technology_category: string;
  incentive_value: string | number;
  incentive_type: string;
  max_limit: string | number | null;
  regions?: any;
}
