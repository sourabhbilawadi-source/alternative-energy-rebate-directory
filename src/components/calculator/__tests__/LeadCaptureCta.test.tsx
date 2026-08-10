import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LeadCaptureCta from '../LeadCaptureCta';

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
    X: () => <span data-testid="icon-x" />,
    Mail: () => <span data-testid="icon-mail" />,
    User: () => <span data-testid="icon-user" />,
    CheckCircle: () => <span data-testid="icon-check" />,
    AlertCircle: () => <span data-testid="icon-alert" />,
    Loader2: () => <span data-testid="icon-loader" />,
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

describe('LeadCaptureCta', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();

    // Set import.meta.env for tests
    vi.stubEnv('PUBLIC_LEAD_CAPTURE_URL', 'https://api.example.com/lead');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders correctly initially', async () => {
    render(<LeadCaptureCta region="California" calculatorType="residential" />);

    expect(screen.getByText('Get Your Custom Solar Rebate Report')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Email Address')).toBeInTheDocument();
  });

  it('does not render if previously dismissed', async () => {
    localStorageMock.setItem('incentivemapper-lead-cta-dismissed', 'true');
    render(<LeadCaptureCta region="California" calculatorType="residential" />);

    expect(screen.queryByText('Get Your Custom Solar Rebate Report')).not.toBeInTheDocument();
  });

  it('dismisses when close button is clicked', async () => {
    render(<LeadCaptureCta region="California" calculatorType="residential" />);

    const closeBtn = screen.getByLabelText('Dismiss lead form');
    fireEvent.click(closeBtn);

    expect(localStorageMock.setItem).toHaveBeenCalledWith('incentivemapper-lead-cta-dismissed', 'true');
    expect(screen.queryByText('Get Your Custom Solar Rebate Report')).not.toBeInTheDocument();
  });

  it('simulates success when PUBLIC_LEAD_CAPTURE_URL is not set', async () => {
    vi.unstubAllEnvs(); // Clear endpoint
    render(<LeadCaptureCta region="California" calculatorType="residential" />);

    fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Your Email Address'), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByText('Request Free Report'));

    await waitFor(() => {
      expect(screen.getByText('Thank You!')).toBeInTheDocument();
    });
  });

  it('handles successful API submission', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'success' }),
    });

    render(<LeadCaptureCta region="California" calculatorType="residential" />);

    fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Your Email Address'), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByText('Request Free Report'));

    await waitFor(() => {
      expect(screen.getByText('Thank You!')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/lead', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('"name":"John Doe"'),
    }));
  });

  it('handles API error response correctly (server returned error status)', async () => {
    // Prevent console.error from polluting test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(<LeadCaptureCta region="California" calculatorType="residential" />);

    fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Your Email Address'), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByText('Request Free Report'));

    await waitFor(() => {
      expect(screen.getByText('Server returned an error status.')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('handles custom error message from API (status is not success)', async () => {
     // Prevent console.error from polluting test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'error', message: 'Submission failed.' }),
    });

    render(<LeadCaptureCta region="California" calculatorType="residential" />);

    fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Your Email Address'), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByText('Request Free Report'));

    await waitFor(() => {
      expect(screen.getByText('Submission failed.')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});
