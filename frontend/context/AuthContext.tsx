"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SupabaseClient, Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase'; // ATUALIZADO

// Define o tipo para o valor do nosso contexto de autenticação.
// Isso garante que todos os componentes que usam o hook saibam quais dados esperar.
type AuthContextType = {
  supabase: SupabaseClient;
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

// Cria o Contexto React.
// O valor inicial é `undefined` para nos ajudar a detectar se o hook `useAuth`
// está sendo usado fora do `AuthProvider`.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define as propriedades que o nosso Provedor de Autenticação irá receber.
// `children` representa os componentes que serão envolvidos pelo provedor.
type AuthProviderProps = {
  children: ReactNode;
};

/**
 * O AuthProvider é o coração do nosso sistema de autenticação no frontend.
 * Ele gerencia o estado da sessão do usuário e o disponibiliza para toda a aplicação.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const supabase = createClient(); // ATUALIZADO
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Define o estado de carregamento inicial.
    setIsLoading(true);

    // Tenta obter a sessão ativa assim que o componente é montado.
    // Isso é crucial para manter o usuário logado ao recarregar a página.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // `onAuthStateChange` é o listener mágico do Supabase.
    // Ele é acionado sempre que o estado de autenticação muda (LOGIN, LOGOUT, etc.).
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // A função de limpeza do useEffect é essencial.
    // Ela remove o listener quando o componente é desmontado para evitar vazamentos de memória.
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // ATUALIZADO com dependência

  // O valor que será fornecido a todos os componentes filhos.
  const value = {
    supabase,
    session,
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook customizado para acessar o contexto de autenticação.
 * Garante que o hook só possa ser usado dentro de um AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};