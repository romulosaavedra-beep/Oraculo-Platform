"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, LogOut, Home } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase";


interface Workspace {
  id: string;
  name: string;
}

const fetchWorkspaces = async (): Promise<Workspace[]> => {
  const { data } = await apiClient.get("/workspaces/");
  return data;
};

const WorkspaceNavSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-5/6" />
  </div>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const {
    data: workspaces,
    isLoading: isWorkspacesLoading,
    isError,
  } = useQuery({
    queryKey: ["workspaces", user?.id],
    queryFn: fetchWorkspaces,
    enabled: !!user,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!isAuthLoading && !user) {
    router.push("/login");
    return ( // Render a loading state while redirecting
      <div className="flex h-screen w-full items-center justify-center">
        <p>Redirecionando para o login...</p>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
      <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
        <div className="flex h-full flex-col p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Workspaces</h2>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {isWorkspacesLoading || isAuthLoading ? (
              <WorkspaceNavSkeleton />
            ) : isError ? (
              <p className="text-sm text-red-500">Erro ao carregar.</p>
            ) : (
              workspaces?.map((ws) => (
                <Link
                  key={ws.id}
                  href={`/workspaces/${ws.id}`}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start",
                    pathname === `/workspaces/${ws.id}` && "bg-muted"
                  )}
                >
                  {ws.name}
                </Link>
              ))
            )}
          </nav>
          
          <div className="mt-auto flex flex-col gap-2">
             <Link
                href="/workspaces/new"
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "justify-start gap-2"
                )}
                >
                <PlusCircle className="h-4 w-4" />
                Novo Workspace
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Sair
            </Button>
          </div>

        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80}>
        <main className="h-full overflow-y-auto p-8">{children}</main>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}