'use client';

import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { FileObject } from '@supabase/storage-js';

interface FileListProps {
  workspaceId: string;
}

export default function FileList({ workspaceId }: FileListProps) {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const supabase = createSupabaseClient();

  useEffect(() => {
    if (!user) {
      // Wait for the user to be available
      return;
    }

    const fetchFiles = async () => {
      setLoading(true);
      setError(null);

      const path = `${user.id}/${workspaceId}`;

      try {
        const { data, error: listError } = await supabase.storage
          .from('workspaces_data')
          .list(path, {
            limit: 100, // You can adjust the limit as needed
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
          });

        if (listError) {
          throw listError;
        }

        setFiles(data || []);
      } catch (err: any) {
        console.error("Erro ao listar arquivos:", err);
        setError("Não foi possível carregar a lista de arquivos.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [workspaceId, user, supabase]);

  if (loading) {
    return <p className="text-sm text-gray-500">Carregando arquivos...</p>;
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
