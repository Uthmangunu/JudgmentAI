import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useAuthContext } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
// import logo from '../../assets/images/logos/judgment-gavel.png';

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuthContext();

  return (
    <header className="w-full border-b border-border bg-bg-secondary/30 backdrop-blur-xl sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2">
            {/* <img src={logo} alt="JudgmentAI logo" className="h-10 w-10 rounded-xl border border-primary/40 shadow-green-glow/50" /> */}
            <div className="h-10 w-10 rounded-xl border border-primary/40 shadow-green-glow/50 bg-primary/10 flex items-center justify-center text-primary font-bold">J</div>
            <span className="text-2xl font-semibold tracking-wide text-white">
              Judgment<span className="text-primary">AI</span>
            </span>
          </Link>
          <span className="text-text-muted hidden sm:block text-xs uppercase tracking-[0.4em]">Aspect Console</span>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden md:flex items-center gap-3 rounded-full border border-border px-4 py-2 bg-bg-tertiary/70 shadow-green-glow/30">
              <span className="text-xs uppercase tracking-[0.3em] text-text-secondary">Analyst</span>
              <span className="text-sm text-text-primary">{user.email}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
                {getInitials(user.email || '')}
              </span>
            </div>
          )}
          {/* Removed Demo Mode button - was causing UUID validation errors */}
          <Button variant="primary" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
