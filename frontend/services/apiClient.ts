import axios from 'axios';
import { createClient } from '@/lib/supabase';

// 1. Criação da instância do Axios
const apiClient = axios.create({
  /**
   * A URL base da nossa API FastAPI.
   * Usamos uma variável de ambiente para que possamos facilmente
   * apontar para diferentes ambientes (local, staging, produção).
   */
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Configuração do Interceptor de Requisição
/**
 * O interceptor é uma função que o Axios executa ANTES de cada requisição.
 * Isso nos permite modificar a requisição, como adicionar um cabeçalho de autenticação.
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Usamos nosso cliente Supabase padronizado para obter a sessão.
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();

    // Se uma sessão e um token de acesso existirem, nós o adicionamos
    // ao cabeçalho 'Authorization'.
    if (data.session?.access_token) {
      config.headers['Authorization'] = `Bearer ${data.session.access_token}`;
    }

    return config;
  },
  (error) => {
    // Em caso de erro na configuração da requisição, rejeitamos a promessa.
    return Promise.reject(error);
  }
);

export default apiClient;
