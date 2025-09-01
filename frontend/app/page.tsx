'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from '@/components/auth/LogoutButton';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        router.push('/workspaces');
      } else {
        router.push('/login');
      }
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </main>
    );
  }

  if (user) {
    return (
      <main className="container mx-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Projeto Oráculo</h1>
          <LogoutButton />
        </header>
        <section>
          <h2 className="text-2xl">Bem-vindo, {user.email}</h2>
          <p className="text-gray-600 mt-2">Você está na página principal.</p>
        </section>
      </main>
    );
  }

  return null; // Should be redirected by useEffect
}