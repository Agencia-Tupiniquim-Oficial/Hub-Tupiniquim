# Arquitetura inicial

O workspace usa pnpm e Turborepo, com a aplicação Next.js em `apps/web` e o design system em `packages/ui`.

## Interface

O App Router contém rotas e layouts. A interface segue as camadas FSD: `views`, `widgets`, `features`, `entities` e `shared`. Rotas devem delegar regras ao servidor.

## Servidor

- `server/domain`: regras de negócio puras.
- `server/application`: casos de uso e portas para dependências externas.
- `server/infrastructure`: adaptadores de banco e provedores.

As dependências apontam para dentro; o domínio não importa frameworks nem integrações. A autorização deve ser aplicada no servidor para cada cliente. A política pura em `server/domain/authorization` decide ações por papel e atribuição explícita; Administrador não recebe acesso implícito a todos os clientes.

## Qualidade

TypeScript estrito, Vitest e ciclo TDD. As regras de amostra mínima, fonte/período/evidência, ausência de ROAS sem receita confiável e aprovação humana são requisitos funcionais.
