import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminDashboard from '../AdminDashboard';

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

// Mock lucide-react
vi.mock('lucide-react', () => {
  return {
    Building: () => <span data-testid="icon" />,
    MapPin: () => <span data-testid="icon" />,
    Zap: () => <span data-testid="icon" />,
    Trash2: () => <span data-testid="icon" />,
    Edit3: () => <span data-testid="icon" />,
    Plus: () => <span data-testid="icon" />,
    LogOut: () => <span data-testid="icon" />,
    Lock: () => <span data-testid="icon" />,
    Globe: () => <span data-testid="icon" />,
    Tag: () => <span data-testid="icon" />,
    Save: () => <span data-testid="icon" />,
    X: () => <span data-testid="icon" />,
    FileSpreadsheet: () => <span data-testid="icon" />,
    CheckCircle: () => <span data-testid="icon" />,
  };
});

// Mock i18n
vi.mock('../../../lib/i18n', () => ({
  useTranslations: () => ({
    admin: {
      loginTitle: 'Admin Login',
      loginError: 'Invalid credentials',
      successAddCity: 'City added',
      successAddRebate: 'Rebate added',
      successDelete: 'Deleted',
    },
  }),
}));

const mockSupabaseSelect = vi.fn();
const mockSupabaseFrom = vi.fn(() => ({ select: mockSupabaseSelect }));
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: (...args: any[]) => mockSupabaseFrom(...args),
    auth: {
      getSession: (...args: any[]) => mockGetSession(...args),
      onAuthStateChange: (...args: any[]) => mockOnAuthStateChange(...args),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    }
  }
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Initially not logged in, but getSession handles auth
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
  });

  it('handles error path when data fetch fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Set up auth state change to trigger login which triggers fetch
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: '123' } } } });

    // Make supabase.from().select() reject
    mockSupabaseSelect.mockRejectedValue(new Error('DB connection failed'));

    await act(async () => {
      render(<AdminDashboard lang="en" />);
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load database records:',
        expect.any(Error)
      );
    });

    expect(consoleSpy.mock.calls[0][1].message).toBe('DB connection failed');

    // Wait for the toast to appear
    await waitFor(() => {
      expect(screen.getByText('Database Error: DB connection failed')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});
