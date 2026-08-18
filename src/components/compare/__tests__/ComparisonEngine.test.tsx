// @vitest-environment jsdom
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ComparisonEngine, { RawDatabaseRebate } from '../ComparisonEngine';

import '@testing-library/jest-dom';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => {
      // remove unused layout prop explicitly if needed, but standard destructure handles it
      const { layout, ...rest } = props;
      return (
        <div className={className} data-testid="motion-div" {...rest}>
          {children}
        </div>
      );
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => {
  return {
    ArrowRightLeft: () => <span data-testid="icon-arrow" />,
    Info: () => <span data-testid="icon-info" />,
  };
});

// Create mock database rebates
const mockDatabaseRebates = [
  {
    id: '1',
    authority_name: 'Federal Gov',
    technology_category: 'Federal Tax Incentive',
    incentive_value: 30,
    incentive_type: 'percentage',
    max_limit: null,
    regions: {
      id: 'reg1',
      country_code: 'us',
      state_province: 'California',
      city: 'Los Angeles',
      postal_code: null
    }
  },
  {
    id: '2',
    authority_name: 'State Gov',
    technology_category: 'Solar PV',
    incentive_value: 1000,
    incentive_type: 'fixed',
    max_limit: 1000,
    regions: {
      id: 'reg1',
      country_code: 'us',
      state_province: 'California',
      city: 'Los Angeles',
      postal_code: null
    }
  },
  {
    id: '3',
    authority_name: 'France Gov',
    technology_category: 'Solar PV',
    incentive_value: 500,
    incentive_type: 'fixed',
    max_limit: 500,
    regions: {
      id: 'reg3',
      country_code: 'fr',
      state_province: 'Ile-de-France',
      city: 'Paris',
      postal_code: null
    }
  }
] as unknown as RawDatabaseRebate[];

describe('ComparisonEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders initial comparison engine with default locations', () => {
    render(<ComparisonEngine databaseRebates={mockDatabaseRebates} />);

    // Check for Monthly Bill and Roof Area sliders based on English translations
    expect(screen.getByText('Average Monthly Bill')).toBeInTheDocument();
    expect(screen.getByText('Usable Roof Area')).toBeInTheDocument();

    // Check for Region Selectors
    const labels = screen.getAllByText(/Region [AB]/i);
    expect(labels.length).toBe(2);

    // Initial regions in region.ts typically include Los Angeles, CA
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
  });

  it('updates monthly bill when slider changes', () => {
    render(<ComparisonEngine databaseRebates={mockDatabaseRebates} />);

    // Actually there are 2 sliders.
    const sliders = screen.getAllByRole('slider');
    const billSliderEl = sliders[0];

    fireEvent.change(billSliderEl, { target: { value: '500' } });

    expect(screen.getByText('$500')).toBeInTheDocument();
  });

  it('updates roof area when slider changes', () => {
    render(<ComparisonEngine databaseRebates={mockDatabaseRebates} />);

    const sliders = screen.getAllByRole('slider');
    const roofSliderEl = sliders[1];

    fireEvent.change(roofSliderEl, { target: { value: '2500' } });

    expect(screen.getByText('2500 sq ft')).toBeInTheDocument();
  });

  it('changes selected regions and displays no rebate message if region has no rebates', async () => {
    render(<ComparisonEngine databaseRebates={mockDatabaseRebates} />);

    // Select a region that likely has no mocked database rebates
    const selects = screen.getAllByRole('combobox');
    const regionASelect = selects[0];

    // Change to 'new-york-city' (which shouldn't match our 'los-angeles' mock data)
    fireEvent.change(regionASelect, { target: { value: 'new-york-city' } });

    // Wait for the UI to update asynchronously
    await waitFor(() => {
      expect(screen.getAllByText('⚠️').length).toBeGreaterThan(0);
      expect(screen.getAllByText('No Rebate Data Available').length).toBeGreaterThan(0);
    });
  });

  it('applies localization formatting with a different language prop', () => {
    render(<ComparisonEngine lang="fr-fr" databaseRebates={mockDatabaseRebates} />);

    // Test if UI loads the translation for French
    expect(screen.getByText('Facture d\'électricité mensuelle moyenne')).toBeInTheDocument();
    expect(screen.getByText('Surface de toit utilisable')).toBeInTheDocument();
  });

  it('switches units correctly when city in different country is selected', () => {
    render(<ComparisonEngine databaseRebates={mockDatabaseRebates} />);

    const selects = screen.getAllByRole('combobox');
    const regionASelect = selects[0];

    // Find a metric city using regionsData
    // Let's use 'berlin' which is in DE
    fireEvent.change(regionASelect, { target: { value: 'berlin' } });

    // Expect roof area metric to switch from sq ft to m²
    // We look for '120 m²' as it's the default metric unit
    expect(screen.getByText('120 m²')).toBeInTheDocument();
    expect(screen.getByText('20 m²')).toBeInTheDocument();
    expect(screen.getByText('500 m²')).toBeInTheDocument();
  });

  it('loads custom local regions from localStorage', () => {
    const mockLocalRegions = [
      {
        id: '999',
        city: 'Testville',
        state_province: 'Test State',
        country_code: 'us',
        grid_rate: '0.15',
        sun_hours: '1500',
        grid_emissions: '0.5',
        cost_per_watt: '3.00'
      }
    ];
    localStorage.setItem('local_regions', JSON.stringify(mockLocalRegions));

    render(<ComparisonEngine databaseRebates={mockDatabaseRebates} />);

    // Custom region should appear in the options
    const options = screen.getAllByRole('option', { name: 'Testville (Test State)' });
    expect(options.length).toBeGreaterThan(0);
  });
});
