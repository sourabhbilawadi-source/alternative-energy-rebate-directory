import { describe, it, expect, vi, beforeEach } from 'vitest';

// First, hoist the mock so it runs before any imports
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn((url, key) => ({ url, key, mock: true }))
}));

describe('supabase client', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should initialize successfully with valid credentials', async () => {
    // Stub environments first
    vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://example.supabase.co/');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'valid-key');

    // Import dynamically so it picks up the stubbed envs
    const { supabase } = await import('./supabase');

    expect(supabase).toBeTruthy();
    expect(supabase).toEqual({ url: 'https://example.supabase.co', key: 'valid-key', mock: true });

    vi.unstubAllEnvs();
  });

  it('should not initialize if url is missing', async () => {
    vi.stubEnv('PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'valid-key');

    const { supabase } = await import('./supabase');

    expect(supabase).toBeNull();

    vi.unstubAllEnvs();
  });

  it('should not initialize if anon key is missing', async () => {
    vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', '');

    const { supabase } = await import('./supabase');

    expect(supabase).toBeNull();

    vi.unstubAllEnvs();
  });

  it('should not initialize if url contains your-project-id', async () => {
    vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://your-project-id.supabase.co');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'valid-key');

    const { supabase } = await import('./supabase');

    expect(supabase).toBeNull();

    vi.unstubAllEnvs();
  });

  it('should not initialize if anon key is YOUR_SUPABASE_ANON_KEY', async () => {
    vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'YOUR_SUPABASE_ANON_KEY');

    const { supabase } = await import('./supabase');

    expect(supabase).toBeNull();

    vi.unstubAllEnvs();
  });

  it('should strip trailing slash and /rest/v1 from URL', async () => {
    vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://example.supabase.co/rest/v1/');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'valid-key');

    const { supabase } = await import('./supabase');

    expect(supabase).toBeTruthy();
    expect(supabase).toEqual({ url: 'https://example.supabase.co', key: 'valid-key', mock: true });

    vi.unstubAllEnvs();
  });

  it('should prefer PUBLIC_ over non-public env variables', async () => {
    vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://public.supabase.co/');
    vi.stubEnv('SUPABASE_URL', 'https://nonpublic.supabase.co/');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'public-key');
    vi.stubEnv('SUPABASE_ANON_KEY', 'nonpublic-key');

    const { supabase } = await import('./supabase');

    expect(supabase).toBeTruthy();
    expect(supabase).toEqual({ url: 'https://public.supabase.co', key: 'public-key', mock: true });

    vi.unstubAllEnvs();
  });
});
