import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuthContext } from '../context/AuthContext';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser } = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: ({ user }) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/dashboard');
    },
  });

  const signupMutation = useMutation({
    mutationFn: ({ email, password }) => authService.signup(email, password),
    onSuccess: ({ user }) => {
      setUser(user);
      navigate('/dashboard');
    },
  });

  const logout = () => {
    authService.logout();
    queryClient.clear();
    setUser(null);
  };

  return {
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error,
    isAuthenticated: authService.isAuthenticated(),
  };
}
