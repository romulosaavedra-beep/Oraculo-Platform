import axios from 'axios';
import { createClient } from '@/lib/supabase';

// Cria a instância do Axios com a baseURL correta e definitiva
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

// O interceptor anexa o token de autenticação a cada chamada
apiClient.interceptors.request.use(
  async (config) => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;