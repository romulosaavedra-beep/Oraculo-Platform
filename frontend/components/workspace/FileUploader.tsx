'use client';

import { useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface FileUploaderProps {
  workspaceId: string;
}

export default function FileUploader({ workspaceId }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { user } = useAuth();
  const supabase = createSupabaseClient();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setMessage(null); // Clear previous messages
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Por favor, selecione um arquivo primeiro.");
      return;
    }

    if (!user) {
      setMessage("Você precisa estar logado para fazer o upload.");
      return;
    }

    setUploading(true);
    setMessage(`Fazendo upload de: ${selectedFile.name}...`);

    // Sanitize the file name to prevent invalid key errors
    const sanitizedFileName = selectedFile.name
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9._-]/g, ''); // Remove special characters except dot, underscore, hyphen

    const filePath = `${user.id}/${workspaceId}/${sanitizedFileName}`;

    try {
      const { error } = await supabase.storage
        .from('workspaces_data') // Make sure this bucket exists
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true, // Overwrite file if it already exists
        });

      if (error) {
        throw error;
      }

      setMessage(`Arquivo "${selectedFile.name}" enviado com sucesso!`);
      // Don't clear the file input so user can see what was uploaded
      // setSelectedFile(null);
    } catch (err: any) {
      console.error("Erro no upload:", err);
      setMessage(`Erro ao enviar o arquivo: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Adicionar Documentos</h3>
      <div className="flex flex-col gap-4">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Enviando...' : 'Fazer Upload'}
        </button>
      </div>
      {message && (
        <p className={`mt-3 text-sm ${message.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
