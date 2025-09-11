'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useToast } from '@/components/hooks/use-toast';
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
import { Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // O usuário será redirecionado para esta página após clicar no link do e-mail
        redirectTo: `${window.location.origin}/auth/update-password`,
    });

    setLoading(false);

    if (error) {
        toast({
            title: "Erro",
            description: error.message,
            variant: "destructive",
        });
    } else {
        toast({
            title: "E-mail enviado!",
            description: "Se existir uma conta com este e-mail, enviamos um link para redefinição de senha.",
        });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handlePasswordReset}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Esqueceu sua senha?</CardTitle>
            <CardDescription>
              Insira seu e-mail e enviaremos um link para você voltar a acessar sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Enviando..." : "Enviar link de redefinição"}
            </Button>
            <Link href="/login" className="text-sm text-muted-foreground hover:underline">
                Voltar para o Login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
