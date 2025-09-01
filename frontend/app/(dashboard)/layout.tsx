// frontend/app/(dashboard)/layout.tsx

import React from 'react';

// Este é o layout para todas as páginas dentro do dashboard.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* No futuro, podemos adicionar um cabeçalho ou menu lateral aqui */}
      {children}
    </section>
  );
}