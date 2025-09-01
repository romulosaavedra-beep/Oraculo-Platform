'use client';

import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/workspace/FileUploader';
import FileList from '@/components/workspace/FileList';

// Define the type for a workspace
interface Workspace {
  id: string;
  name: string;
  system_prompt: string | null;
  created_at: string;
}

// Define the props for the page component, including the params
interface WorkspacePageProps {
  params: {
    workspaceId: string;
  };
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  const { workspaceId } = params;
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createSupabaseClient();

  useEffect(() => {
    if (authLoading) {
      return; // Wait for authentication to be resolved
    }

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchWorkspace = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('workspaces')
          .select('*')
          .eq('id', workspaceId)
          .eq('user_id', user.id) // Security: Ensure the user owns this workspace
          .single(); // We expect only one result

        if (fetchError) {
          if (fetchError.code === 'PGRST116') { // PostgREST error for "exact one row not found"
            setError('Workspace não encontrado ou você não tem permissão para acessá-lo.');
          } else {
            throw fetchError;
          }
        }

        setWorkspace(data);
      } catch (err: any) {
        console.error("Erro ao buscar o workspace:", err);
        setError(err.message || 'Ocorreu um erro ao buscar os dados do workspace.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();

  }, [workspaceId, user, authLoading, router, supabase]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <p className="text-lg text-gray-500">Carregando workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full bg-red-50 p-8 rounded-md">
        <p className="text-lg text-red-600">Erro: {error}</p>
      </div>
    );
  }

  if (!workspace) {
    // This case should be covered by the error state, but as a fallback
    return (
        <div className="flex justify-center items-center h-full p-8">
            <p className="text-lg text-gray-500">Workspace não encontrado.</p>
        </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {workspace.name}
      </h1>
      {/* Future components will go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <FileUploader workspaceId={workspace.id} />
          <FileList workspaceId={workspace.id} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Chat</h2>
          {/* Placeholder for ChatInterface */}
          <p className="text-gray-500">Em breve...</p>
        </div>
      </div>
    </div>
  );
}
