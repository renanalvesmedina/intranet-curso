# Tasks: Interface e Navegação da Aplicação

**Input**: Design documents from `/specs/001-e01-interface-navegacao/`  
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md

**Tests**: TDD obrigatório conforme Constitution (Princípio II). Testes escritos antes da implementação.

**Organization**: Tasks agrupadas por User Story para implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode executar em paralelo (ficheiros diferentes, sem dependências)
- **[Story]**: User Story associada (US1, US2, US3, US4, US5)
- Paths são relativos a `apps/web/`

---

## Phase 1: Setup (Infraestrutura Partilhada)

**Purpose**: Inicialização do projeto e dependências

- [x] T001 [P] Instalar dependências de runtime: `pnpm add next-themes` em apps/web/
- [x] T002 [P] Instalar dependências de teste: `pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom` em apps/web/
- [x] T003 [P] Adicionar componentes Shadcn: `pnpm dlx shadcn@latest add sidebar sheet button separator tooltip` em apps/web/
- [x] T004 Criar ficheiro de configuração Vitest em apps/web/vitest.config.ts
- [x] T005 Criar ficheiro de setup de testes em apps/web/vitest.setup.ts
- [x] T006 Adicionar script "test" no apps/web/package.json

---

## Phase 2: Foundational (Pré-requisitos Bloqueantes)

**Purpose**: Infraestrutura core que DEVE estar completa antes de qualquer User Story

**⚠️ CRÍTICO**: Nenhum trabalho de User Story pode começar até esta fase estar completa

- [x] T007 [P] Criar estrutura de pastas BFF: apps/web/lib/supabase/, apps/web/lib/services/, apps/web/actions/
- [x] T008 [P] Criar tipo Role e constante ROLES em apps/web/lib/roles.ts (conforme data-model.md)
- [x] T009 [P] Criar tipo TenantInfo e PLACEHOLDER_TENANT em apps/web/lib/tenant.ts
- [x] T010 [P] Criar interface MenuItem e MenuConfig em apps/web/lib/navigation.ts (apenas tipos, sem dados)
- [x] T011 Criar ThemeProvider component em apps/web/components/theme/theme-provider.tsx
- [x] T012 Atualizar apps/web/app/layout.tsx para incluir ThemeProvider
- [x] T013 Criar estrutura base de route group em apps/web/app/(app)/layout.tsx (placeholder vazio)

**Checkpoint**: Fundação pronta — implementação de User Stories pode começar

---

## Phase 3: User Story 1 - Estrutura de Navegação Consistente (Priority: P1) 🎯 MVP

**Goal**: Layout base da aplicação com sidebar/cabeçalho, tema claro/escuro, foco visível

**Independent Test**: Carregar aplicação e verificar estrutura de layout presente, tema alternável, navegação por teclado funcional

### Tests for User Story 1 (TDD - Red Phase) ⚠️

> **NOTA: Escrever estes testes PRIMEIRO, garantir que FALHAM antes da implementação**

- [x] T014 [P] [US1] Criar teste de renderização do AppShell em apps/web/__tests__/components/app-shell.test.tsx
- [x] T015 [P] [US1] Criar teste do ThemeToggle em apps/web/__tests__/components/theme-toggle.test.tsx

### Implementation for User Story 1 (Green Phase)

- [x] T016 [P] [US1] Criar componente AppShell em apps/web/components/app-shell/app-shell.tsx
- [x] T017 [P] [US1] Criar componente AppSidebar em apps/web/components/app-shell/app-sidebar.tsx
- [x] T018 [P] [US1] Criar componente AppHeader em apps/web/components/app-shell/app-header.tsx
- [x] T019 [US1] Criar componente ThemeToggle em apps/web/components/theme/theme-toggle.tsx
- [x] T020 [US1] Integrar AppShell no layout em apps/web/app/(app)/layout.tsx
- [x] T021 [US1] Criar redirect de / para /dashboard em apps/web/app/page.tsx
- [x] T022 [US1] Verificar estilos de foco visível em todos os controlos interativos

