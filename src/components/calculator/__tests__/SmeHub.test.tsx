import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SmeHub from '../SmeHub';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock requestAnimationFrame for framer-motion/animated number
global.requestAnimationFrame = (callback) => setTimeout(callback, 0) as any;
global.cancelAnimationFrame = (id) => clearTimeout(id as any);

describe('SmeHub Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const defaultProps = {
    defaultGridRate: 0.15,
    defaultSunHours: 1500,
    defaultGridEmissions: 0.5,
    defaultCostPerWatt: 2.5,
    state: 'California',
    city: 'Los Angeles'
  };

  it('renders correctly with default props', () => {
    render(<SmeHub {...defaultProps} />);

    // Check if main title is rendered
    expect(screen.getByText(/Financial Yield & Decarbonization/i)).toBeInTheDocument();
  });

  it('loads local overrides from localStorage', () => {
    const localOverrides = [
      {
        city: 'Los Angeles',
        grid_rate: 0.25, // different than 0.15
        sun_hours: 2000,
        grid_emissions: 0.6,
        cost_per_watt: 3.0
      }
    ];
    localStorage.setItem('local_regions', JSON.stringify(localOverrides));

    render(<SmeHub {...defaultProps} />);

    act(() => {
      vi.runAllTimers();
    });

    // PPA rate is 0.25 * 0.72 = 0.18
    // With default props, PPA rate would be 0.15 * 0.72 = 0.108 (approx 0.11)
    const ppaButton = screen.getByText(/PPA/i, { selector: 'button' });
    fireEvent.click(ppaButton);

    // It should render 0.18 as the PPA rate since it loaded 0.25 from localStorage
    expect(screen.getByText(/0.180/i)).toBeInTheDocument();
  });

  it('updates metrics when facility area changes', () => {
    render(<SmeHub {...defaultProps} />);

    const sliders = screen.getAllByRole('slider');
    // the first slider is facility area
    fireEvent.change(sliders[0], { target: { value: 10000 } });

    // Verify that the UI updated to show 10,000 somewhere, as it's displayed on screen
    expect(screen.getByText(/10,000/i)).toBeInTheDocument();
  });

  it('changes financial model correctly', () => {
    render(<SmeHub {...defaultProps} />);

    // Look for button that contains PPA
    const ppaButton = screen.getByText(/PPA/i, { selector: 'button' });
    fireEvent.click(ppaButton);

    expect(screen.getByText(/Immediate/i)).toBeInTheDocument();
  });

  it('changes ownership correctly', () => {
    render(<SmeHub {...defaultProps} />);

    const leasedButton = screen.getByText(/Leased Facility/i, { selector: 'button' });
    fireEvent.click(leasedButton);

    // When changing to leased, it automatically selects PPA. The ROI label is 'Immediate' or 'Instant Savings'
    expect(screen.getByText(/Immediate/i)).toBeInTheDocument();
  });
});
