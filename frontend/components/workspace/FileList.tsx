'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import { useToast } from '@/components/hooks/use-toast';
import { Trash2, FileText, Loader2 } from 'lucide-react';

import apiClient from '@/services/apiClient';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

interface Document {
  id: string;
  name: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

interface FileListProps {
  workspaceId: string;
}

// API Functions
const fetchFiles = async (workspaceId: string): Promise<Document[]> => {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}/documents`);
    return data;
};

const deleteFile = async (documentId: string) => {
    const { data } = await apiClient.delete(`/documents/${documentId}`);
    return data;
};

// Loading Skeleton
const FileListSkeleton = () => (
    <div className="space-y-2 mt-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
    </div>
);

export default function FileList({ workspaceId }: FileListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: files, isLoading, isError } = useQuery<Document[]>({ 
    queryKey: ['workspaceFiles', workspaceId], 
    queryFn: () => fetchFiles(workspaceId),
    enabled: !!workspaceId,
    refetchInterval: 5000, // Real-time status updates
  });

  const mutation = useMutation({ 
      mutationFn: deleteFile,
      onSuccess: (data) => {
        toast({ title: "Sucesso", description: `Arquivo "${data.name}" deletado.` });
        queryClient.invalidateQueries({ queryKey: ['workspaceFiles', workspaceId] });
      },
      onError: (error: Error) => {
        toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
      },
      onSettled: () => {
        setIsDialogOpen(false); // Close dialog on completion
      }
  });

  const handleDelete = (documentId: string) => {
    mutation.mutate(documentId);
  };

  if (isLoading) return <FileListSkeleton />;
  if (isError) return <p className="text-sm text-destructive">Não foi possível carregar os documentos.</p>;

  return (
    <div className="mt-6 border rounded-lg bg-background shadow-sm">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {files && files.length > 0 ? (
                    files.map((file) => (
                    <TableRow key={file.id}>
                        <TableCell className="font-medium flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground"/>{file.name}</TableCell>
                        <TableCell>{file.status}</TableCell>
                        <TableCell className="text-right">
                        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={mutation.isPending}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso irá deletar permanentemente o arquivo e todos os seus dados associados.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel disabled={mutation.isPending}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(file.id)} disabled={mutation.isPending}>
                                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                                    Confirmar
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                            Nenhum documento encontrado.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
  );
}
