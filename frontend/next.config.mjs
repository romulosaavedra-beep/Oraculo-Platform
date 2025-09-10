/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... (a configuração de `rewrites` continua aqui)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },

  // ADICIONE ESTA LINHA
  reactStrictMode: false,
};

export default nextConfig;