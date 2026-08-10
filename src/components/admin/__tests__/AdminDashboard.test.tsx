import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

// Mock lucide-react icons
vi.mock('lucide-react', () => {
  return {
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
    FileSpreadsheet: () => <span data-testid="icon-spreadsheet" />,
    CheckCircle: () => <span data-testid="icon-check" />
  };
});

// Mock i18n
vi.mock('../../../lib/i18n', () => ({
  useTranslations: () => ({
    admin: {
      loginTitle: 'Administrator Authentication',
      username: 'Email Address',
      password: 'Password',
      loginBtn: 'Sign In',
      loginError: 'Invalid credentials.',
      logoutBtn: 'Sign Out',
      title: 'Admin Dashboard',
      mockMode: 'Offline Mock Sandbox Mode',
      liveMode: 'Live Supabase DB Mode',
      addCityTitle: 'Add New Regional Hub',
      countryCode: 'Country Code (e.g. us, uk, de)',
      postalCode: 'Postal Code / ZIP',
      stateProvince: 'State / Province',
      city: 'City Name',
      gridRate: 'Grid Rate ($/kWh)',
      gridEmissions: 'Emissions (kg CO2/kWh)',
      costPerWatt: 'Install Cost ($/W)',
      addCityBtn: 'Add Region',
      createRebateBtn: 'Create New Rebate',
      region: 'Region / City',
      authorityName: 'Authority / Program Name',
      techCategory: 'Technology Category',
      incentiveValue: 'Incentive Value',
      incentiveType: 'Incentive Type',
      maxLimit: 'Max Limit (Optional)',
      isActive: 'Active',
      manageRebatesTitle: 'Manage Active Rebate Specifications',
      actions: 'Actions',
      successAddCity: 'City successfully registered!',
      successAddRebate: 'Rebate program successfully registered!',
      successDelete: 'Record deleted successfully!'
    },
  }),
}));

const mockSignInWithPassword = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockUnsubscribe = vi.fn();
const mockSupabaseSelect = vi.fn();
const mockSupabaseInsert = vi.fn();
const mockSupabaseUpdate = vi.fn();
const mockSupabaseDelete = vi.fn();

vi.mock('../../../lib/supabase', () => {
  return {
    supabase: {
      auth: {
        signInWithPassword: (...args: any[]) => mockSignInWithPassword(...args),
        signOut: (...args: any[]) => mockSignOut(...args),
        getSession: (...args: any[]) => mockGetSession(...args),
        onAuthStateChange: (...args: any[]) => mockOnAuthStateChange(...args)
      },
      from: vi.fn(() => ({
        select: mockSupabaseSelect,
        insert: mockSupabaseInsert,
        update: mockSupabaseUpdate,
        delete: mockSupabaseDelete
      }))
    }
  };
});

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AdminDashboard Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock returns
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } }
    });

    mockSupabaseSelect.mockResolvedValue({ data: [], error: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders login form when not authenticated', async () => {
    render(<AdminDashboard lang="en-us" />);

    expect(screen.getByText('Administrator Authentication')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('admin@incentivemapper.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();

    expect(mockGetSession).toHaveBeenCalled();
  });

  it('successfully logs in via Supabase and shows dashboard', async () => {
    mockSignInWithPassword.mockResolvedValue({ data: { session: { user: { id: '123' } } }, error: null });

    render(<AdminDashboard lang="en-us" />);

    const emailInput = screen.getByPlaceholderText('admin@incentivemapper.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const loginBtn = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginBtn);

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'admin@example.com',
      password: 'password123'
    });

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Administrator Authentication')).not.toBeInTheDocument();
    });
  });

  it('displays error message on failed login', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockSignInWithPassword.mockResolvedValue({ data: null, error: new Error('Auth failed') });

    render(<AdminDashboard lang="en-us" />);

    const emailInput = screen.getByPlaceholderText('admin@incentivemapper.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const loginBtn = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials.')).toBeInTheDocument();
    });
  });

  it('automatically logs in if session exists on mount', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: '123' } } }, error: null });

    render(<AdminDashboard lang="en-us" />);

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Administrator Authentication')).not.toBeInTheDocument();
    });
  });

  it('logs out successfully', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: '123' } } }, error: null });

    render(<AdminDashboard lang="en-us" />);

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    const logoutBtn = screen.getByRole('button', { name: 'Sign Out' });
    fireEvent.click(logoutBtn);

    expect(mockSignOut).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText('Administrator Authentication')).toBeInTheDocument();
    });
  });
});
