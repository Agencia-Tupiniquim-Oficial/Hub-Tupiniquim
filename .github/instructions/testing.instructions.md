---
applyTo: "**/*.{test,spec}.{ts,tsx}"
---

# Testes e TDD

- Use Vitest e siga o ciclo RED → GREEN → REFACTOR.
- Teste comportamento e limites relevantes; evite testar detalhes internos ou constantes isoladamente.
- Cubra regras de negócio com testes unitários puros.
- Testes de integração devem substituir dependências externas por doubles controlados.
- Use somente dados sintéticos; nunca copie dados de leads, clientes, credenciais ou contas reais.
