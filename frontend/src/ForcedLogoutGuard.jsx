import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ForcedLogoutGuard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname !== '/login' &&
      location.pathname !== '/register'
    ) {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  // Only render children if on login or register
  if (
    location.pathname !== '/login' &&
    location.pathname !== '/register'
  ) {
    return null; // Don't render anything while redirecting
  }

  return children;
};

export default ForcedLogoutGuard; 