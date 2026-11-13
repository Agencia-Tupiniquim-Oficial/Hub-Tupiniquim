# Integrações

## Status

O adaptador de leitura do Google Ads está preparado no backend, mas ainda não há credenciais configuradas nem consulta ao vivo. O app continua sem dados reais de contas. A conexão de IA em runtime permanece para a última etapa.

## Ordem do piloto

1. Conectar o backend à Google Ads API direta, começando pela descoberta de contas acessíveis, em leitura.
2. Depois, escolher e validar a API/MCP de Meta Ads, também começando em leitura.
3. Manter testes automatizados com respostas sintéticas; uma verificação ao vivo só acontece depois de configurar credenciais e confirmar a conta autorizada.

O MCP oficial do Google Ads pode ser usado separadamente no VS Code para exploração. Ele não será iniciado pelo backend Next.js. Nenhuma escrita em campanhas faz parte deste piloto.

## Como o Hub usará os MCPs

Na etapa final, a IA do próprio Hub poderá consultar dados de desempenho pelo Reportei MCP e usar esses dados como contexto para análises e propostas de campanha em vários canais. A execução será feita por conexão direta do Hub com a API oficial ou MCP validado de cada plataforma (Meta, Google Ads e outras priorizadas), somente para ações permitidas e após o fluxo de rascunho e aprovação. O MCP é a interface de ferramentas; não substitui nem fornece o modelo de IA. O Hub continuará responsável por permissões, aprovações e auditoria.

O guia de prompts da live do Reportei é referência de fluxo e organização, não uma dependência do assistente interno do Reportei. Os relatórios manuais enviados servem como referência visual e de qualidade. Métricas e conclusões devem permanecer específicas de cada cliente; não reutilizar dados de um cliente em outro.

## Reportei

