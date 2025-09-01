'use client';

import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabase';

// Definindo um tipo para os documentos que vêm da tabela
interface Document {
  id: string;
  name: string;
}

interface FileListProps {
  workspaceId: string;
}

export default function FileList({ workspaceId }: FileListProps) {
  // O estado agora armazena um array do nosso tipo Document
  const [files, setFiles] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createSupabaseClient();

  useEffect(() => {
    // A dependência do `user` não é mais necessária aqui, pois a RLS cuida da segurança
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        // A consulta agora é feita na tabela 'documents'
        const { data, error: dbError } = await supabase
          .from('documents')
          .select('id, name') // Selecionamos id e name
          .eq('workspace_id', workspaceId) // Filtramos pelo workspaceId
          .order('name', { ascending: true }); // Ordenamos por nome

        if (dbError) {
          throw dbError;
        }

        setFiles(data || []);
      } catch (err: any) {
        console.error("Erro ao buscar documentos:", err);
        setError("Não foi possível carregar a lista de documentos.");
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) {
      fetchFiles();
    }
  // A dependência do supabase client é estável e pode ser omitida se preferir
  }, [workspaceId, supabase]);

  if (loading) {
    return <p className="text-sm text-gray-500">Carregando documentos...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Documentos no Workspace</h3>
      {files.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum documento encontrado.</p>
      ) : (
        <ul className="list-disc list-inside space-y-2">
          {files.map((file) => (
            <li key={file.id} className="text-gray-700">
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}