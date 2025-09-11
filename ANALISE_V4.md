# Análise e Roteiro do Projeto Oráculo (v4)

Data da Análise: 11/09/2025

## Resumo Geral

O MVP funcional foi alcançado e testado extensivamente. A análise revelou que, embora o pipeline tecnológico principal esteja operacional, existem bugs críticos, funcionalidades de UX ausentes e oportunidades significativas de refinamento estético e funcional.

Este documento serve como o roteiro priorizado para evoluir o Oráculo de um MVP para um produto polido e robusto.

---

## I. Bugs Críticos e Regressões (Prioridade Máxima)

Estas são funcionalidades que estão quebradas e impedem o fluxo principal do usuário.

1.  **Processamento de Arquivos Travado em "PENDING"**
    *   **Sintoma:** Após o upload, o arquivo aparece na lista como "PENDING", mas o processamento no backend (worker) não é concluído. O status nunca muda para "COMPLETED".
    *   **Impacto:** Crítico. Impede a funcionalidade principal de RAG.

2.  **Funcionalidade de Exclusão Quebrada**
    *   **Sintoma:** Clicar em "Deletar" e confirmar a ação resulta em um erro `404 Not Found` na chamada de API (`DELETE /api/v1/documents/61`). O arquivo não é removido da UI, do banco de dados ou do Storage.
    *   **Impacto:** Crítico. Impede o gerenciamento de arquivos.

3.  **Chat Não Funcional**
    *   **Sintoma:** A interface do chat exibe a mensagem "Em breve..." e não está conectada à API do backend.
    *   **Impacto:** Crítico. A funcionalidade principal de conversação está ausente.

4.  **Redirecionamento de "Reset de Senha" Quebrado**
    *   **Sintoma:** O link no email de "Reset Your Password" redireciona para uma página `404`.
    *   **Impacto:** Alto. Impede a recuperação de conta.

---

## II. Melhorias de UX Essenciais (Prioridade Alta)

Funcionalidades e ajustes que são padrão em aplicações modernas e impactam diretamente a usabilidade.

1.  **Fluxo de Autenticação Completo:**
    *   **Validação de Senha:** Adicionar validação no frontend para senhas fracas durante o registro.
    *   **Feedback de Erro:** Fornecer feedback claro para o usuário em cenários de falha (ex: "Email não cadastrado" na página de "esqueceu a senha").
    *   **Página de Verificação de Email:** Criar uma página que informa ao usuário para verificar seu email após o registro.
    *   **Redirecionamento Pós-Reset:** Após solicitar a redefinição de senha, redirecionar o usuário para uma página de "Verifique seu email".

2.  **Gerenciamento de Workspaces:**
    *   **Impedir Nomes Duplicados:** Adicionar validação no backend para impedir a criação de workspaces com nomes idênticos para o mesmo usuário e notificar o frontend com um "toast".
    *   **Opções de Edição:** Adicionar um `DropdownMenu` a cada card de workspace com opções para "Renomear" e "Deletar".

3.  **Interação com Arquivos:**
    *   **Confirmação de Exclusão:** O diálogo de confirmação já existe, mas precisa ser conectado à funcionalidade de exclusão funcional.
    *   **Limpar Input de Arquivo:** Após um upload bem-sucedido, o campo de seleção de arquivo deve ser limpo.

---

## III. Refinamento de UI e Layout (Prioridade Média)

Melhorias visuais e estruturais para criar uma experiência profissional e intuitiva.

1.  **Layout de Navegação Principal:**
    *   **Barra Lateral Colapsável:** Implementar uma barra lateral de navegação à esquerda que lista os workspaces. Ela deve ter um estado expandido (com nomes) e um colapsado (apenas com ícones).
    *   **Posicionamento Fixo:** Os botões "+ Novo Workspace" e "Sair" devem ficar fixos no topo e no final da barra lateral, respectivamente, sempre visíveis, sem rolar com a lista de workspaces.

2.  **Página do Workspace:**
    *   **Layout dos Painéis:** Ajustar o tamanho padrão do painel esquerdo para 70% e permitir que ele seja totalmente colapsado.
    *   **Estilo da Lista de Arquivos:** Diminuir o espaçamento e o tamanho da fonte na tabela de arquivos para um visual mais denso e profissional.
    *   **Indicadores de Status Visuais:** Substituir o texto de status ("PENDING", etc.) por ícones animados para uma comunicação mais rápida e visual.
    *   **Nomes de Arquivo:** Exibir o nome original do arquivo para o usuário, não o nome sanitizado. O nome sanitizado deve ser usado apenas internamente.

3.  **Notificações (Toasts):**
    *   Expandir o uso de "toasts" para todas as ações importantes (criação de workspace, exclusão de arquivo, erros, etc.).

---

## IV. Visão de Longo Prazo (Funcionalidades Futuras)

-   **Organização por Pastas:** Implementar um sistema de pastas e subpastas no painel de arquivos.
-   **Login Social:** Adicionar a opção de "Entrar com uma conta do Google".
-   **Múltiplos Chats por Workspace:** Permitir que o usuário crie diferentes threads de conversa dentro do mesmo workspace.
-   **Pré-visualização de Arquivos:** Implementar uma funcionalidade para visualizar o conteúdo dos PDFs diretamente na interface.