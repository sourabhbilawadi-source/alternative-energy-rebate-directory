import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { queryLocationSpecs } from './energyApi';

describe('queryLocationSpecs', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('should handle OSM Geocoding request failure and return null', async () => {
    // Mock fetch to return a non-ok response
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    // We can also spy on console.error to keep the test output clean
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await queryLocationSpecs('New York');

    expect(result).toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching location specs from APIs:', expect.any(Error));
  });
});
