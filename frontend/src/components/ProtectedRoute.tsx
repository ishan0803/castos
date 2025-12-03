import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import Loader from './ui/Loader';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="h-screen flex items-center justify-center"><Loader text="Verifying Session..." /></div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}