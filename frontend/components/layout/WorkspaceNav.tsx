"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function WorkspaceNav() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const pathname = usePathname();

  const {
    data: workspaces,
    isLoading: isWorkspacesLoading,
    isError,
  } = useQuery({
    queryKey: ["workspaces", user?.id],
    queryFn: fetchWorkspaces,
    enabled: !!user,
  });

  return (
    <>
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
      </div>
    </>
  );
}
