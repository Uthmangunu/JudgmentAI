import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 bg-bg-secondary border border-border-green rounded-3xl p-8 shadow-green-glow">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-primary">JudgmentAI</p>
          <h1 className="text-3xl font-semibold text-text-primary">Make informed judgments from Reddit discussions</h1>
          <p className="text-text-secondary">Log in to run analyses, explore meta-insights, and chat with our analyst.</p>
        </div>
        <LoginForm onSubmit={login} isLoading={isLoggingIn} error={loginError} />
        <p className="text-center text-sm text-text-muted">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