### Mandatory Finalization for User Story 1 ✅

> **CONSTITUTION REQUIREMENT: Toda fase DEVE terminar com testes e commit**

- [x] T023 [US1] Executar e validar todos os testes unitários para User Story 1 (todos devem passar)
- [x] T024 [US1] Commit: "feat(shell): estrutura de navegação com layout e tema" *(consolidado em feat(e01))*

**Checkpoint**: US1 funcional — layout visível, tema alternável, navegação por teclado

---

## Phase 4: User Story 2 - Menu de Navegação com Itens Principais (Priority: P1)

**Goal**: Menu com 5 itens principais (Dashboard, Colaboradores, Departamentos, Eventos, Notificações), navegação funcional, estado ativo

**Independent Test**: Verificar que menu apresenta todos os itens, cliques navegam para rotas corretas, item ativo destacado

### Tests for User Story 2 (TDD - Red Phase) ⚠️

> **NOTA: Escrever estes testes PRIMEIRO, garantir que FALHAM antes da implementação**

- [x] T025 [P] [US2] Criar testes de navigation.ts (menuConfig, getActiveMenuItem) em apps/web/__tests__/lib/navigation.test.ts
- [x] T026 [P] [US2] Criar teste de NavItem (renderização, estado ativo) em apps/web/__tests__/components/nav-item.test.tsx

### Implementation for User Story 2 (Green Phase)

- [x] T027 [US2] Implementar menuConfig com 5 itens principais (sem admin-global) em apps/web/lib/navigation.ts
- [x] T028 [US2] Implementar funções getActiveMenuItem e isRouteActive em apps/web/lib/navigation.ts
- [x] T029 [US2] Criar componente NavItem em apps/web/components/app-shell/nav-item.tsx
- [x] T030 [US2] Integrar navegação no AppSidebar com menuConfig em apps/web/components/app-shell/app-sidebar.tsx
- [x] T031 [P] [US2] Criar página placeholder Dashboard em apps/web/app/(app)/dashboard/page.tsx
- [x] T032 [P] [US2] Criar página placeholder Colaboradores em apps/web/app/(app)/colaboradores/page.tsx
- [x] T033 [P] [US2] Criar página placeholder Departamentos em apps/web/app/(app)/departamentos/page.tsx
- [x] T034 [P] [US2] Criar página placeholder Eventos em apps/web/app/(app)/eventos/page.tsx
- [x] T035 [P] [US2] Criar página placeholder Notificações em apps/web/app/(app)/notificacoes/page.tsx

### Mandatory Finalization for User Story 2 ✅

> **CONSTITUTION REQUIREMENT: Toda fase DEVE terminar com testes e commit**

- [x] T036 [US2] Executar e validar todos os testes unitários para User Story 2 (todos devem passar)
- [x] T037 [US2] Commit: "feat(navigation): menu com itens principais e páginas placeholder" *(consolidado em feat(e01))*

**Checkpoint**: US1 + US2 funcionais — navegação completa entre 5 secções

---

## Phase 5: User Story 3 - Identificação do Tenant (Priority: P2)

**Goal**: Nome do tenant visível de forma persistente na sidebar

**Independent Test**: Verificar que "Organização" (placeholder) aparece na sidebar em todas as páginas

### Tests for User Story 3 (TDD - Red Phase) ⚠️

> **NOTA: Escrever estes testes PRIMEIRO, garantir que FALHAM antes da implementação**

- [x] T038 [US3] Criar teste de TenantBadge (renderização do placeholder) em apps/web/__tests__/components/tenant-badge.test.tsx

### Implementation for User Story 3 (Green Phase)

- [x] T039 [US3] Criar componente TenantBadge em apps/web/components/app-shell/tenant-badge.tsx
- [x] T040 [US3] Integrar TenantBadge no header da AppSidebar em apps/web/components/app-shell/app-sidebar.tsx

### Mandatory Finalization for User Story 3 ✅

