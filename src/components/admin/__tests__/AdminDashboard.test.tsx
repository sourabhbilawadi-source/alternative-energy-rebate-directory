import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AdminDashboard from '../AdminDashboard';
import { supabase } from '../../../lib/supabase';
import { useTranslations } from '../../../lib/i18n';

// Mock framer-motion
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
vi.mock('lucide-react', () => ({
  Building: () => <span data-testid="icon-building" />,
  MapPin: () => <span data-testid="icon-mappin" />,
  Zap: () => <span data-testid="icon-zap" />,
  Trash2: () => <span data-testid="icon-trash" />,
  Edit3: () => <span data-testid="icon-edit" />,
  Plus: () => <span data-testid="icon-plus" />,
  LogOut: () => <span data-testid="icon-logout" />,
  Lock: () => <span data-testid="icon-lock" />,
  Globe: () => <span data-testid="icon-globe" />,
  Tag: () => <span data-testid="icon-tag" />,
  Save: () => <span data-testid="icon-save" />,
  X: () => <span data-testid="icon-x" />,
  FileSpreadsheet: () => <span data-testid="icon-file" />,
  CheckCircle: () => <span data-testid="icon-check" />
}));

// Mock Supabase
vi.mock('../../../lib/supabase', () => {
  const mockSelect = vi.fn();
  return {
    supabase: {
      auth: {
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
        onAuthStateChange: vi.fn(() => ({
          data: { subscription: { unsubscribe: vi.fn() } }
        })),
      },
      from: vi.fn(() => ({
        select: mockSelect,
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
      })),
    }
  };
});

describe('AdminDashboard', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Mock localStorage
    const store: Record<string, string> = {};
    Storage.prototype.getItem = vi.fn((key: string) => store[key] || null);
    Storage.prototype.setItem = vi.fn((key: string, value: string) => {
      store[key] = value;
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('handles Supabase fetch error gracefully during live DB load', async () => {
    // 1. Setup auth mock to succeed
    (supabase!.auth.signInWithPassword as any).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
      error: null,
    });

    // 2. Setup DB mock to throw error on loadRecords.
    // loadRecords calls: await supabase.from('regions').select('*')
    const mockError = new Error('Database connection failed');

    const selectMock = vi.fn().mockImplementation(() => {
      throw mockError;
    });

    (supabase!.from as any).mockImplementation((table: string) => {
      return { select: selectMock };
    });

    render(<AdminDashboard />);

    // 3. Fill and submit login form
    // Using the exact placeholders discovered via sed
    fireEvent.change(screen.getByPlaceholderText('admin@incentivemapper.com'), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

    // Using exact translated button text found in src/lib/i18n.ts (en)
    const loginButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(loginButton);

    // 4. Wait for loadRecords to be called which invokes supabase.from
    await waitFor(() => {
      expect(supabase!.from).toHaveBeenCalledWith('regions');
      expect(selectMock).toHaveBeenCalled();
    });

    // 5. Assert that error was logged gracefully
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load database records:', mockError);
  });
});
