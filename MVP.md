# Hub Tupiniquim — MVP da aplicação interna

Proposta para apresentação interna • Agência Tupiniquim • 10/11/2026 • Rascunho para validação

## 1. Resumo

Hoje os relatórios, as análises e as automações da agência dependem de uma pessoa, de um computador e de uma conversa com IA. O **Hub Tupiniquim** é uma aplicação web interna, com painel visual e chat, onde todo o time pede relatórios, vê quais campanhas deram certo, encontra gargalos e prepara novas campanhas, tudo no padrão da agência, com aprovação humana e registro de cada ação.

**O que o MVP entrega:**

- Login do time com Google (domínio da agência) e acesso por cliente.
- Painel por cliente com investimento, resultados e qualidade dos contatos.
- Chat para pedir análises e relatórios em linguagem natural.
- Relatório mensal em PDF no padrão Tupiniquim, salvo no Drive com a nomenclatura certa.
- Radar de campanhas vencedoras e de gargalos.
- Rascunho de novas campanhas baseado nas vencedoras, com fila de aprovação e trilha de auditoria.

**O que fica de fora do MVP:** aplicar mudanças automaticamente sem aprovação, otimização semanal autônoma e cálculo de ROAS (faltam dados de contrato e receita nos clientes).

## 2. Problema que resolvemos

Pontos observados no handoff do fluxo atual:

- **Dependência de uma pessoa e de uma máquina.** Scripts e credenciais ficam em pastas locais do Windows; outra pessoa ou outra IA não herda sessões, conectores nem agendamentos.
- **Regras só em texto.** Logo, paleta, nomenclatura, pastas e período do relatório estão num arquivo Markdown e na memória do chefe.
- **Estado não verificável.** Não há como confirmar se a automação mensal está ativa, o que foi enviado ou o que foi aplicado em cada conta.
- **Sem trilha de auditoria.** Falta registro de quem pediu, quem aprovou e o que mudou.
- **Dados espalhados.** Google Ads, Reportei, planilha de leads e Drive são cruzados à mão.
- **Acesso à API do Google Ads no nível “explorer”,** que bloqueou consultas como o histórico de volume de palavras-chave.

## 3. Princípios do produto

1. **Leitura primeiro.** O Hub analisa e recomenda por padrão.
2. **Escrita só com aprovação.** Toda alteração aparece como rascunho (campo, valor atual, valor novo) e só vai ao ar depois que uma pessoa autorizada confirma.
3. **Regras da agência viram configuração.** Logo, cores, nomes de arquivo, pastas e período de análise ficam no sistema, não na memória de alguém.
4. **Evidência antes de conclusão.** O Hub mostra o tamanho da amostra, a fonte e a data de coleta, e avisa quando não dá para concluir (como no relatório da Safety).
5. **Nada de segredos em tela ou em arquivo.** Credenciais ficam em cofre de segredos.
6. **Tudo registrado.** Cada consulta sensível, rascunho, aprovação e alteração gera um registro.

## 4. Funcionalidades do MVP

### 4.1 Painel de clientes

- Lista de clientes com status (conta ligada, última coleta, alertas).
- Página do cliente com cartões no estilo do dashboard do relatório: investimento, cliques, CPC, conversões, custo por conversão e contatos qualificados.
- Comparação com o mês anterior fechado.
- Aviso visível quando uma fonte está desatualizada ou incompleta.

### 4.2 Chat de análise

- Pedidos como “compare setembro e outubro da Safety” ou “quais clientes tiveram o maior aumento de custo por resultado esta semana”.
- Respostas com tabelas e gráficos dentro do chat, sempre com fonte e período.
- O chat só enxerga os clientes que a pessoa pode acessar.
- Pedidos que alteram contas viram rascunho na fila de aprovação (seção 4.6).

### 4.3 Gerador de relatórios

- Escolher cliente e mês; o Hub coleta os dados, cruza com a planilha comercial quando houver e monta o PDF.
- Padrão fixo: logo verdadeiro da Tupiniquim em todas as páginas, dashboard moderno na página 1 com cartões arredondados, melhorias de campanha separadas das do site e do atendimento, rodapé com cliente, período, versão e página.
- Nome do arquivo: `[CLIENTE] Relatório Google Ads - [Mês]`; revisões como `- V2`, sem sobrescrever a anterior.
- Salvamento no Drive na pasta do cliente (criada em letras maiúsculas se não existir), com o Excel de apoio quando solicitado.
- Só o mês anterior completo entra na comparação mensal.

