import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { SearchRebate, SupabaseRebateItem } from './types';

export function useSearchData(initialRebates: SearchRebate[]) {
  const [rebates, setRebates] = useState<SearchRebate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      // Use the server-fetched rebates as the base list
      let fetchedRebates = [...initialRebates];

      // If server-fetched list is empty, try fetching from Supabase client-side
      if (fetchedRebates.length === 0) {
        if (supabase) {
          try {
            const { data: rebatesData, error } = await supabase
              .from('rebates')
              .select(`
                id,
                authority_name,
                technology_category,
                incentive_value,
                incentive_type,
                max_limit,
                regions (
                  country_code,
                  state_province,
                  city,
                  postal_code
                )
              `)
              .eq('is_active', true);

            if (rebatesData && !error) {
              fetchedRebates = (rebatesData as any[]).map((item: SupabaseRebateItem) => ({
                id: item.id,
                authority_name: item.authority_name,
                technology_category: item.technology_category,
                incentive_value: Number(item.incentive_value),
                incentive_type: item.incentive_type,
                max_limit: item.max_limit ? Number(item.max_limit) : null,
                region: {
                  country_code: (item.regions as any)?.country_code || 'us',
                  state_province: (item.regions as any)?.state_province || '',
                  city: (item.regions as any)?.city || '',
                  postal_code: (item.regions as any)?.postal_code || ''
                }
              }));
            }
          } catch (err) {
            console.error('Failed to query search database from Supabase client:', err);
          }
        }
      }

      // Merge localstorage additions/modifications (Admin Sandbox additions)
      try {
        const localRegionsRaw = localStorage.getItem('local_regions');
        const localRebatesRaw = localStorage.getItem('local_rebates');
        if (localRebatesRaw) {
          const localRegions = localRegionsRaw ? JSON.parse(localRegionsRaw) : [];
          const localRebates = JSON.parse(localRebatesRaw);

          const regionMap = new Map<string, any>(localRegions.map((r: any) => [String(r.id), r]));
          const formattedLocalRebates = localRebates
            .filter((item: any) => item.is_active !== false)
            .map((item: any) => {
              const matchedRegion = regionMap.get(String(item.region_id)) as any;
              return {
                id: item.id || `local-${Math.random()}`,
                authority_name: item.authority_name,
                technology_category: item.technology_category,
                incentive_value: Number(item.incentive_value),
                incentive_type: item.incentive_type,
                max_limit: item.max_limit ? Number(item.max_limit) : null,
                region: {
                  country_code: (matchedRegion as any)?.country_code || 'us',
                  state_province: (matchedRegion as any)?.state_province || '',
                  city: (matchedRegion as any)?.city || '',
                  postal_code: (matchedRegion as any)?.postal_code || ''
                }
              };
            });

          fetchedRebates = [...formattedLocalRebates, ...fetchedRebates];
        }
      } catch (err) {
        console.error('Failed to merge local storage rebates:', err);
      }

      setRebates(fetchedRebates);
      setIsLoading(false);
    }

    loadData();
  }, [initialRebates]);

  return { rebates, isLoading };
}
