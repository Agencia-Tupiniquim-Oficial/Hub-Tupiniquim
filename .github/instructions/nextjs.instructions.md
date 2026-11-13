---
applyTo: "apps/web/src/app/**/*.{ts,tsx}"
---

# Next.js

- Prefira Server Components; use `"use client"` apenas quando houver necessidade real de estado ou APIs do navegador.
- Mantenha páginas e Route Handlers pequenos; delegue regras a casos de uso do servidor.
- Não exponha segredos em componentes, props serializadas, mensagens de erro ou variáveis `NEXT_PUBLIC_*`.
- Route Handlers devem validar entrada, autenticar/autorização no servidor e responder com códigos HTTP coerentes.
- Não crie integrações fictícias ou dados de produção simulados como se fossem reais.
