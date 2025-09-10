'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Erro ao fazer logout:', error.message);
      // Opcional: Adicionar feedback para o usuário aqui
    } else {
      // Redireciona para a página de login e força a atualização do estado
      router.push('/login');
      router.refresh(); 
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Sair
    </button>
  );
}