> **CONSTITUTION REQUIREMENT: Toda fase DEVE terminar com testes e commit**

- [x] T041 [US3] Executar e validar todos os testes unitários para User Story 3 (todos devem passar)
- [x] T042 [US3] Commit: "feat(tenant): identificação do tenant na sidebar" *(consolidado em feat(e01))*

**Checkpoint**: US1 + US2 + US3 funcionais — tenant identificado visualmente

---

## Phase 6: User Story 4 - Visibilidade de Menu Conforme Papel (Priority: P2)

**Goal**: Menu filtrado por papel via stub de desenvolvimento, selector de papel visível em dev

**Independent Test**: Usar selector de papel e verificar que itens de menu mudam conforme papel selecionado

### Tests for User Story 4 (TDD - Red Phase) ⚠️

> **NOTA: Escrever estes testes PRIMEIRO, garantir que FALHAM antes da implementação**

- [x] T043 [P] [US4] Criar testes de roles.ts em apps/web/__tests__/lib/roles.test.ts
- [x] T044 [P] [US4] Criar testes de getVisibleMenuItems e canAccessRoute em apps/web/__tests__/lib/navigation.test.ts
- [x] T045 [US4] Criar teste de RoleContext em apps/web/__tests__/contexts/role-context.test.tsx

### Implementation for User Story 4 (Green Phase)

- [x] T046 [US4] Criar RoleContext e RoleProvider em apps/web/contexts/role-context.tsx
- [x] T047 [US4] Implementar função getVisibleMenuItems em apps/web/lib/navigation.ts
- [x] T048 [US4] Implementar função canAccessRoute em apps/web/lib/navigation.ts
- [x] T049 [US4] Criar componente RoleSelector (dev only) em apps/web/components/dev/role-selector.tsx
- [x] T050 [US4] Integrar RoleProvider no layout em apps/web/app/(app)/layout.tsx
- [x] T051 [US4] Atualizar AppSidebar para filtrar menu por papel em apps/web/components/app-shell/app-sidebar.tsx
- [x] T052 [US4] Adicionar RoleSelector ao layout (condicional NODE_ENV) em apps/web/app/(app)/layout.tsx

### Mandatory Finalization for User Story 4 ✅

> **CONSTITUTION REQUIREMENT: Toda fase DEVE terminar com testes e commit**

- [x] T053 [US4] Executar e validar todos os testes unitários para User Story 4 (todos devem passar)
- [x] T054 [US4] Commit: "feat(rbac): visibilidade de menu conforme papel com stub" *(consolidado em feat(e01))*

**Checkpoint**: US1-US4 funcionais — RBAC demonstrável via stub

---

## Phase 7: User Story 5 - Administração Global para Master (Priority: P3)

**Goal**: Item "Administração global" visível apenas para Master, rota /admin funcional

**Independent Test**: Selecionar papel Master e verificar que "Administração global" aparece; outros papéis não veem

### Tests for User Story 5 (TDD - Red Phase) ⚠️

> **NOTA: Escrever estes testes PRIMEIRO, garantir que FALHAM antes da implementação**

- [x] T055 [US5] Criar teste de visibilidade admin-global apenas para Master em apps/web/__tests__/lib/navigation.test.ts

### Implementation for User Story 5 (Green Phase)

- [x] T056 [US5] Adicionar item admin-global ao menuConfig em apps/web/lib/navigation.ts
- [x] T057 [US5] Criar página placeholder Administração global em apps/web/app/(app)/admin/page.tsx
- [x] T058 [US5] Verificar que grupo "Plataforma" aparece apenas quando há itens visíveis

### Mandatory Finalization for User Story 5 ✅

> **CONSTITUTION REQUIREMENT: Toda fase DEVE terminar com testes e commit**

- [x] T059 [US5] Executar e validar todos os testes unitários para User Story 5 (todos devem passar)
- [x] T060 [US5] Commit: "feat(admin): administração global para papel Master" *(consolidado em feat(e01))*

