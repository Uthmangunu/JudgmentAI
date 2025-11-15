import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useAuthContext } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuthContext();

  return (
    <header className="w-full border-b border-border bg-bg-secondary/60 backdrop-blur p-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-2xl font-semibold text-primary tracking-wide">
            JudgmentAI
          </Link>
          <span className="text-text-muted hidden sm:block">Reddit Intelligence Console</span>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3 rounded-full border border-border px-4 py-2 bg-bg-tertiary">
              <span className="text-sm text-text-secondary hidden md:block">{user.email}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
                {getInitials(user.email || '')}
              </span>
            </div>
          )}
          <Button variant="ghost" onClick={() => navigate('/analysis/demo')}>
            Demo Mode
          </Button>
          <Button variant="primary" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
