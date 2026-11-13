# Hub Tupiniquim — memória de continuidade

**Atualizada em:** 2026-11-14
**Objetivo:** permitir que outra sessão ou outro provedor de IA retome o trabalho sem reconstruir o contexto. Leia primeiro este arquivo; consulte os documentos-fonte abaixo para detalhes.

## Projeto

Aplicação interna da Agência Tupiniquim para analisar campanhas, cruzar resultados com qualidade de leads, gerar relatórios por cliente e preparar alterações de campanhas com controle humano.

## Decisões atuais

- GitHub Copilot auxilia o desenvolvimento; o provedor de IA em runtime do produto será decidido e integrado na última etapa.
- A fundação deve avançar sem depender de um provedor de IA ou de integrações reais.
- O acesso a qualquer cliente exige atribuição explícita, inclusive para Administrador.
- O Reportei fornece dados e contexto para análises. Não é o executor de campanhas do Hub.
- Para criar ou alterar campanhas, o Hub se conecta diretamente à API oficial ou a um MCP validado de cada plataforma: Meta, Google Ads e outras que forem priorizadas.
- O backend do Hub usará diretamente a Google Ads API; o MCP oficial fica opcional no VS Code. O MCP documenta mutações limitadas; operações completas dependem da API oficial e permissões.
- Na Vercel, a autenticação Google Ads será via OIDC + Workload Identity Federation com service account dedicada; não usar ADC local nem chave JSON persistente.
- Cada escrita externa exige rascunho, diff, autorização por cliente, aprovação humana e auditoria. As capacidades e permissões devem ser verificadas por plataforma.
- Os relatórios manuais e o guia da live do Reportei enviados pelo usuário são referências de fluxo e qualidade. Preservar dados e conclusões de cada cliente; nunca misturá-los.
- O Hub é interno, sem login para clientes. O login local temporário foi aposentado; o acesso compartilhado usa Supabase Auth.
- A conexão de login e as conexões às plataformas de anúncios são assuntos separados; a integração Google Ads continua no escopo, ainda dependente de credenciais e permissões.
- Direção escolhida para o acesso: Supabase PostgreSQL + Supabase Auth com e-mail/senha, sem cadastro público. O usuário criou o projeto e desativou o cadastro público.
- Não usar Anthropic/Claude, Figma ou Playwright neste projeto.

## Feito

- Criada a fundação monorepo com pnpm/Turborepo, app Next.js/TypeScript e pacote `@tupiniquim/ui`.
- Criadas instruções e prompts do Copilot, além de skills de engenharia em `.agents/skills/`.
- Criado o dashboard inicial sem dados reais e regras de domínio de análise com testes.
- Implementada a política pura de autorização por papel e cliente em `apps/web/src/server/domain/authorization/`; Analista cria rascunhos, Aprovador aprova rascunhos alheios e Administrador não tem acesso implícito a todos os clientes.
- O login administrativo local com Auth.js foi aposentado e removido.
- Integrado login Supabase SSR, resolução de papel pela tabela `profiles`, proteção da rota Google Ads e migração SQL inicial com RLS. O usuário configurou o projeto, criou o perfil administrador e confirmou que o login local funciona.
- Substituído o provedor ADC local do Google Ads por Vercel OIDC + GCP Workload Identity Federation; configuração cloud e acesso read-only da service account ainda pendentes.
- Pesquisadas as capacidades do Reportei MCP e do Google Ads MCP; atualizados o MVP e os documentos de integração para refletir limites e o desenho multi-plataforma.
- Analisados o guia Reportei × Meta Ads e quatro relatórios manuais; padrões e requisitos resumidos em [reporting-examples-analysis.md](./docs/reporting-examples-analysis.md), sem copiar dados de clientes para o app.
- Última validação: 30 testes, lint, typecheck e build Next.js passaram após a mudança para Vercel OIDC. O login real no Supabase foi validado pelo usuário; Google Ads ainda não foi chamado ao vivo.

## Estado atual

- Supabase Auth foi configurado localmente; a migração de perfis foi executada e o login com papel `administrator` foi confirmado.
- O cadastro público segue desativado. Nenhuma senha, chave ou token deve ser enviado pelo chat.
- A política de autorização por cliente ainda não está ligada a rotas ou casos de uso. Não há contas de anúncios conectadas nem dados reais de clientes no app.
- A interface é apenas a fundação do painel. A IA de runtime permanece adiada para a etapa final.
- Os PDFs compartilhados permanecem em `C:\Users\opera\Downloads`; foram analisados como referências de estrutura e fluxo, sem importar seus dados para o app.
- O adaptador de leitura do Google Ads usa Vercel OIDC, mas o provider GCP, a service account, o acesso somente leitura no Google Ads e as variáveis de Vercel ainda precisam ser configurados. O endpoint inicial lista IDs diretamente acessíveis e não consulta métricas nem executa escritas; contas filhas de um MCC exigem descoberta de hierarquia via `customer_client` e vínculo explícito.
- O escopo OAuth `adwords` não limita tokens a leitura; o papel Google Ads da identidade determina as permissões. Para um piloto realmente read-only, usar uma identidade separada com papel Somente leitura (ou alterar o papel com outro administrador), nunca assumir que um token de uma conta Admin é read-only.
- O Hub segue somente leitura: não existe rota/adaptador de escrita Google Ads. Escritas futuras exigem autorização explícita de administrador designado, rascunho/diff, permissão por cliente e auditoria; isso não restringe um token OAuth Admin fora do Hub.
- O usuário informou que criou um Google Cloud project com nome de exibição “Teste hub tupiniquim”, habilitou a Google Ads API e vê nível Explorer; isso ainda não foi verificado diretamente pelo assistente. Falta criar OAuth Desktop client e configurar ADC local.

## Próximos passos

1. Enviar o código ao repositório privado e importar o app na Vercel; configurar as variáveis Supabase e fazer o primeiro deploy.
2. Configurar OIDC/WIF da Vercel, service account e papel somente leitura no Google Ads; definir as variáveis Google Ads na Vercel e testar `GET /api/integrations/google-ads/accounts`.
3. Conectar a política de autorização por cliente à persistência antes de disponibilizar dados de clientes; Administrador não tem acesso implícito a todos os clientes.
4. Depois de validar Google Ads, escolher e testar API/MCP de Meta Ads em leitura, com testes automatizados e revisão de escopos.

## Documentos-fonte

- [MVP e roadmap](./MVP.md) — escopo funcional e pendências do produto.
- [Arquitetura](./arquitetura.md) e [arquitetura técnica](./docs/architecture.md) — estrutura e dependências.
- [Integrações](./docs/integrations.md) e [pesquisa do Reportei MCP](./docs/reportei-mcp-review.md) — capacidades, decisões e ressalvas.
- [Análise dos exemplos de relatórios e prompts](./docs/reporting-examples-analysis.md) — padrões extraídos dos PDFs enviados.
- [Segurança](./docs/security.md) — credenciais, dados e controles.
- [Autenticação Supabase](./docs/authentication.md) — configuração, RLS e provisionamento do usuário inicial.
- [Instruções do Copilot](./.github/copilot-instructions.md) — práticas de implementação e qualidade.

## Regra de manutenção

Ao concluir uma tarefa relevante, atualize “Feito”, “Estado atual” e “Próximos passos” neste arquivo. Mantenha-o conciso: requisitos detalhados, decisões técnicas e resultados de pesquisa pertencem aos documentos-fonte; registre aqui apenas o estado e os links necessários para retomada.