**Checkpoint**: Todas as User Stories funcionais — E01 completo

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias que afetam múltiplas User Stories

- [x] T061 [P] Criar página 404 (not-found) em apps/web/app/not-found.tsx
- [x] T062 [P] Criar health check endpoint em apps/web/app/api/health/route.ts
- [x] T063 Validar comportamento responsive da sidebar (collapse em mobile) — Nota: foco é desktop; otimização mobile refinada em iterações futuras (conforme spec assumptions)
- [x] T064 Executar validação completa conforme quickstart.md
- [x] T065 [P] Atualizar metadata da aplicação (título, descrição) em apps/web/app/layout.tsx
- [x] T066 Verificar todos os testes passam: `pnpm test`
- [x] T067 Verificar lint passa: `pnpm lint`
- [x] T068 Commit final: "chore(e01): polish e validação final" *(consolidado em feat(e01))*

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente
- **Foundational (Phase 2)**: Depende de Setup — BLOQUEIA todas as User Stories
- **User Stories (Phase 3-7)**: Todas dependem de Foundational
  - US1 (P1) e US2 (P1): Podem executar sequencialmente ou em paralelo se houver equipa
  - US3 (P2): Pode começar após US1 (precisa da sidebar)
  - US4 (P2): Pode começar após US2 (precisa do menu)
  - US5 (P3): Pode começar após US4 (precisa do RBAC)
- **Polish (Phase 8)**: Depende de todas as User Stories desejadas

### User Story Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational
    ↓
┌───────────────────────────────────┐
│  US1 (P1) ──→ US3 (P2)            │
│      ↓                            │
│  US2 (P1) ──→ US4 (P2) ──→ US5 (P3)│
└───────────────────────────────────┘
    ↓
Phase 8: Polish
```

### Within Each User Story

1. Testes DEVEM ser escritos e FALHAR antes da implementação (Red)
2. Implementação mínima para testes passarem (Green)
3. Refactoring se necessário
4. Testes unitários finais + commit

### Parallel Opportunities

**Setup (Phase 1)**:
```
T001, T002, T003 podem executar em paralelo
```

**Foundational (Phase 2)**:
```
T007, T008, T009, T010 podem executar em paralelo
```

**US2 - Páginas placeholder**:
```
T031, T032, T033, T034, T035 podem executar em paralelo
```

**US4 - Testes**:
```
T043, T044 podem executar em paralelo
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (CRÍTICO)
3. Completar Phase 3: User Story 1
4. Completar Phase 4: User Story 2
5. **PARAR e VALIDAR**: Testar navegação básica
6. Deploy/demo se pronto

### Incremental Delivery

1. Setup + Foundational → Fundação pronta
2. US1 → Layout funcional → Demo
3. US2 → Navegação funcional → Demo (MVP!)
4. US3 → Tenant visível → Demo
5. US4 → RBAC stub → Demo
6. US5 → Admin global → Demo (E01 completo!)

### Parallel Team Strategy

Com múltiplos developers:

1. Equipa completa Setup + Foundational juntos
2. Após Foundational:
   - Developer A: US1 → US3
   - Developer B: US2 → US4 → US5
3. Stories integram independentemente

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 68 |
| **Setup Tasks** | 6 |
| **Foundational Tasks** | 7 |
| **US1 Tasks** | 11 |
| **US2 Tasks** | 13 |
| **US3 Tasks** | 5 |
| **US4 Tasks** | 12 |
| **US5 Tasks** | 6 |
| **Polish Tasks** | 8 |
| **Parallel Opportunities** | 22 tasks marked [P] |

### Constitution Alignment

Este ficheiro segue os princípios da constituição do projeto:
- **Princípio II (TDD)**: Testes escritos primeiro, ciclo Red-Green-Refactor
- **Princípio III (Fases Independentes)**: Cada US validável sem dependências futuras
- **Princípio IV (Versionamento)**: Tasks obrigatórias de teste + commit por fase