### 4.4 Radar de campanhas vencedoras

Responde: “quais campanhas, grupos, palavras-chave e anúncios deram certo?”

O critério não pode ser só conversão registrada no Ads. A lição da Safety em outubro: eventos do Ads e contatos qualificados contam histórias diferentes. O Radar usa uma pontuação com camadas:

- **Camada de mídia:** custo por conversão, CPC, taxa de clique, parcela de impressões.
- **Camada de qualidade:** contatos válidos e qualificados da planilha/CRM do cliente, ligados à campanha e à palavra-chave pela UTM.
- **Camada comercial (quando existir):** propostas enviadas e contratos fechados.

Regras de segurança da análise:

- Amostra mínima configurável; abaixo dela o item aparece como “amostra pequena”, nunca como vencedor.
- Não declarar vencedor só por taxa percentual.
- Mostrar sempre quantos registros sustentam a conclusão.
- Não calcular CPL misturando canais; não calcular ROAS sem valor de contrato.

### 4.5 Radar de gargalos

Responde: “onde o funil está travando?”

O funil monitorado: impressões → cliques → conversões do Ads → contatos recebidos → contatos válidos → propostas → fechamentos.

Sinais que o Hub procura:

- **Alta de CPC com queda de cliques** (como outubro na Safety: CPC +80%, cliques −41%).
- **Gasto sem retorno de contato:** campanha com conversões no Ads e poucos ou nenhum registro na planilha, indicando falha de captura ou de atribuição.
- **Termos sem aderência:** buscas e palavras-chave associadas a contatos desqualificados, candidatas a negativas (sempre revisadas por uma pessoa).
- **Campanha limitada por orçamento ou com entrega abaixo do esperado.**
- **Medição suspeita:** quedas abruptas de sessões ou de eventos que sugerem problema de rastreamento.
- **Processo comercial:** muitos contatos sem classificação, campo de conversão vazio, códigos duplicados.

Cada gargalo vem com: evidência, impacto estimado, causa provável (marcada como hipótese) e ação sugerida, separada em campanha, site e atendimento.

### 4.6 Rascunhos de campanha, aprovações e auditoria

O fluxo que o time pediu: a partir das campanhas que deram certo, criar novas campanhas.

1. A pessoa pede no chat ou clica em “criar campanha a partir desta vencedora”.
2. O Hub monta um **rascunho**: objetivo, região, palavras-chave e correspondências sugeridas, negativas, anúncios, orçamento e critérios de revisão.
3. O rascunho entra na **fila de aprovação** com o diff exato: o que existe hoje e o que mudará.
4. Uma pessoa com permissão aprova ou rejeita, com comentário.
5. Só depois o Hub aplica (ver 4.7) e grava o registro com autor, aprovador, data e valores antes e depois.
6. Revisão pós-aplicação com prazo definido (por exemplo, 14 dias), comparando contatos qualificados e não só conversões.

### 4.7 Como as mudanças são aplicadas, por plataforma

- **Meta Ads:** conectar o Hub diretamente a um MCP ou API da Meta validado para executar campanhas permitidas. O MCP do Reportei pode fornecer dados agregados, mas não é o executor das campanhas. Confirmar servidor, escopos e permissões antes de implementar.
- **Google Ads:** usar diretamente a API oficial no backend para leitura e, futuramente, operações de campanha aprovadas. O MCP `googleads/google-ads-mcp` pode ser usado separadamente para mutações limitadas (assets e labels, com Propose & Confirm), mas não é o executor completo de campanhas. O acesso de produção depende do nível do Google Cloud project e das permissões da conta; developer tokens foram encerrados em 09/09/2026.
- **Outras plataformas de anúncios:** integrar cada canal por sua API oficial ou MCP validado, conforme as operações disponíveis e as permissões concedidas. A inclusão no MVP depende de priorização e validação por plataforma.
- **Todas as plataformas:** a IA analisa os dados e prepara o rascunho; o Hub valida o escopo, apresenta o diff e exige aprovação humana antes de executar. Registrar autor, aprovador, ferramenta, plataforma e valores antes/depois.

### 4.8 Automações e saldos (pós-MVP inicial)

- Relatório mensal no dia 3, às 9h de Brasília, analisando o mês anterior fechado, com tela de status e registro de falhas (hoje não dá para verificar se existe).
- Monitor de saldo das contas gerenciadoras: saldo atual, dias até esgotar e data sugerida de recarga, só para contas com saldo real e gasto representativo.
- Bot semanal de análise: começa só com sugestões enviadas ao time; qualquer ação automática exige regra aprovada antes.

