"use client";

import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useAuth } from '@/context/AuthContext'; // Import useAuth

// Definindo a tipagem para um workspace
interface Workspace {
  id: string;
  name: string;
  created_at: string;
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const { user, loading } = useAuth(); // Use the useAuth hook
  const router = useRouter(); // Initialize useRouter

  // Criamos uma instância do cliente Supabase específica para componentes do cliente
  const supabase = createSupabaseClient();

  useEffect(() => {
    if (loading) {
      // Still loading auth state, do nothing yet
      return;
    }

    const fetchWorkspaces = async (userId: string) => {
      try {
        setError(null); // Clear previous errors
        const { data, error } = await supabase
          .from('workspaces')
          .select('id, name, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setWorkspaces(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error("Erro ao buscar workspaces:", err);
      }
    };

    if (!user) {
      // User is not authenticated, redirect to login
      router.push('/login');
      return;
    }

    // User is authenticated, fetch workspaces
    fetchWorkspaces(user.id);

  }, [user, loading, router, supabase]); // Dependencies for useEffect

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    // This case is handled by the redirect in useEffect, but good for initial render
    return null; 
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full bg-red-50 p-4 rounded-md">
        <p className="text-lg text-red-600">Erro: {error}</p>
      </div>
);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Seus Workspaces</h1>
        <Link href="/workspaces/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          + Novo Workspace
        </Link>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhum workspace encontrado.</p>
          <p className="text-sm text-gray-400 mt-2">Crie seu primeiro workspace para começar a organizar seus projetos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((ws) => (
            <div key={ws.id} className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
              <Link href={`/workspaces/${ws.id}`}>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 hover:underline cursor-pointer">{ws.name}</h5>
              </Link>
              <p className="font-normal text-gray-500 text-sm">
                Criado em: {new Date(ws.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
