import '@testing-library/jest-dom';

// Create a mock instance of ResizeObserver for recharts or framer-motion if needed
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