## 5. Arquitetura sugerida

Proposta inicial; a stack final deve ser decidida com o time de desenvolvimento.

| Camada            | Sugestão                                                      | Função                                                                            |
| ----------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Interface         | Aplicação web (React/Next.js)                                 | Painel, chat, fila de aprovação, relatórios                                       |
| API e regras      | Backend em TypeScript ou Python                               | Permissões, regras da agência, orquestração                                       |
| Banco de dados    | PostgreSQL                                                    | Clientes, coletas, rascunhos, aprovações, auditoria                               |
| Tarefas agendadas | Fila de jobs e agendador                                      | Coletas, relatórios mensais, alertas                                              |
| Camada de IA      | Integração a definir na última etapa                           | Interpreta pedidos, cruza dados e redige análises; só chama ferramentas permitidas |
| Relatórios        | Gerador de PDF no servidor                                    | Reaproveita o gerador V2 como serviço                                             |
| Segredos          | Cofre de segredos do provedor                                 | Chaves e tokens fora do código e das pastas locais                                |
| Autenticação      | Acesso administrativo local temporário para validação; autenticação real antes de compartilhar o Hub | Quem entra e com qual papel |
| Hospedagem        | A definir (a agência já usa VPS e hospedagens compartilhadas) | Ambiente de testes e produção separados                                           |

A integração de IA do produto será definida e implementada na última etapa do projeto. O GitHub Copilot é usado para auxiliar o desenvolvimento, mas não é presumido como serviço de runtime do Hub. Quando integrada, a camada de IA nunca recebe credenciais e nunca escreve diretamente nas contas: ela só cria rascunhos. A aplicação confere a permissão e executa.

### Integrações

| Fonte                           | Uso                                                   | Modo                                   | Dependência                                                                                           |
| ------------------------------- | ----------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Google Ads API                  | Métricas, palavras-chave, termos de busca, orçamentos e alterações de campanhas aprovadas | Leitura e escrita controlada | Habilitar a API e obter nível Explorer ou superior para contas de produção; confirmar permissões da identidade Google |
| Reportei                        | Dados de desempenho multicanal como contexto para análises e recomendações da IA do Hub | Leitura via MCP/API                    | Validar OAuth/API, escopo e acesso por cliente                                                        |
| Meta Ads MCP/API                | Criar ou alterar campanhas na Meta com base nos dados e recomendações aprovados          | Conexão direta à Meta; escrita após aprovação | Confirmar servidor, origem, escopos e fluxo de confirmação                                            |
| Outras plataformas de anúncios  | Leitura e alterações de campanha conforme suporte de cada plataforma                     | MCP/API direta por plataforma; escrita após aprovação | Priorizar canais e validar operações e permissões de cada API/MCP                                      |
| Planilhas de leads dos clientes | Qualificação e origem dos contatos                    | Leitura                                | Padronizar colunas por cliente                                                                        |
| Google Drive                    | Salvar relatórios e Excel                             | Escrita (só nas pastas dos relatórios) | Pasta raiz já definida                                                                                |
| Planejador de palavras-chave    | Sazonalidade                                          | Importação do CSV                      | Depende do nível de acesso da API                                                                     |

## 6. Modelo de dados resumido

- **Cliente:** nome, pasta no Drive, contas de anúncio ligadas, planilha de leads, responsáveis.
- **Conta de anúncio:** plataforma, ID, gerenciadora, status.
- **Coleta:** fonte, período, data e hora, status, volume de registros.
- **Métrica diária:** conta, campanha, grupo, palavra-chave, valores.
- **Contato (lead):** cliente, data, origem, campanha/palavra-chave pela UTM, classificação, serviço desejado, ID de atendimento.
- **Relatório:** cliente, mês, versão, arquivo no Drive, quem gerou.
- **Achado:** tipo (vencedora ou gargalo), evidência, tamanho da amostra, hipótese, ação sugerida.
- **Rascunho de alteração:** plataforma, objeto, campo, valor atual, valor proposto, solicitante.
- **Aprovação:** rascunho, aprovador, decisão, comentário, data.
- **Registro de auditoria:** quem, o quê, quando, antes e depois.
- **Usuário e papel:** pessoa, papel, clientes permitidos.

## 7. Papéis e permissões

