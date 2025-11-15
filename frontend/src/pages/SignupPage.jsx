import { Link } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const { signup, isSigningUp, signupError } = useAuth();

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 bg-bg-secondary border border-border-green rounded-3xl p-8 shadow-green-glow">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-primary">Join JudgmentAI</p>
          <h1 className="text-3xl font-semibold text-text-primary">Aspect-based Reddit intelligence</h1>
          <p className="text-text-secondary">Create an account to run full-fidelity analyses.</p>
        </div>
        <SignupForm onSubmit={signup} isLoading={isSigningUp} error={signupError} />
        <p className="text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
