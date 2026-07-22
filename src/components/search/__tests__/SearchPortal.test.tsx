import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchPortal from '../SearchPortal';

// Mock framer-motion to simplify DOM output
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, layout, ...props }: any) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => {
  return {
    Search: () => <span data-testid="icon-search" />,
    SlidersHorizontal: () => <span data-testid="icon-sliders" />,
    MapPin: () => <span data-testid="icon-mappin" />,
    Zap: () => <span data-testid="icon-zap" />,
    Tag: () => <span data-testid="icon-tag" />,
    ArrowRight: () => <span data-testid="icon-arrow" />,
    Globe: () => <span data-testid="icon-globe" />,
    Layers: () => <span data-testid="icon-layers" />,
  };
});

// Mock i18n
vi.mock('../../../lib/i18n', () => ({
  useTranslations: () => ({
    search: {
      placeholder: 'Search for incentives...',
      allCountries: 'All Countries',
      allCategories: 'All Categories',
      loadingMsg: 'Loading...',
      noResults: 'No results found',
      noResultsDesc: 'Try adjusting your filters',
    },
  }),
}));

// Mock Supabase

const mockSupabaseEq = vi.fn();
const mockSupabaseSelect = vi.fn(() => ({ eq: mockSupabaseEq }));

vi.mock('../../../lib/supabase', () => {
  return {
    supabase: {
      from: vi.fn(() => ({
        select: mockSupabaseSelect
      }))
    }
  };
});


// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

beforeEach(() => {
  mockSupabaseEq.mockResolvedValue({ data: [], error: null });

  vi.clearAllMocks();
  localStorageMock.clear();
});

const sampleRebate = {
  id: '1',
  authority_name: 'Federal Solar Rebate',
  technology_category: 'solar',
  incentive_value: 30,
  incentive_type: 'percentage',
  max_limit: null,
  region: {
    country_code: 'us',
    state_province: 'CA',
    city: 'San Francisco',
    postal_code: '94105'
  }
};

const sampleRebate2 = {
  id: '2',
  authority_name: 'State Battery Grant',
  technology_category: 'battery',
  incentive_value: 1000,
  incentive_type: 'fixed',
  max_limit: 2000,
  region: {
    country_code: 'us',
    state_province: 'NY',
    city: 'New York',
    postal_code: '10001'
  }
};

describe('SearchPortal', () => {
  it('renders with empty state and no initial rebates', async () => {
    render(<SearchPortal lang="en-us" />);

    // Check loading state first
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the empty state to render
    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();

    // Supabase should have been called since initialRebates is empty
    expect(mockSupabaseEq).toHaveBeenCalledWith('is_active', true);
  });

  it('renders initialRebates without calling Supabase', async () => {
    render(<SearchPortal lang="en-us" initialRebates={[sampleRebate]} />);

    await waitFor(() => {
      expect(screen.getByText('Federal Solar Rebate')).toBeInTheDocument();
    });

    // It should NOT call supabase if initialRebates is provided
    expect(mockSupabaseSelect).not.toHaveBeenCalled();
  });

  it('filters results by text query', async () => {
    render(<SearchPortal lang="en-us" initialRebates={[sampleRebate, sampleRebate2]} />);

    await waitFor(() => {
      expect(screen.getByText('Federal Solar Rebate')).toBeInTheDocument();
      expect(screen.getByText('State Battery Grant')).toBeInTheDocument();
    });

    // Type in the search box
    const searchInput = screen.getByPlaceholderText('Search for incentives...');
    fireEvent.change(searchInput, { target: { value: 'Federal' } });

    await waitFor(() => {
      expect(screen.getByText('Federal Solar Rebate')).toBeInTheDocument();
      expect(screen.queryByText('State Battery Grant')).not.toBeInTheDocument();
    });
  });

  it('filters results by postal code', async () => {
    render(<SearchPortal lang="en-us" initialRebates={[sampleRebate, sampleRebate2]} />);

    await waitFor(() => {
      expect(screen.getByText('Federal Solar Rebate')).toBeInTheDocument();
    });

    // Type in the postal code box
    const postalInput = screen.getByPlaceholderText('Postal / ZIP code...');
    fireEvent.change(postalInput, { target: { value: '10001' } });

    await waitFor(() => {
      expect(screen.getByText('State Battery Grant')).toBeInTheDocument();
      expect(screen.queryByText('Federal Solar Rebate')).not.toBeInTheDocument();
    });
  });

  it('filters results by category', async () => {
    render(<SearchPortal lang="en-us" initialRebates={[sampleRebate, sampleRebate2]} />);

    await waitFor(() => {
      expect(screen.getByText('Federal Solar Rebate')).toBeInTheDocument();
    });

    // Click on the 'battery' category
    const batteryButton = screen.getByRole('button', { name: /battery/i });
    fireEvent.click(batteryButton);

    await waitFor(() => {
      expect(screen.getByText('State Battery Grant')).toBeInTheDocument();
      expect(screen.queryByText('Federal Solar Rebate')).not.toBeInTheDocument();
    });
  });

  it('merges rebates from localStorage', async () => {
    const localRegion = [{ id: '100', country_code: 'ca', state_province: 'ON', city: 'Toronto', postal_code: 'M5V' }];
    const localRebate = [{
      id: 'local-1',
      authority_name: 'Local Storage Grant',
      technology_category: 'heat pump',
      incentive_value: 500,
      incentive_type: 'fixed',
      region_id: '100',
      is_active: true
    }];

    localStorageMock.setItem('local_regions', JSON.stringify(localRegion));
    localStorageMock.setItem('local_rebates', JSON.stringify(localRebate));

    render(<SearchPortal lang="en-us" initialRebates={[sampleRebate]} />);

    await waitFor(() => {
      expect(screen.getByText('Federal Solar Rebate')).toBeInTheDocument();
      expect(screen.getByText('Local Storage Grant')).toBeInTheDocument();
    });
  });

  it('fetches rebates from Supabase when initialRebates is empty', async () => {
    mockSupabaseEq.mockReset();
    // Setup Supabase mock response
    mockSupabaseEq.mockResolvedValue({
      data: [{
        id: 'supa-1',
        authority_name: 'Supabase Fetched Rebate',
        technology_category: 'solar',
        incentive_value: '25',
        incentive_type: 'percentage',
        max_limit: null,
        regions: {
          country_code: 'uk',
          state_province: 'ENG',
          city: 'London',
          postal_code: 'W1'
        }
      }],
      error: null
    });

    render(<SearchPortal lang="en-us" />);

    await waitFor(() => {
      expect(screen.getByText('Supabase Fetched Rebate')).toBeInTheDocument();
    });

    // Verify standard calculation mapping logic applied
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('London, ENG W1')).toBeInTheDocument();
  });
});
