import { describe, it, expect, vi, afterEach } from 'vitest';
import { queryLocationSpecs } from './energyApi';

describe('queryLocationSpecs', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return null and not make network requests when query is empty or whitespace', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');

    const result1 = await queryLocationSpecs('');
    expect(result1).toBeNull();

    const result2 = await queryLocationSpecs('   ');
    expect(result2).toBeNull();

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
