# Skills de engenharia no GitHub Copilot

As skills do repositório [`mattpocock/skills`](https://github.com/mattpocock/skills) foram instaladas para orientar o trabalho assistido pelo GitHub Copilot. Os arquivos estão em `.agents/skills/`; a instalação não adiciona um provedor de IA ao Hub.

## Skills a aplicar no MVP

- **`tdd`** — para cada comportamento, seguir RED → GREEN em uma fatia vertical; consultar também `tests.md` e `mocking.md`.
- **`codebase-design`** — definir uma interface pequena, com profundidade e uma seam clara para testes.
- **`domain-modeling`** — manter termos do negócio consistentes com `MVP.md` e registrar decisões de domínio quando houver trade-off relevante.
- **`implement`** — orientar a execução de uma funcionalidade descrita, sem ampliar o escopo.
- **`code-review`** — revisar alterações contra os requisitos e as convenções do projeto.
- **`diagnosing-bugs`** — usar quando houver falha difícil de reproduzir ou regressão.

As instruções de `.github/` são a adaptação operacional ao Copilot. Leia a skill relevante antes de usar seu processo; uma skill é orientação, não autorização para alterar contas ou dados reais.

## Limites de execução

A integração de IA do produto será definida e implementada na última etapa. Até lá, o chat não depende de um provedor de runtime e testes usam doubles determinísticos. A instalação de skills não configura integrações externas.

Para atualizar a coleção pelo projeto:

```powershell
npx skills@latest add mattpocock/skills
```

Após atualizar, revise as alterações em `.agents/skills/` antes de adotá-las. Skills executadas por agentes operam com as permissões do agente.
