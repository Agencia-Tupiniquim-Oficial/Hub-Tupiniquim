# Revisão do Reportei MCP

Fonte primária consultada: [documentação oficial do Reportei MCP](https://developers.reportei.com/mcp). Não foi necessário recorrer a documentação da Meta ou do Google: a página do Reportei é suficiente para descrever o que seu próprio MCP documenta, mas não para provar requisitos de integrações externas.

## Conclusões

- **Tokens de IA:** a documentação não especifica quem paga ou consome tokens do modelo ao conectar um agente externo, nem se o uso do MCP gera cobrança de tokens de IA. Portanto, **não foi possível confirmar** essa afirmação pela fonte consultada. ([Reportei MCP — visão geral e conexão](https://developers.reportei.com/mcp))
- **Capacidades:** a página anuncia 40+ ferramentas e descreve acesso a métricas e projetos, relatórios/dashboards, metas e KPIs, automações, timeline, webhooks e análises cross-channel. Também documenta recursos de contexto somente leitura (`reportei://...`) e seis prompts de análise. As ferramentas estão classificadas individualmente como leitura, escrita ou exclusão. ([Reportei MCP — Recursos, Ferramentas Disponíveis, Recursos e Prompts Integrados](https://developers.reportei.com/mcp))
- **Campanhas e Google Ads:** não há ferramenta documentada para criar, editar ou executar campanhas publicitárias; `get_campaign_summary` é explicitamente de **leitura** e retorna desempenho agregado. Google Ads consta entre as plataformas de publicidade suportadas e aparece em um exemplo de comparação de performance — não de criação ou execução. A documentação **não afirma que seja necessário um MCP direto da Meta** para executar campanhas; essa necessidade não pode ser confirmada com esta fonte. ([Reportei MCP — Análises e Campanhas, Comparar Performance de Anúncios entre Plataformas e Plataformas Suportadas](https://developers.reportei.com/mcp))
- **Limites:** a página diz que o MCP usa os mesmos limites de requisição da API v2, mas não informa números nem limites separados para leitura e escrita. Menciona ainda limite de relatórios conforme o plano e sugere consultar `get_company_settings`. ([Reportei MCP — FAQ: limite de requisições e limite de recursos de `create_report`](https://developers.reportei.com/mcp))
- **Autenticação e aprovações:** o fluxo padrão documentado é OAuth 2.1 com PKCE, descoberta automática e registro dinâmico de cliente, login no Reportei e consentimento para aprovar ou negar o escopo `mcp:tools`. Para Manus, a página documenta alternativa com Bearer token da API da empresa. No exemplo de criação de relatório, há uma etapa `confirm` antes de `create_report`; a página não estabelece confirmação obrigatória para toda ferramenta de escrita ou exclusão. ([Reportei MCP — Configuração e Conexão, Autenticação, Escopos e exemplo de relatório](https://developers.reportei.com/mcp))

## Ressalva sobre escopo de acesso

A página apresenta descrições divergentes: em “Acesso aos Dados”, diz que o token acessa empresas das quais o usuário é proprietário; na FAQ, diz que alcança todas as empresas às quais o usuário tem acesso. O escopo efetivo não pode ser resolvido apenas com essa documentação. ([Reportei MCP — Autenticação: Acesso aos Dados; FAQ: Quais dados o servidor MCP acessa?](https://developers.reportei.com/mcp))

## Complemento do atendimento Reportei

Na conversa de suporte reproduzida pelo usuário em 12/11/2026, a atendente confirmou que um agente externo usa os tokens do próprio provedor de IA e que, para criar campanhas via assistente externo, é preciso conectar o MCP da Meta diretamente. Essas afirmações vêm do atendimento compartilhado, não da página técnica do Reportei. O suporte não especificou qual servidor Meta deve ser escolhido, seus escopos ou como se aplicam aprovações no Hub.
