"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { createClient } from "@/lib/supabase";
import WorkspaceNav from "@/components/layout/WorkspaceNav"; // Importando o novo componente

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

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

          {/* Componente de navegação dos workspaces */}
          <WorkspaceNav />
          
          {/* Botão de Logout permanece no layout principal */}
          <div className="mt-2">
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2">
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
