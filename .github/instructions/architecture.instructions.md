---
applyTo: "apps/web/src/**/*.{ts,tsx}"
---

# Arquitetura

- `app/` contém roteamento, layouts e adaptadores finos do Next.js.
- `views/`, `widgets/`, `features/`, `entities/` e `shared/` seguem FSD e a direção de dependências descrita nas instruções globais.
- `server/domain/` contém entidades, tipos de domínio e regras puras, sem dependências de framework.
- `server/application/` contém casos de uso e portas; pode depender do domínio, mas não de adaptadores concretos.
- `server/infrastructure/` implementa portas para banco e serviços externos.
- Nunca importe código server-only em componentes client-side.
- Mantenha autorização no servidor; esconder controles na interface não substitui autorização.
