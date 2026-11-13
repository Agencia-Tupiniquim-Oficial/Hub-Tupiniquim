# Referências de relatórios e fluxo de campanhas

**Analisado em:** 2026-11-12  
**Fontes:** PDFs enviados pelo usuário e mantidos em `C:\Users\opera\Downloads`: guia de prompts Reportei × Meta Ads, relatórios Safety Rentals (original e V2), CINTTER V2 e Diego Zuza. Este documento registra padrões, não reproduz os relatórios nem transfere dados entre clientes.

## Padrões úteis dos relatórios

- **Começar pela decisão:** abrir com período, comparação, indicadores-chave, leitura principal e prioridades, deixando claro se o material é consultivo ou se alguma alteração foi aplicada.
- **Definir o que cada número significa:** conversões de anúncios são eventos; não equivalem automaticamente a pessoas, contatos válidos, contratos ou receita. Separar fontes e explicar cobertura e atribuição.
- **Mostrar limites da evidência:** informar amostra, período, data de coleta, fonte, exclusões, duplicidades e dados ausentes. Não alterar a planilha original nem converter ausência de registro em prova de ausência de venda.
- **Ligar recomendação a evidência:** para cada proposta, registrar a observação que a motivou, hipótese, resultado esperado, trade-offs, janela e critério de avaliação. Tratar testes como hipóteses, não garantias.
- **Separar frentes de trabalho:** mudanças de mídia, melhorias de site/medição e ações de atendimento/processo comercial aparecem como categorias distintas.
- **Dar rastreabilidade à execução:** propostas podem ser organizadas por códigos, objetos afetados e configuração exata. Distinguir recomendação, pendência de informação, aprovação e execução concluída.
- **Dar contexto sem automatizar conclusões:** tendências históricas e sazonalidade devem apresentar método e fonte, sem justificar sozinhas mudanças de verba.
- **Manter histórico de versões:** identificar cliente, período, versão e coleta; não sobrescrever versões anteriores nem sugerir que houve nova consulta ou execução quando não houve.

## Padrão útil do guia de prompts

O guia organiza o trabalho como uma sequência: diagnosticar o que merece atenção, dimensionar alternativas e trade-offs, depois preparar uma ação específica para revisão e confirmação. Também mostra o valor de usar contexto multicanal para decidir onde investigar, e de executar a ação na plataforma responsável.

Para o Hub, isso vira uma experiência própria: a IA pode consultar dados do Reportei e outras fontes permitidas; cada alteração é preparada pelo conector direto da plataforma correspondente. O guia descreve uma configuração específica para Meta e não prova capacidades de escrita em Google Ads ou em outros canais.

## Requisitos para o Hub

1. Toda análise deve indicar cliente autorizado, período, fontes, atualização dos dados e tamanho da amostra.
2. Preservar definições distintas para evento de anúncio, lead recebido, lead qualificado, proposta, venda e receita.
3. Mostrar dados ausentes, discrepâncias e limites de atribuição antes de sugerir otimização.
4. Recomendações devem ser específicas e verificáveis; testes devem incluir duração, limite de orçamento, métrica e critério de revisão.
5. Campanhas e orçamento só podem ser alterados por um conector direto e validado da plataforma correspondente, após rascunho com diff, autorização, aprovação humana e auditoria.
6. Se a integração não suportar a operação, explicar o limite e fornecer um plano manual; nunca simular uma execução.
7. Dados, conclusões e materiais permanecem isolados por cliente.

## Limites de uso das referências

- Os PDFs representam casos específicos, não regras universais nem fontes atuais de dados.
- Não usar números, nomes de campanhas, IDs, palavras-chave ou conclusões de um cliente em outro.
- Não inferir ROAS, vendas ou CPL confiável sem atribuição e dados comerciais adequados.
- Os exemplos de prompt servem para identificar etapas e padrões de interação; implementar prompts e fluxos próprios do Hub.
- Qualquer decisão de campanha deve considerar as capacidades, permissões e dados disponíveis no canal de destino; contexto multicanal não autoriza escrita em outra plataforma.
