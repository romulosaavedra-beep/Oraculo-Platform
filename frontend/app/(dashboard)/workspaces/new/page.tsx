"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/services/apiClient';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/components/hooks/use-toast';


// A função que faz a mutação (criação)
const createWorkspace = async (workspaceName: string) => {
  const { data } = await apiClient.post('/workspaces/', { name: workspaceName });
  return data;
};


export default function CreateWorkspacePage() {
  const [workspaceName, setWorkspaceName] = useState('');
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: (data) => {
      toast({
        title: "Sucesso!",
        description: `Workspace "${data.name}" criado.`,
      });
      router.push('/workspaces');
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar workspace",
        description: error.message || "Ocorreu um problema.",
        variant: "destructive",
      });
    },
  });

  const handleCreateWorkspace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user && !authLoading) {
      toast({
        title: "Autenticação necessária",
        description: "Você precisa estar logado para criar um workspace.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }
    
    if (!workspaceName.trim()) {
        toast({
            title: "Nome inválido",
            description: "O nome do workspace não pode estar vazio.",
            variant: "destructive",
        });
        return;
    }

    mutation.mutate(workspaceName);
  };

  return (
    <div className="flex justify-center items-start p-4 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Criar Novo Workspace</CardTitle>
          <CardDescription>
            Dê um nome ao seu novo workspace. Ele servirá como um contêiner para seus documentos e chats.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleCreateWorkspace}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="workspaceName">Nome do Workspace</Label>
                <Input
                  id="workspaceName"
                  placeholder="Ex: Análise de Contratos 2024"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  disabled={mutation.isPending || authLoading}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending || authLoading}>
              {mutation.isPending ? "Criando..." : "Criar Workspace"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}