import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { 
  ClerkProvider, 
  SignedIn, 
  SignedOut, 
  RedirectToSignIn, 
  useAuth 
} from '@clerk/clerk-react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import ProjectResult from './pages/ProjectResult';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import { setupInterceptors } from './api/axios';

// Get Clerk Key from Env
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key. Set VITE_CLERK_PUBLISHABLE_KEY in your .env file.");
}

function AuthLayer({ children }: { children: React.ReactNode }) {
    const { getToken } = useAuth();
    React.useEffect(() => {
        setupInterceptors(getToken);
    }, [getToken]);
    return <>{children}</>;
}

export default function App() {
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <AuthLayer>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes: Check for Auth, otherwise Redirect */}
          <Route path="/dashboard" element={
            <>
              <SignedIn>
                <Layout><Dashboard /></Layout>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } />
          
          <Route path="/new" element={
            <>
              <SignedIn>
                <Layout><NewProject /></Layout>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } />
          
          <Route path="/project/:id" element={
            <>
              <SignedIn>
                <Layout><ProjectResult /></Layout>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } />

          <Route path="/settings" element={
            <>
              <SignedIn>
                <Layout><Settings /></Layout>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } />

          {/* Catch-all for 404s */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthLayer>
    </ClerkProvider>
  );
}