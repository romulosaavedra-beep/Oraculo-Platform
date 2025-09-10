'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/workspace/FileUploader';
import FileList from '@/components/workspace/FileList';

// Tipagem para o workspace
interface Workspace {
  id: string;
  name: string;
  system_prompt: string | null;
  created_at: string;
}

// Props da página, incluindo os parâmetros da URL
interface WorkspacePageProps {
  params: {
    workspaceId: string;
  };
}

// Função de busca de dados para um único workspace
const fetchWorkspace = async (workspaceId: string, userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', workspaceId)
    .eq('user_id', userId) // Segurança: Garante que o usuário é o dono
    .single();

  if (error) {
    // Lança um erro específico se não for encontrado, para tratamento na UI
    if (error.code === 'PGRST116') {
      throw new Error('Workspace não encontrado ou você não tem permissão para acessá-lo.');
    }
    throw new Error(error.message);
  }

  return data;
};

export default function WorkspacePage({ params }: WorkspacePageProps) {
  const { workspaceId } = params;
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const { 
    data: workspace, 
    isLoading: isWorkspaceLoading, 
    isError, 
    error 
  } = useQuery<Workspace, Error>({
    queryKey: ['workspace', workspaceId, user?.id],
    queryFn: () => fetchWorkspace(workspaceId, user!.id),
    enabled: !!user, // Só executa a query se o usuário estiver logado
  });

  // Redireciona se a autenticação falhar
  if (!isAuthLoading && !user) {
    router.push('/login');
    return null;
  }

  // Estado de carregamento combinado
  if (isAuthLoading || isWorkspaceLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <p className="text-lg text-gray-500">Carregando workspace...</p>
      </div>
    );
  }

  // Estado de erro
  if (isError) {
    return (
      <div className="flex justify-center items-center h-full bg-red-50 p-8 rounded-md">
        <p className="text-lg text-red-600">Erro: {error.message}</p>
      </div>
    );
  }

  // Fallback caso o workspace não seja encontrado (embora o erro deva pegar isso)
  if (!workspace) {
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