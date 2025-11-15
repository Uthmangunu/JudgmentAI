import { Link } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
import { useAuth } from '../hooks/useAuth';
import AnimePanelGallery from '../components/layout/AnimePanelGallery';

export default function SignupPage() {
  const { signup, isSigningUp, signupError } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-tl from-bg-primary via-[#010b05] to-bg-primary relative overflow-hidden">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-primary/5 blur-3xl" />
      <div className="relative grid w-full max-w-5xl gap-8 md:grid-cols-2 rounded-[32px] border border-border bg-bg-secondary/70 p-8 shadow-green-glow/60 backdrop-blur-xl">
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-1 text-xs uppercase tracking-[0.4em] text-primary">
            Access Granted
          </p>
          <h1 className="text-4xl font-semibold leading-tight">Join the JudgmentAI analyst console.</h1>
          <p className="text-text-secondary">Create an account to launch new scrapes, inspect consensus, and chat with the meta-analysis assistant.</p>
          <div className="rounded-3xl border border-border bg-bg-tertiary/70 p-4">
            <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Atmosphere</p>
            <AnimePanelGallery variant="analysis" />
          </div>
        </div>
        <div className="bg-bg-tertiary/80 rounded-3xl border border-border-green p-6 shadow-green-glow">
          <SignupForm onSubmit={signup} isLoading={isSigningUp} error={signupError} />
          <p className="text-center text-sm text-text-muted mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
