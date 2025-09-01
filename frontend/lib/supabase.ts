import { createClient } from '@supabase/supabase-js'

// Buscamos a URL e a Chave Anônima do Supabase das variáveis de ambiente.
// O prefixo NEXT_PUBLIC_ é necessário para que o Next.js exponha essas
// variáveis para o navegador de forma segura.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// É uma boa prática garantir que as variáveis de ambiente essenciais
// foram carregadas antes de tentar usá-las. Se não, falhamos rapidamente.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or anon key is missing from environment variables.')
}

// Criamos e exportamos a instância única do cliente Supabase.
// Este cliente será nosso ponto de entrada para todas as interações com o Supabase.
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const createSupabaseClient = () => {
  return createClientComponentClient();
};
