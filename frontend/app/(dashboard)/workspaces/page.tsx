"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';

// A função de busca de dados, agora usando nosso cliente de API.
const fetchWorkspaces = async () => {
  // O token de autenticação é adicionado automaticamente pelo interceptor do axios.
  const { data } = await apiClient.get('/workspaces/');
  return data;
};

export default function WorkspacesPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Usando o hook useQuery para buscar os dados
  const { 
    data: workspaces, 
    isLoading: isWorkspacesLoading, 
    isError, 
    error 
  } = useQuery({
    // Chave única para esta query.
    queryKey: ['workspaces', user?.id], 
    // A função que busca os dados.
    queryFn: fetchWorkspaces, // ATUALIZADO
    // A query só será executada se o user.id existir (usuário está logado).
    enabled: !!user,
  });

  // Redireciona se a autenticação terminar e não houver usuário
  if (!isAuthLoading && !user) {
    router.push('/login');
    return null; // Retorna nulo enquanto redireciona
  }

  // Estado de carregamento combinado
  if (isAuthLoading || isWorkspacesLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <p className="text-lg text-gray-500">Carregando workspaces...</p>
      </div>
    );
  }

  // Estado de erro
  if (isError) {
    return (
      <div className="flex justify-center items-center h-full bg-red-50 p-8 rounded-md">
        <p className="text-lg text-red-600">Erro ao carregar workspaces: {error.message}</p>
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

      {workspaces && workspaces.length === 0 ? (
        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhum workspace encontrado.</p>
          <p className="text-sm text-gray-400 mt-2">Crie seu primeiro workspace para começar a organizar seus projetos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces?.map((ws) => (
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