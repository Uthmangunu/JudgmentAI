import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import AnimePanelGallery from '../components/layout/AnimePanelGallery';

export default function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-bg-primary via-[#030c07] to-bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(0,255,65,0.12),_transparent_55%)]" />
      <div className="relative grid w-full max-w-5xl gap-8 md:grid-cols-2 rounded-[32px] border border-border bg-bg-secondary/70 p-8 shadow-green-glow/60 backdrop-blur-xl">
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-1 text-xs uppercase tracking-[0.4em] text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Analyst Mode
          </p>
          <h1 className="text-4xl font-semibold leading-tight">Make informed judgments from Reddit discussions.</h1>
          <p className="text-text-secondary">
            Access your dashboard, monitor live scrape progress, and continue the conversation with our impartial AI analyst.
          </p>
          <div className="rounded-3xl border border-border bg-bg-tertiary/70 p-4">
            <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Preview moodboard</p>
            <AnimePanelGallery variant="analysis" />
          </div>
        </div>
        <div className="bg-bg-tertiary/80 rounded-3xl border border-border-green p-6 shadow-green-glow">
          <LoginForm onSubmit={login} isLoading={isLoggingIn} error={loginError} />
          <p className="text-center text-sm text-text-muted mt-4">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