A documentação oficial descreve um servidor MCP remoto em `https://app.reportei.com/mcp`, autenticado com OAuth 2.1/PKCE, e um escopo `mcp:tools`. Ele oferece leitura de projetos, integrações e métricas, incluindo resumo agregado de campanhas (`get_campaign_summary`). Também há ferramentas de escrita para objetos do próprio Reportei, como relatórios, dashboards, metas, automações, timeline e webhooks; a documentação não lista criação ou edição de campanhas publicitárias. Fonte: [Reportei MCP](https://developers.reportei.com/mcp).

A conexão concede acesso aos dados das empresas às quais a conta autenticada pertence. Como a página apresenta descrições divergentes sobre o escopo exato das empresas, validar esse acesso na conta antes do piloto. O Hub deve aplicar sua própria autorização por cliente e disponibilizar ferramentas por allowlist; o escopo MCP amplo não substitui as permissões do Hub.

Segundo a resposta do suporte Reportei fornecida pelo usuário, ao usar um agente externo o consumo é da conta de tokens do próprio agente/modelo; os tokens do Reportei são usados no assistente interno do Reportei. A página técnica não documenta faturamento de tokens de IA. O provedor e o orçamento de runtime serão decididos na etapa final.

## Meta Ads

O suporte Reportei informou, na conversa fornecida pelo usuário, que para criar campanhas com um assistente externo é necessário conectar a ferramenta da plataforma diretamente ao assistente. Assim, os dados obtidos pelo Reportei podem subsidiar a análise, mas a criação ou alteração acontece pela conexão direta com a plataforma de anúncios, não pelo Reportei. Para a Meta, ainda é necessário confirmar qual servidor será escolhido, sua origem, escopos e garantias de aprovação.

Qualquer ação de escrita continuará passando por rascunho, autorização do Hub, aprovação humana e auditoria. A confirmação eventualmente oferecida pelo servidor externo não substitui o fluxo de aprovação do Hub.

## Google Ads

O backend do Hub chama a API REST oficial diretamente. A primeira operação é `customers:listAccessibleCustomers`, que retorna somente IDs de contas diretamente acessíveis à identidade Google autenticada; não consulta métricas nem altera contas. Contas filhas acessíveis por uma conta de administrador (MCC) podem exigir uma consulta posterior a `customer_client` e vínculo explícito no Hub.

Na Vercel, o adaptador usa OIDC da própria plataforma e Workload Identity Federation do Google Cloud para impersonar uma service account dedicada. O token OIDC é de curta duração; não há chave JSON, ADC pessoal ou credencial de longa duração no computador ou no repositório. A service account precisa ser adicionada à conta Google Ads/MCC com papel **Somente leitura**.

O escopo OAuth `adwords` não é um escopo somente leitura. As permissões de leitura/escrita são determinadas pelo papel da identidade na conta Google Ads. Para o piloto de leitura, autentique com uma identidade que tenha papel **Somente leitura** no MCC/conta; não use uma identidade administradora se a exigência for limitar também o próprio token. O endpoint implementado atualmente só executa uma consulta GET para listar contas acessíveis, sem métricas ou mutações.

O Hub permanece em modo somente leitura: não há rota nem adaptador de escrita para Google Ads. Uma futura escrita só poderá ser implementada após autorização explícita de uma pessoa administradora designada, com rascunho, diff, autorização do cliente e auditoria. Essa regra da aplicação é uma proteção adicional; não reduz as permissões do token OAuth. Sem aprovação, a execução deve falhar fechada.

### Configuração do Google Ads na Vercel

1. No Google Cloud project da agência, habilite a Google Ads API e confira o nível em [API access](https://console.cloud.google.com/google/ads-apis/overview). Para contas reais, o projeto precisa ter o nível adequado. Não crie developer token.
2. Na Vercel, habilite **Secure backend access with OIDC** para o projeto. Use o issuer da equipe e restrinja o provider GCP à equipe, projeto e ambiente de produção da Vercel.
3. No Google Cloud, crie um Workload Identity Pool e um provider OIDC que confie no issuer da Vercel. Mapeie `google.subject` para `assertion.sub` e permita a audiência padrão `https://vercel.com/<TEAM_SLUG>`. Siga o [guia oficial da Vercel para GCP](https://vercel.com/docs/oidc/gcp) para criar o vínculo de impersonação da service account.
4. Crie uma service account dedicada, sem chave JSON, e conceda a identidade federada da Vercel somente a permissão necessária para impersoná-la. Adicione o e-mail dessa service account ao Google Ads em **Admin → Access and security** com papel **Somente leitura**. Para MCC, conceda acesso no gerenciador apropriado.
5. Configure na Vercel, apenas no ambiente **Production**, os valores não secretos `GOOGLE_ADS_GCP_PROJECT_NUMBER`, `GOOGLE_ADS_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_ADS_WIF_POOL_ID` e `GOOGLE_ADS_WIF_PROVIDER_ID`. Configure também `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` para o login. Não adicione `VERCEL_OIDC_TOKEN` manualmente; a Vercel fornece esse token durante a execução.
6. Faça um novo deploy para aplicar as variáveis e acesse `GET /api/integrations/google-ads/accounts` com uma sessão Supabase cujo perfil seja `administrator`. A resposta lista IDs diretamente acessíveis, sem nomes ou métricas.

O token OAuth usa o escopo `https://www.googleapis.com/auth/adwords`, que não é somente leitura por si só. O papel Somente leitura atribuído à service account no Google Ads é o controle de acesso efetivo. A aplicação continua sem operações de escrita.

Developer tokens foram encerrados em 9 de setembro de 2026; o nível de acesso passou a ser associado ao Google Cloud project. Não crie nem configure um developer token para esta integração. Consulte a [documentação oficial de níveis de acesso](https://developers.google.com/google-ads/api/docs/api-policy/access-levels) e a [documentação oficial sobre developer tokens](https://developers.google.com/google-ads/api/docs/api-policy/developer-token).

O servidor MCP oficial [`googleads/google-ads-mcp`](https://github.com/googleads/google-ads-mcp) é uma ferramenta opcional para clientes de IA, como VS Code. Ele documenta consultas e mutações limitadas de assets e labels, mas não criação/edição completa de campanhas; por isso, não é a interface do backend do Hub.

## Outras plataformas de anúncios

Cada plataforma adicional deverá ter integração direta pela API oficial ou por MCP validado. Não presumir paridade entre canais: confirmar operações de leitura e escrita, permissões, limites e fluxo de confirmação antes de incluí-la no MVP. As ferramentas de escrita passam pelo mesmo fluxo de rascunho, diff, aprovação e auditoria do Hub.

## Sheets, Drive e Reportei API

Google Sheets permanece como fonte de leitura dos dados comerciais; Google Drive, destino de relatórios aprovados. Para tarefas agendadas e repetíveis, preferir chamadas de API diretas com validação e registro. Confirmar endpoints, limites e escopos antes de implementar. MCP é apropriado para interação exploratória quando a integração de IA estiver disponível.

## Regras de implementação

- Manter credenciais fora do código, prompts e logs; validar respostas externas como entradas não confiáveis.
- Aplicar autorização por cliente no servidor, independentemente do escopo de uma integração.
- Começar com allowlist de ferramentas de leitura. Toda operação de escrita ou exclusão exige aprovação humana e registro de auditoria.
- Registrar origem, conta/projeto, período, ferramenta, autor e resultado de cada chamada relevante.
- Não usar prompts de análise como substituto para uma coleta determinística de relatórios.
- GitHub Copilot é a ferramenta de desenvolvimento e não é presumido como API de runtime do produto.

Confira a [revisão dos recursos e limitações do Reportei MCP](./reportei-mcp-review.md) antes de desenhar a conexão.
