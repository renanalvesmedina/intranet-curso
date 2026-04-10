<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 → 1.0.0 (MAJOR - primeira ratificação)

Added principles:
  - I. Código Limpo e Claro
  - II. Desenvolvimento Baseado em Testes (TDD)
  - III. Fases Independentes e Validáveis
  - IV. Versionamento e Controle de Qualidade por Fase

Added sections:
  - Workflow de Desenvolvimento
  - Estrutura de Tasks

Templates requiring updates:
  ✅ plan-template.md - Constitution Check alinhado com princípios
  ✅ spec-template.md - User stories independentes já suportadas
  ✅ tasks-template.md - Ajustado para incluir tasks de teste e commit por fase

Follow-up TODOs: Nenhum
-->

# Intranet Corporativa Multi-tenant — Constituição do Projeto

## Core Principles

### I. Código Limpo e Claro

Todo código produzido DEVE ser legível, compreensível e manutenível. A clareza é prioridade sobre brevidade ou "esperteza".

**Regras não-negociáveis:**

- Nomes de módulos, funções, tipos e variáveis DEVEM refletir a linguagem ubíqua do domínio: `tenant`, `colaborador`, `evento`, `audiência`, `departamento`, `perfil`
- Funções e componentes DEVEM ter responsabilidade única; quando um bloco cresce ou mistura UI, I/O e regras, DEVE ser extraído
- Duplicação de regras de negócio DEVE ser eliminada convergindo para função ou módulo partilhado
- Complexidade DEVE ser controlada: fluxos lineares, condicionais legíveis, sem aninhamento profundo
- Comentários explicam o **porquê**, não o óbvio; NUNCA comentar o que o código já expressa
- TypeScript: tipos nas fronteiras (APIs, DTOs), `any` proibido sem justificação documentada

**Rationale:** Código que a próxima pessoa consegue entender e alterar com confiança reduz bugs, acelera onboarding e facilita revisão. Alinhado com [QUALITY.md](docs/QUALITY.md).

---

### II. Desenvolvimento Baseado em Testes (TDD)

O desenvolvimento segue obrigatoriamente o ciclo **Red-Green-Refactor**. Testes são escritos **antes** da implementação.

**Regras não-negociáveis:**

1. **Red:** Escrever teste(s) que descrevem o comportamento esperado — testes DEVEM falhar inicialmente
2. **Green:** Implementar o código mínimo necessário para os testes passarem
3. **Refactor:** Melhorar a estrutura do código mantendo os testes verdes
4. Testes unitários são **obrigatórios** para regras de negócio derivadas do PROPOSAL e RBAC:
   - Permissões por recurso/ação
   - Audiência de eventos
   - Invariantes de `tenant_id`
   - Eliminação de eventos (Admin vs autor RH)
   - Campos self-service vs Admin/RH
   - Limites do Master
5. Nomenclatura de testes DEVE descrever o cenário (ex.: "RH não pode apagar evento criado por outro utilizador")
6. Padrão **Arrange-Act-Assert** obrigatório

**Ferramentas:**
- Unitários e integração: **Vitest**
- E2E (CI): **Playwright**
- E2E (desenvolvimento): **Cursor Browser MCP**

**Rationale:** TDD garante que cada funcionalidade é verificável desde o início, reduz regressões e documenta comportamentos esperados. Alinhado com [ENGINEERING.md](docs/ENGINEERING.md).

---

### III. Fases Independentes e Validáveis

Cada implementação DEVE ser entregue em fases únicas que podem ser validadas **sem depender de implementação futura**.

**Regras não-negociáveis:**

- Cada fase/bloco DEVE compilar, correr e ser validável isoladamente
- Uma entrega NUNCA depende de código que ainda não existe
- Fatias verticais: cada incremento inclui recorte mínimo de domínio, persistência e UI/endpoint quando aplicável
- Inversão de dependências: regras de negócio em módulos puros testáveis **sem** UI nem cliente Supabase real
- Integrações (Supabase, HTTP) ficam atrás de interfaces substituíveis por doubles em teste
- **Proibido:** stubs permanentes ambíguos que só "ganham sentido" quando outro módulo existir
- Preferir contratos estáveis (OpenAPI, tipos partilhados), adapters no-op, ou feature flags documentados

**Rationale:** Permite validação contínua, reduz risco de integração tardia e mantém o projeto sempre num estado demonstrável. Alinhado com [ENGINEERING.md](docs/ENGINEERING.md) — "Nenhuma entrega deve depender de uma implementação futura para ser testada, revista ou demonstrada."

---

### IV. Versionamento e Controle de Qualidade por Fase

Cada fase/bloco de implementação DEVE terminar com testes e commit para garantir rastreabilidade e possibilidade de reversão.

**Regras não-negociáveis:**

- Toda User Story (US) DEVE finalizar com:
  1. Task de testes unitários (passando)
  2. Task de commit com mensagem descritiva
- Commits DEVEM ser atómicos: uma alteração lógica por commit
- Mensagens de commit DEVEM descrever o "porquê" da mudança, não apenas o "quê"
- Cada fase completada DEVE ter testes verdes **antes** do commit
- Branch dedicada por implementação; PR para `develop` após conclusão
- CI (GitHub Actions) executa testes unitários no PR como referência de aprovação

