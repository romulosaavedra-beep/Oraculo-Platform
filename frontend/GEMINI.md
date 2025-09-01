# Contexto do Frontend do Oráculo (GEMINI.md - Frontend)

Este diretório contém todo o código da interface do usuário para o Projeto Oráculo. As regras e personas do `GEMINI.md` da raiz se aplicam aqui também.

## Contexto Específico do Frontend

O frontend é uma Single-Page Application (SPA) construída para oferecer uma experiência de usuário fluida e reativa. Ele é responsável por:
1.  Autenticação de usuários via Supabase Auth UI ou chamadas diretas.
2.  Gerenciar a exibição e interação com os workspaces.
3.  Fornecer a interface de chat.
4.  Lidar com o upload de arquivos e exibir o status do processamento em tempo real (via Supabase Realtime).

## Stack Tecnológica Específica do Frontend

- **Framework:** Next.js 14+ com **App Router**.
- **Linguagem:** TypeScript. **O uso de `any` é estritamente proibido.**
- **Estilização:** Tailwind CSS. Vamos usar **Shadcn/UI** para componentes de UI, pois ele é construído sobre Tailwind e Radix, garantindo acessibilidade.
- **Gerenciamento de Estado do Servidor:** React Query (TanStack Query). Use-o para todas as chamadas à nossa API (fetching, caching, mutações).
- **Gerenciamento de Estado Global do Cliente:** Zustand. Use-o para estados globais simples, como informações do usuário logado ou o tema da UI.
- **Comunicação com a API:** Um cliente `axios` pré-configurado em `services/apiClient.ts`.

## Padrões de Código e Boas Práticas (Frontend)

1.  **Componentes Server-First:** Por padrão, os componentes devem ser Componentes de Servidor. Adicione `"use client"` apenas quando for estritamente necessário (ex: uso de hooks como `useState`, `useEffect`, ou interatividade).
2.  **Estrutura de Pastas:** Siga a estrutura do App Router (`(grouping)`, `page.tsx`, `layout.tsx`, `loading.tsx`).
3.  **Componentização:** Divida a UI em componentes pequenos, reutilizáveis e com propósito único, localizados na pasta `components/`.
4.  **Hooks Customizados:** Encapsule lógica reutilizável em hooks customizados (ex: `useWorkspace.ts`).
5.  **Tipagem de API:** Defina tipos TypeScript para os payloads da API para garantir a segurança de tipos entre o frontend e o backend.

## Exemplo de Prompt para o Frontend

"Gemini, vamos criar a página principal de um workspace em `app/(dashboard)/workspaces/[workspaceId]/page.tsx`. Esta página deve buscar os detalhes do workspace usando React Query e exibir o nome do workspace. Ela também deve conter os componentes `FileManager` e `ChatInterface` que criaremos depois. Por favor, crie a estrutura básica deste componente de página."