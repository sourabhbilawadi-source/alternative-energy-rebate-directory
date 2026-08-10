// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import SmeHub from '../SmeHub';

describe('SmeHub', () => {
  const defaultProps = {
    defaultGridRate: 0.15,
    defaultSunHours: 4.5,
    defaultGridEmissions: 400,
    defaultCostPerWatt: 3.5,
    state: 'California',
    city: 'Los Angeles',
  };

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(<SmeHub {...defaultProps} />);
    expect(screen.getByText(/Commercial Sizing Engine/i)).toBeInTheDocument();
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('local_regions', 'invalid-json{');

    // Spy on console.error to prevent it from cluttering the test output and to assert it was called
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Render the component
    render(<SmeHub {...defaultProps} />);

    // Assert that the component still renders
    expect(screen.getByText(/Commercial Sizing Engine/i)).toBeInTheDocument();

    // Assert that console.error was called with the expected error message
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to parse local overrides in SME Hub:',
      expect.any(Error)
    );
  });
});