| Papel         | Pode                                                                |
| ------------- | ------------------------------------------------------------------- |
| Leitor        | Ver painéis e relatórios dos clientes liberados                     |
| Analista      | Usar o chat, gerar relatórios, criar rascunhos                      |
| Aprovador     | Aprovar ou rejeitar rascunhos dos clientes sob sua responsabilidade |
| Administrador | Gerenciar usuários, clientes, integrações e agendamentos            |

Regras: quem cria o rascunho não aprova o próprio; alterações financeiras (orçamento, verba) exigem aprovador; o acesso por cliente é obrigatório. Todos os papéis, inclusive Administrador, precisam de atribuição explícita ao cliente para acessar seus dados.

O Hub é de uso interno da agência; clientes não terão login. Para validar localmente, haverá uma credencial administrativa configurada fora do código e habilitada somente em desenvolvimento. Ela não é uma conta persistida nem serve para staging/produção. Antes de compartilhar o Hub ou conectar contas reais, implementar autenticação apropriada e persistir usuários, papéis e atribuições por cliente.

## 8. Segurança e conformidade

- Credenciais só em cofre de segredos; remover chaves JSON de pastas como Downloads e gerar novas se tiverem circulado.
- Princípio do menor acesso: contas de serviço com permissão mínima por plataforma.
- Dados de leads dos clientes tratados como confidenciais, com acesso por cliente e registro de acessos.
- Respeito à LGPD: guardar só o necessário dos contatos e definir prazo de retenção.
- Conteúdo de planilhas e documentos entra como dado, nunca como instrução para a IA.
- Ambiente de testes separado do de produção, com contas de teste.

## 9. Roadmap do MVP

Estimativa inicial para uma a duas pessoas de desenvolvimento, a ser ajustada com o time.

| Etapa                    | Duração estimada | Entregas                                                                                                                                                         |
| ------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0. Higiene               | 1 semana         | Auditoria do que existe (automações, envios, Drive); credenciais no cofre; pedido de acesso Basic/Standard da API; regras do `.md` transformadas em configuração |
| 1. Fundação              | 1–2 semanas      | Login Google, papéis, banco de dados, ambiente de testes e produção                                                                                              |
| 2. Dados                 | 2 semanas        | Coleta do Google Ads, leitura da planilha de leads, painel do cliente (piloto: Safety Rentals)                                                                   |
| 3. Relatórios            | 1–2 semanas      | Gerador de PDF no servidor, salvamento no Drive com nomenclatura, versionamento                                                                                  |
| 4. Radares               | 2 semanas        | Vencedoras e gargalos com amostra mínima, evidência e ação sugerida                                                                                              |
| 5. Rascunhos e aprovação | 1–2 semanas      | Fila de aprovação, diff e auditoria; execução em Meta Ads e Google Ads quando acessos e operações estiverem validados; demais canais conforme prioridade          |
| 6. Piloto                | 2 semanas        | Uso real por parte do time com 2–3 clientes, coleta de feedback e ajustes                                                                                        |

Pós-MVP: automação mensal com monitoramento, saldo das contas gerenciadoras, expansão para outras plataformas e operações que não entrarem na primeira entrega.

## 10. Gestão do projeto

O projeto pode ser gerenciado no **Jira** (ou outra ferramenta, como Linear, Trello ou Notion; a estrutura abaixo funciona em qualquer uma).

- **Épicos:** Fundação; Integrações de dados; Painel de clientes; Chat de análise; Relatórios; Radar de vencedoras e gargalos; Rascunhos, aprovação e auditoria; Automações e saldos.
- **Quadro:** Backlog → Pronto para desenvolver → Em desenvolvimento → Em revisão → Em teste → Concluído.
- **Definição de pronto:** funciona em ambiente de testes, tem permissão por cliente, gera registro de auditoria e foi revisada por outra pessoa.
- **Cadência:** sprints de uma a duas semanas, com demonstração ao final para o chefe e o time.
- Acompanha este documento um arquivo CSV com os épicos e as histórias iniciais, pronto para importar no Jira.

## 11. Riscos e dependências

