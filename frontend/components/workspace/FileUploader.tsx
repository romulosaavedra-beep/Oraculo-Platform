'use client';

import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createClient } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/hooks/use-toast';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';

interface FileUploaderProps {
  workspaceId: string;
}

import apiClient from '@/services/apiClient';

// A função de mutação que encapsula toda a lógica de upload
const uploadFile = async ({ selectedFile, user, workspaceId, supabase }: any) => {
    if (!selectedFile || !user || !workspaceId) {
        throw new Error("Informações insuficientes para o upload.");
    }

    const sanitizedFileName = selectedFile.name
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');

    const filePath = `${user.id}/${workspaceId}/${sanitizedFileName}`;

    // 1. Upload para o Storage
    const { error: uploadError } = await supabase.storage
        .from('workspaces_data')
        .upload(filePath, selectedFile, { upsert: true });

    if (uploadError) {
        throw new Error(`Falha no upload do arquivo: ${uploadError.message}`);
    }

    // 2. Inserção no Banco de Dados e retorno do ID
    const { data: insertData, error: insertError } = await supabase
        .from('documents')
        .insert({
            name: sanitizedFileName,
            path: filePath,
            user_id: user.id,
            workspace_id: workspaceId,
        })
        .select('id')
        .single();

    if (insertError) {
        // Tenta reverter o upload do storage em caso de falha no DB
        await supabase.storage.from('workspaces_data').remove([filePath]);
        throw new Error(`Falha ao registrar o documento: ${insertError.message}`);
    }

    if (!insertData) {
        throw new Error("Não foi possível obter o ID do documento após a inserção.");
    }

    return { success: true, fileName: selectedFile.name, documentId: insertData.id };
};

// Função de mutação para chamar o endpoint de processamento
const processDocument = async (documentId: number) => {
    const { data } = await apiClient.post(`/workspaces/process-document/${documentId}`);
    return data;
};

export default function FileUploader({ workspaceId }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref para o input
  const { user } = useAuth();
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mutação para iniciar o processamento no backend
  const processFileMutation = useMutation({
    mutationFn: processDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceFiles', workspaceId] });
    },
    onError: (error: any) => {
      toast({
          title: "Erro ao Iniciar Processamento",
          description: error.response?.data?.detail || error.message,
          variant: "destructive"
      });
    }
  });

  // Mutação principal para o upload do arquivo
  const uploadMutation = useMutation({ 
      mutationFn: (file: File) => uploadFile({ selectedFile: file, user, workspaceId, supabase }),
      onSuccess: (data) => {
          toast({
              title: "Sucesso!",
              description: `Arquivo "${data.fileName}" enviado. Iniciando processamento.`
          });
          // Invalida a query para mostrar o status "PENDING" imediatamente
          queryClient.invalidateQueries({ queryKey: ['workspaceFiles', workspaceId] });

          // Chama a segunda mutação para iniciar o processamento
          processFileMutation.mutate(data.documentId);

          // Limpa o input e o estado após o sucesso
          if(fileInputRef.current) {
              fileInputRef.current.value = '';
          }
          setSelectedFile(null);
      },
      onError: (error: Error) => {
        toast({
            title: "Erro no Upload",
            description: error.message,
            variant: "destructive"
        });
      }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const isLoading = uploadMutation.isPending || processFileMutation.isPending;

  return (
    <div className="p-4 border rounded-lg bg-background shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Adicionar Documentos</h3>
      <div className="grid w-full max-w-sm items-center gap-2">
        <Label htmlFor="document">Selecione um arquivo</Label>
        <Input 
            id="document"
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isLoading}
        />
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
          {uploadMutation.isPending ? 'Enviando...' : (processFileMutation.isPending ? 'Processando...' : 'Fazer Upload')}
        </Button>
      </div>
    </div>
  );
}