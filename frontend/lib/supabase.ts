import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

/**
 * Cria um cliente Supabase para uso em Componentes de Cliente (Client Components).
 * 
 * Esta é a forma padronizada e recomendada de interagir com o Supabase
 * em qualquer componente que use o hook "use client". Ele garante que a sessão
 * do usuário seja corretamente gerenciada no lado do navegador.
 * 
 * Não é mais necessário verificar as variáveis de ambiente aqui, pois o Next.js
 * já o faz durante o processo de build.
 */
export const createClient = () => createClientComponentClient()