| Risco                                                            | Mitigação                                                                                                   |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Acesso Basic/Standard da API do Google Ads demorar ou ser negado | Começar pela etapa 0; manter importação manual de CSV como alternativa temporária                           |
| Planilhas de leads com formatos diferentes por cliente           | Padronizar colunas e começar só pela Safety                                                                 |
| Conclusões erradas por amostra pequena                           | Amostra mínima obrigatória e rótulos de incerteza na interface                                              |
| IA aplicar mudança indevida                                      | IA só cria rascunho; execução pela aplicação, com aprovação e auditoria                                     |
| Falta de dados de contrato e receita                             | Incluir campos de valor, margem e motivo de perda no processo comercial dos clientes antes de falar em ROAS |
| Escopo crescer                                                   | MVP fechado nas seções 4.1 a 4.6; o resto vai para pós-MVP                                                  |
| Uma pessoa só conhecer o sistema                                 | Documentação, revisão por pares e acesso compartilhado desde o início                                       |

## 12. Como medir o sucesso do MVP

- Tempo para gerar um relatório mensal por cliente, comparado ao processo atual.
- Parcela dos pedidos do time atendida dentro do Hub.
- Número de alterações aplicadas sem aprovação (meta: zero).
- Parcela dos achados que o time considerou úteis.
- Clientes com relatório no padrão, no Drive e no prazo, sem retrabalho.

## 13. Decisões para o chefe

1. Quem será o responsável por cada cliente e quem aprova alterações?
2. Qual cliente será o piloto? Sugestão: Safety Rentals, pela quantidade de dados e pelo relatório já pronto.
3. O plano atual do Reportei inclui o token da API e a documentação dos endpoints?
4. Onde hospedar e quem mantém a infraestrutura?
5. Quais clientes aceitam compartilhar planilhas de leads, e em que formato?
6. Quais plataformas de anúncios entram na primeira entrega (Meta, Google Ads e outras) e quais operações de escrita serão habilitadas em cada uma?
7. Qual orçamento e qual prazo a agência quer reservar para o desenvolvimento?

### 13.1 Pré-requisitos antes de construir

Antes de começar o desenvolvimento, a agência precisa ter estes itens prontos:

- **Scripts atuais reunidos:** o gerador de PDF e as rotinas de coleta que o Codex usa hoje, para portar para o Hub.
- **Responsáveis e prazo:** quem desenvolve, quem aprova e quanto tempo e orçamento a agência reserva.
- **Estimativa de custos:** hospedagem e planos das plataformas; estimar eventual provedor de IA ao planejar a última etapa.
- **Autorização dos clientes:** confirmar em contrato ou por escrito que os dados das contas podem ser tratados por uma ferramenta com IA.
- **Acessos:** nível Basic/Standard e permissões necessárias da API do Google Ads; acesso de gerenciamento da Meta; token/API do Reportei; credenciais e permissões dos demais canais priorizados.
- **Caso de teste de referência:** usar o relatório da Safety de outubro (V2) como gabarito dos números e das conclusões.
- **Plano de adoção:** treinamento curto do time e piloto com dois ou três clientes.

## 14. Anexo: o que o Reportei já cobre e como o Hub complementa

O guia da Reportei mostra fluxos de análise e ações com confirmação, incluindo um caminho específico para Meta Ads. Ele serve como referência de fluxo, mas o Hub terá sua própria IA e conexão direta com cada plataforma em que executar campanhas.

O Hub complementa nos pontos que o guia deixa de fora ou assume como limite:

- Ações no Google Ads e em outras plataformas priorizadas, usando API/MCP direto do respectivo canal e respeitando suas capacidades.
- Cruzamento com a planilha comercial de cada cliente (qualidade do contato, não só conversão).
- Relatório no layout e nas regras da Tupiniquim.
- Trilha de auditoria e aprovação próprias da agência.
- Automações com monitoramento (mensal no dia 3, saldos).

O caminho recomendado é usar o Reportei como fonte de dados, conectar o Hub diretamente às plataformas de anúncios para executar ações permitidas e centralizar o time no Hub como interface e camada de controle. O Reportei não executa as campanhas do Hub.

## 15. Integrações MCP e API (detalhamento)

Esta seção detalha como o Hub se conecta às ferramentas. A regra central: **o modelo de IA nunca escreve direto nas contas**. Ele lê, analisa e cria rascunhos; quem executa é a aplicação, depois da aprovação.

### 15.1 O que é MCP e o que é API direta

- **MCP (Model Context Protocol):** padrão que deixa o assistente de IA chamar ferramentas externas (por exemplo, consultar uma conta de anúncios). É ótimo para perguntas abertas no chat.
- **API direta:** a aplicação chama a plataforma por código. É melhor para tarefas repetidas e previsíveis, como o relatório mensal, e para qualquer escrita sob controle.

