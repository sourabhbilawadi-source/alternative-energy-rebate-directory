import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminDashboard from '../AdminDashboard';
import { supabase } from '../../../lib/supabase';

// Mock required dependencies
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
  },
}));

vi.mock('../../../lib/i18n', () => ({
  useTranslations: () => ({
    admin: {
      loginTitle: 'Admin Login',
      successDelete: 'Deleted',
      successSave: 'Saved'
    }
  })
}));

describe('AdminDashboard Error Handling', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('handles invalid JSON in localStorage gracefully without crashing', async () => {
    // 1. Arrange: setup invalid json in localStorage
    localStorage.setItem('local_regions', '{ invalid_json ]');
    localStorage.setItem('local_rebates', 'not_json');

    // Suppress console.error in test output to keep it clean, as we expect the error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Set mock to act as if logged in so loadRecords triggers
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: { session: { user: { id: 'test' } } } as any
    });

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [] }),
    } as any);

    // 2. Act: render component
    render(<AdminDashboard lang="en" />);

    // Wait to ensure effects have run. We trigger loadRecords indirectly by the auth mock resolving.
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to parse local storage records:',
        expect.any(SyntaxError)
      );
    });

    // We can also verify it doesn't crash by checking if the component rendered the dashboard (or log out button)
    expect(screen.getByText(/Registered Regional Hubs/)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
