/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { authClient } from '@/lib/auth-client';

interface AuthContextType {
  user: { id: string; name?: string; email?: string; image?: string } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isBlogAdmin: boolean;
  signInWithGoogle: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? undefined,
        email: session.user.email ?? undefined,
        image: session.user.image ?? undefined,
      }
    : null;

  const isBlogAdmin = useQuery(
    api.blogAuthors.isBlogAdmin,
    user ? {} : "skip",
  ) ?? false;

  const signInWithGoogle = () => {
    authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  const signOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isPending,
        isAuthenticated: !!user,
        isBlogAdmin,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