**Formato de tasks por fase:**

```
## Phase N: User Story X - [Título]

### Implementação
- [ ] TXXX [USX] Implementar [funcionalidade]
- [ ] TXXX [USX] Implementar [funcionalidade]

### Finalização Obrigatória
- [ ] TXXX [USX] Testes unitários para User Story X
- [ ] TXXX [USX] Commit: "[tipo]: [descrição da US]"
```

**Rationale:** Versionamento granular permite reversão cirúrgica, facilita code review e garante que cada incremento está testado antes de integrar. Alinhado com [DELIVERY.md](docs/DELIVERY.md).

---

## Workflow de Desenvolvimento

O fluxo de trabalho DEVE seguir estas etapas para cada funcionalidade:

### 1. Preparação

- Verificar alinhamento com PROPOSAL.md e RBAC
- Criar branch dedicada (`feature/`, `fix/`, `chore/`)
- Identificar User Stories com prioridade (P1, P2, P3)

### 2. Ciclo por User Story

Para cada US, em ordem de prioridade:

```
1. Escrever testes (Red) → Verificar que falham
2. Implementar código mínimo (Green) → Testes passam
3. Refatorar se necessário (Refactor) → Testes continuam verdes
4. Executar task de testes unitários da US
5. Commit da US com mensagem descritiva
6. Checkpoint: US validável independentemente
```

### 3. Finalização

- Todos os testes verdes
- PR para `develop` com título e descrição
- CI passa (GitHub Actions - Vitest)
- Code review conforme [QUALITY.md](docs/QUALITY.md)
- Merge após aprovação

---

## Estrutura de Tasks

Todas as tasks DEVEM seguir esta organização para garantir fases independentes com finalização adequada:

### Fases Padrão

1. **Setup** — Estrutura inicial do projeto
2. **Foundational** — Infraestrutura que bloqueia User Stories
3. **User Story N** — Uma fase por US, cada uma com:
   - Implementação
   - Testes unitários (task obrigatória)
   - Commit (task obrigatória)
4. **Polish** — Melhorias transversais (apenas após US principais)

### Tasks Obrigatórias por US

Cada User Story DEVE incluir no final:

| Task | Descrição |
|------|-----------|
| `[USX] Testes unitários para US X` | Executar e validar todos os testes da US |
| `[USX] Commit: "[tipo]: [descrição]"` | Commit atómico com mensagem descritiva |

### Exemplo Concreto

```markdown
## Phase 3: User Story 1 - Criar Evento (P1)

### Implementação
- [ ] T010 [US1] Criar modelo Event em src/models/event.ts
- [ ] T011 [US1] Implementar regras de audiência em src/services/audience.ts
- [ ] T012 [US1] Endpoint de criação em src/api/events/create.ts

### Finalização Obrigatória
- [ ] T013 [US1] Testes unitários para User Story 1
- [ ] T014 [US1] Commit: "feat(events): criar evento com audiência"

**Checkpoint**: US1 validável independentemente — evento pode ser criado e testado sem depender de US2
```

---

## Governance

Esta constituição é o documento supremo de práticas do projeto. Todas as outras guidelines, documentação e decisões de implementação DEVEM estar em conformidade.

### Hierarquia Documental

| Documento | Propósito | Relação com Constituição |
|-----------|-----------|--------------------------|
| **Constitution.md** (este) | Princípios invioláveis | Documento supremo |
| [PROPOSAL.md](docs/PROPOSAL.md) | Requisitos de produto, RBAC | Fonte de regras de negócio |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Planta técnica, RLS | Decisões de arquitetura |
| [ENGINEERING.md](docs/ENGINEERING.md) | Stack, convenções | Detalhes técnicos |
| [QUALITY.md](docs/QUALITY.md) | Código, testes, DoD | Complementa Princípio I e II |
| [DELIVERY.md](docs/DELIVERY.md) | Git flow, CI/CD | Complementa Princípio IV |
| [SECURITY.md](docs/SECURITY.md) | Políticas de segurança | Restrições obrigatórias |

### Verificação de Conformidade

- Todo PR DEVE ser verificado quanto à conformidade com estes princípios
- Violações DEVEM ser justificadas e documentadas no PR
- Code review DEVE incluir checklist de constituição
- Complexidade além do necessário DEVE ser rejeitada sem justificação clara

### Alterações à Constituição

1. Alterações REQUEREM documentação clara da mudança
2. Alterações REQUEREM revisão da equipa técnica
3. Alterações REQUEREM atualização de versão conforme semver:
   - MAJOR: Remoção/redefinição de princípio
   - MINOR: Novo princípio ou expansão material
   - PATCH: Clarificações, correções de texto

### Guidance de Runtime

Para orientação de desenvolvimento em tempo real, consultar:
- [apps/web/AGENTS.md](apps/web/AGENTS.md) — Frontend Next.js
- [apps/notification-service/AGENTS.md](apps/notification-service/AGENTS.md) — Serviço de notificações
- [AGENTS.md](AGENTS.md) — Regras gerais do monorepo

---

**Version**: 1.0.0 | **Ratified**: 2026-04-07 | **Last Amended**: 2026-04-07