### 15.2 Divisão por ferramenta

| Ferramenta         | Caminho                                                   | Leitura | Escrita                                        | Observações                                                                                                                                                                                   |
| ------------------ | --------------------------------------------------------- | ------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Meta Ads           | MCP/API da Meta conectado diretamente ao Hub              | Sim     | Conforme ferramentas disponíveis e aprovação  | Confirmar servidor, escopos e revisão de segurança antes da implementação                                                                                                                        |
| Google Ads         | API direta no backend; MCP oficial opcional para exploração | Sim     | API para campanhas aprovadas; MCP para mutações limitadas | MCP documenta assets e labels com Propose & Confirm, não criação/edição completa de campanhas. Validar nível do Google Cloud project e permissões |
| Outras plataformas de anúncios | API oficial ou MCP validado por canal             | A validar | Conforme operações disponíveis e aprovação | Priorizar plataformas e validar ferramentas, escopos, acesso e fluxo de confirmação antes de habilitar escritas                                                                           |
| Google Drive       | API direta para salvar relatórios; MCP para busca no chat | Sim     | Só nas pastas de relatórios                   | Nomenclatura e pasta do cliente vêm da configuração                                                                                                                                           |
| Gmail e Calendar   | MCP, só leitura                                           | Sim     | Não no MVP                                     | Uso opcional, para buscar contexto de atendimento                                                                                                                                             |
| Planilhas de leads | API do Google Sheets                                      | Sim     | Não                                            | Colunas padronizadas por cliente                                                                                                                                                              |
| Reportei           | MCP remoto oficial e API REST                             | Sim     | Sim, para recursos do Reportei                | MCP tem `mcp:tools` e ferramentas de escrita em relatórios, dashboards, metas, automações e outros recursos; não documenta criação de campanhas. Usar allowlist e aprovação do Hub para escritas |

### 15.3 Quem usa o quê

1. **Chat e análises exploratórias:** quando a IA de runtime for integrada, usar ferramentas de leitura em allowlist; habilitar mutações somente após aprovação do Hub.
2. **Jobs agendados e relatórios:** usam API direta, com resultado previsível e registro de falhas.
3. **Qualquer escrita:** passa pela camada do Hub (rascunho → aprovação → execução → auditoria). A confirmação do MCP, quando houver, é adicional e não substitui a aprovação do Hub.

### 15.4 Autenticação

- **Plataformas de anúncios:** validar a API/MCP e os escopos de cada canal; vincular o acesso à pessoa e aos clientes autorizados.
- **Google Ads:** validar o nível de acesso do Google Cloud project e as permissões OAuth da identidade usada. Developer tokens foram encerrados em 09/09/2026; o MCP oficial só habilita as operações documentadas.
- **Reportei MCP:** OAuth 2.1 com PKCE; o escopo documentado `mcp:tools` é amplo. O Hub mantém autorização própria por cliente.
- **Jobs agendados:** conta de serviço com acesso mínimo e chaves no cofre de segredos.
- **Google Drive:** conta de serviço com acesso apenas às pastas de relatórios.
- Nenhuma credencial aparece em tela, em log ou em prompt.

### 15.5 Cuidados de segurança com MCP

- **Lista permitida de ferramentas:** o chat só enxerga as ferramentas liberadas para o papel da pessoa e para o cliente.
- **Servidores MCP de terceiros** recebem tokens da agência; só entram depois de revisão de segurança, com acesso mínimo.
- **Injeção de instruções:** textos de planilhas, documentos e sites entram como dado, nunca como comando. Testar com conteúdo malicioso antes do piloto.
- **Registro de chamadas:** cada uso de ferramenta fica gravado (quem, qual cliente, qual ferramenta, quando).
- **Limites:** teto de consultas por pessoa e por cliente, para controlar custo e abuso.

### 15.6 Pendências para confirmar

1. O plano e as permissões do Reportei da agência cobrem as ferramentas MCP desejadas? Confirmar o escopo efetivo de empresas/projetos, pois a documentação descreve esse alcance de formas diferentes.
2. Quem aprova acesso de servidores MCP externos e quais ferramentas de escrita do próprio Reportei podem ser habilitadas?
3. Quais plataformas de anúncios entram na primeira entrega e qual API/MCP será usado em cada uma?
4. Quais operações e permissões estão disponíveis por canal, incluindo o nível de acesso do Google Cloud project para o Google Ads?
