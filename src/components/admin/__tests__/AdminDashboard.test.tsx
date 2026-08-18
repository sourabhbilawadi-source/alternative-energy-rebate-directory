// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminDashboard from '../AdminDashboard';
import { supabase } from '../../../lib/supabase';

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

vi.mock('lucide-react', () => {
  return {
    Lock: () => <span data-testid="icon-lock" />,
    Building: () => <span data-testid="icon-building" />,
    MapPin: () => <span data-testid="icon-mappin" />,
    Zap: () => <span data-testid="icon-zap" />,
    Trash2: () => <span data-testid="icon-trash" />,
    Edit3: () => <span data-testid="icon-edit" />,
    Plus: () => <span data-testid="icon-plus" />,
    LogOut: () => <span data-testid="icon-logout" />,
    Globe: () => <span data-testid="icon-globe" />,
    Tag: () => <span data-testid="icon-tag" />,
    Save: () => <span data-testid="icon-save" />,
    X: () => <span data-testid="icon-x" />,
    FileSpreadsheet: () => <span data-testid="icon-spreadsheet" />,
    CheckCircle: () => <span data-testid="icon-check" />
  };
});

vi.mock('../../../lib/supabase', () => {
  const mockSelect = vi.fn();
  const mockFrom = vi.fn(() => ({ select: mockSelect }));
  const mockGetSession = vi.fn().mockResolvedValue({ data: { session: { user: { id: '1' } } } });
  const mockOnAuthStateChange = vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

  return {
    supabase: {
      from: mockFrom,
      auth: {
        getSession: mockGetSession,
        onAuthStateChange: mockOnAuthStateChange,
      },
    },
  };
});

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles database fetch error gracefully and logs to console', async () => {
    const mockFrom = supabase!.from as unknown as ReturnType<typeof vi.fn>;
    const mockSelect = vi.fn().mockRejectedValue(new Error('Database connection failed'));
    mockFrom.mockReturnValue({ select: mockSelect });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(<AdminDashboard lang="en" />);
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load database records:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
