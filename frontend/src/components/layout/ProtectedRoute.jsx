import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import { authService } from '../../services/auth.service';
import { useAuthContext } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { isBootstrapping } = useAuthContext();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <LoadingSpinner message="Loading your workspace..." />
      </div>
    );
  }

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
