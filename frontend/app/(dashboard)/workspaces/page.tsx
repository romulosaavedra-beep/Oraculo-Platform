"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Definindo a tipagem para um workspace
interface Workspace {
    id: string;
    name: string;
    created_at: string;
}

// A função de busca de dados, agora usando nosso cliente de API.
const fetchWorkspaces = async (): Promise<Workspace[]> => {
    const { data } = await apiClient.get('/workspaces/');
    return data;
};

// Componente para o estado de carregamento
const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-1/2" />
                </CardContent>
            </Card>
        ))}
    </div>
);

// Componente para o estado vazio
const EmptyState = () => (
    <div className="text-center py-16 px-6 bg-muted/40 rounded-lg border-2 border-dashed">
        <h3 className="text-xl font-semibold text-foreground">Nenhum workspace encontrado</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-4">
            Crie seu primeiro workspace para começar a organizar seus projetos.
        </p>
        <Button asChild>
            <Link href="/workspaces/new">Criar Workspace</Link>
        </Button>
    </div>
);

export default function WorkspacesPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const { 
        data: workspaces, 
        isLoading: isWorkspacesLoading, 
        isError, 
        error 
    } = useQuery({
        queryKey: ['workspaces', user?.id], 
        queryFn: fetchWorkspaces,
        enabled: !!user,
    });

    if (!isAuthLoading && !user) {
        router.push('/login');
        return <LoadingSkeleton />; // Mostra o skeleton enquanto redireciona
    }

    if (isAuthLoading || isWorkspacesLoading) {
        return <LoadingSkeleton />;
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-full bg-destructive/10 p-8 rounded-md">
                <p className="text-lg text-destructive">Erro ao carregar workspaces: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Seus Workspaces</h1>
                <Button asChild>
                    <Link href="/workspaces/new">+ Novo Workspace</Link>
                </Button>
            </div>

            {workspaces && workspaces.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workspaces?.map((ws) => (
                        <Link href={`/workspaces/${ws.id}`} key={ws.id} className="block hover:no-underline">
                            <Card className="h-full hover:border-primary/80 hover:shadow-md transition-all duration-200">
                                <CardHeader>
                                    <CardTitle className="truncate">{ws.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Criado em: {format(new Date(ws.created_at), "dd/MM/yyyy")}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
