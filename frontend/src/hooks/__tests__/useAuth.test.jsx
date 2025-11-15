import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../useAuth';

const navigate = vi.fn();
const mockSetUser = vi.fn();
const { mockLogin } = vi.hoisted(() => ({
  mockLogin: vi.fn(() => Promise.resolve({ token: 'abc', user: { email: 'user@example.com' } })),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigate };
});

vi.mock('../../context/AuthContext', () => ({
  useAuthContext: () => ({ setUser: mockSetUser, user: null, isBootstrapping: false }),
}));

vi.mock('../../services/auth.service.js', () => ({
  authService: {
    login: mockLogin,
    signup: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: () => false,
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useAuth', () => {
  it('logs in and navigates to dashboard', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await act(async () => {
      result.current.login({ email: 'user@example.com', password: 'password123' });
    });

    expect(mockLogin).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith({ email: 'user@example.com' });
    expect(navigate).toHaveBeenCalledWith('/dashboard');
  });
});
