# Hub Tupiniquim

Aplicação interna da Agência Tupiniquim para centralizar métricas, qualidade de contatos, análises e relatórios por cliente. Consulte `MVP.md` para o escopo do produto e `arquitetura.md` para a organização proposta.

Para retomar o trabalho em outra sessão ou com outra IA, comece por `AI_MEMORY.md`.

## Requisitos

- Node.js 24+
- pnpm 12+

## Desenvolvimento local

```powershell
pnpm install
pnpm dev
```

O app Next.js ficará disponível em `http://127.0.0.1:3000`.

## Autenticação

O login usa Supabase Auth e não oferece cadastro público. Consulte
[`docs/authentication.md`](./docs/authentication.md) para configurar o projeto,
aplicar a migração e criar o primeiro usuário administrador.

## Verificações

```powershell
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## Estrutura

- `apps/web`: aplicação Next.js (App Router) e regras/casos de uso do servidor.
- `packages/ui`: tokens visuais e componentes reutilizáveis.
- `.github/`: instruções e prompts para o GitHub Copilot.
- `.agents/skills/`: skills de engenharia instaladas de `mattpocock/skills`; consulte `docs/engineering-skills.md`.
- `docs/`: decisões iniciais de arquitetura, integrações e segurança.

A autenticação Supabase está implementada, mas depende da configuração local e
da criação do perfil administrador. A conexão Google Ads e o provedor de IA
ainda não estão configurados. Não há dados reais de clientes nesta fundação.
