hub-tupiniquim/
├── .github/
│ ├── copilot-instructions.md
│ ├── instructions/
│ │ ├── architecture.instructions.md
│ │ ├── nextjs.instructions.md
│ │ ├── testing.instructions.md
│ │ └── security.instructions.md
│ └── prompts/
│ ├── bootstrap.prompt.md
│ ├── plan-feature.prompt.md
│ ├── implement-feature.prompt.md
│ └── review-changes.prompt.md
├── apps/
│ └── web/
│ ├── src/
│ │ ├── app/ # Rotas, layouts e adaptadores Next.js
│ │ ├── views/ # Composição das páginas
│ │ ├── widgets/ # Dashboard, chat e fila de aprovação
│ │ ├── features/ # Ações do usuário
│ │ ├── entities/ # Modelos e apresentação de conceitos
│ │ ├── shared/ # Componentes e utilitários compartilhados
│ │ └── server/
│ │ ├── domain/ # Regras de negócio puras
│ │ ├── application/ # Casos de uso e portas
│ │ └── infrastructure/ # Banco e adaptadores externos
│ └── tests/
├── packages/
│ └── ui/ # Design system Tupiniquim
├── docs/
│ ├── product/
│ │ └── requirements.md
│ ├── architecture.md
│ ├── integrations.md
│ └── security.md
├── .env.example
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
