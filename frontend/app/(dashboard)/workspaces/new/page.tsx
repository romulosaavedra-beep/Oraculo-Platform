"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function CreateWorkspacePage() {
  const [workspaceName, setWorkspaceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createSupabaseClient();
  const { user, loading: authLoading } = useAuth(); // Renamed loading to authLoading to avoid conflict

  const handleCreateWorkspace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (authLoading) {
      setError("Aguarde a autenticação ser carregada.");
      setLoading(false);
      return;
    }

    if (!user) {
      setError("Você precisa estar logado para criar um workspace.");
      setLoading(false);
      router.push('/login'); // Redirect to login if not authenticated
      return;
    }

    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert({ name: workspaceName })
        .select(); // Select the inserted data to confirm

      if (error) {
        throw error;
      }

      console.log('Workspace criado:', data);
      router.push('/workspaces'); // Redirect to workspaces list on success

    } catch (err: any) {
      setError(err.message);
      console.error("Erro ao criar workspace:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Criar Novo Workspace
        </h1>
        <form onSubmit={handleCreateWorkspace}>
          <div className="mb-4">
            <label
              htmlFor="workspaceName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Nome do Workspace
            </label>
            <input
              type="text"
              id="workspaceName"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading || authLoading}
          >
            {loading ? "Criando..." : "Criar Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}
