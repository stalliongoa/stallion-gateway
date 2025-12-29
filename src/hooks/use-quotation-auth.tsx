import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface QuotationAuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isEngineer: boolean;
  isAdmin: boolean;
  canAccessQuotations: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const QuotationAuthContext = createContext<QuotationAuthContextType | undefined>(undefined);

export function QuotationAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEngineer, setIsEngineer] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            checkRoles(session.user.id);
          }, 0);
        } else {
          setIsEngineer(false);
          setIsAdmin(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkRoles(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkRoles = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (data) {
      setIsAdmin(data.some(r => r.role === 'admin'));
      setIsEngineer(data.some(r => r.role === 'cctv_engineer'));
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsEngineer(false);
    setIsAdmin(false);
  };

  const canAccessQuotations = isEngineer || isAdmin;

  return (
    <QuotationAuthContext.Provider value={{
      user,
      session,
      isLoading,
      isEngineer,
      isAdmin,
      canAccessQuotations,
      signIn,
      signOut
    }}>
      {children}
    </QuotationAuthContext.Provider>
  );
}

export function useQuotationAuth() {
  const context = useContext(QuotationAuthContext);
  if (context === undefined) {
    throw new Error('useQuotationAuth must be used within a QuotationAuthProvider');
  }
  return context;
}
