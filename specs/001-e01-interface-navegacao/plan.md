# Implementation Plan: Interface e Navegação da Aplicação

**Branch**: `feature/001-e01-interface-navegacao` | **Date**: 2026-04-07 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-e01-interface-navegacao/spec.md`

## Summary

Implementar o shell da aplicação (layout, sidebar, cabeçalho) com navegação principal, identificação de tenant, suporte a modo claro/escuro, e visibilidade de menu baseada em papéis via stub de desenvolvimento. A abordagem técnica utiliza componentes Shadcn UI (Sidebar, Sheet) sobre Next.js App Router, com configuração de roles via React Context e persistência em localStorage para o stub de RBAC.

**Arquitetura BFF**: Next.js atua como Backend for Frontend — Server Components para data fetching, Route Handlers para APIs internas, Server Actions para mutações. O cliente não comunica diretamente com Supabase; toda lógica de dados passa pelo servidor Next.js.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 16.2.2, React 19.2.4)  
**Primary Dependencies**: Next.js, React, Tailwind CSS 4, Shadcn UI (radix-luma, zinc), Phosphor icons  
**Architecture**: Next.js como BFF (Backend for Frontend)  
**Storage**: N/A (UI shell — sem persistência própria; stub usa localStorage)  
**Testing**: Vitest (unitários/integração) — a configurar  
**Target Platform**: Web (browser), foco desktop (mobile deferred conforme spec)  
**Project Type**: Web application (monorepo `apps/web`)  
**Performance Goals**: Carregamento inicial < 3 segundos (SC-007)  
**Constraints**: Alinhamento com UI_SPEC.md, navegação rasa (≤1 nível), responsive mas desktop-first  
**Scale/Scope**: Shell com 6 itens de menu (Dashboard, Colaboradores, Departamentos, Eventos, Notificações, Administração global)

### BFF Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              React Client Components                     │   │
│  │         (UI interactions, state, events)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Next.js BFF (Server)                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Server Components│  │  Route Handlers  │  │Server Actions│  │
│  │   (data fetch)   │  │   (app/api/*)    │  │  (mutations) │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Services Layer (lib/services/)              │   │
│  │    - Auth service    - Tenant service    - etc.         │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase (Data Layer)                        │
│         PostgreSQL + RLS + Auth (via service role)              │
└─────────────────────────────────────────────────────────────────┘
```

**Princípios BFF**:
- Client Components não acedem diretamente ao Supabase
- Server Components fazem data fetching com contexto de sessão
- Server Actions validam autorização antes de mutações
- Route Handlers para APIs internas quando necessário
- Services layer abstrai acesso a dados (testável com mocks)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify alignment with `.specify/memory/constitution.md`:

| Principle | Verification | Status |
|-----------|--------------|--------|
| **I. Código Limpo** | Nomes refletem linguagem ubíqua: `tenant`, `role`, `MenuItem`, `Sidebar`, `AppShell`. Componentes com responsabilidade única. | ☑ |
| **II. TDD** | Testes Vitest escritos antes da implementação para: visibilidade de menu por papel, renderização de layout, toggle de tema. | ☑ |
| **III. Fases Independentes** | Cada US validável: US1 (layout) → US2 (menu) → US3 (tenant) → US4 (RBAC) → US5 (Master). Stub de RBAC permite validação sem E02/E03. | ☑ |
| **IV. Versionamento** | Cada US termina com task de testes + commit atómico. | ☑ |

**Additional checks:**
- [x] Alinhamento com [PROPOSAL.md](../../docs/PROPOSAL.md) — matriz RBAC para visibilidade de menu
- [x] Alinhamento com [SECURITY.md](../../docs/SECURITY.md) — stub apenas em dev; validação server-side preparada
- [x] Alinhamento com [ENGINEERING.md](../../docs/ENGINEERING.md) — stack Next.js/Shadcn, Vitest

## Project Structure

### Documentation (this feature)

```text
specs/001-e01-interface-navegacao/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── menu.contract.md    # Menu configuration and RBAC rules
│   └── routes.contract.md  # Application routes and navigation
└── checklists/
    └── requirements.md  # Spec validation checklist
```

### Source Code (repository root)

```text
apps/web/
├── app/
│   ├── layout.tsx                    # Root layout (existing, to extend)
│   ├── globals.css                   # Theme tokens (existing)
│   ├── page.tsx                      # Landing → redirect to /dashboard
│   ├── api/                          # Route Handlers (BFF endpoints)
│   │   └── health/
│   │       └── route.ts              # Health check endpoint
│   ├── (app)/                        # Route group for authenticated shell
│   │   ├── layout.tsx                # AppShell layout with Sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard placeholder (Server Component)
│   │   ├── colaboradores/
│   │   │   └── page.tsx              # Colaboradores placeholder
│   │   ├── departamentos/
│   │   │   └── page.tsx              # Departamentos placeholder
│   │   ├── eventos/
│   │   │   └── page.tsx              # Eventos placeholder
│   │   ├── notificacoes/
│   │   │   └── page.tsx              # Notificações placeholder
│   │   └── admin/
│   │       └── page.tsx              # Administração global placeholder
│   └── not-found.tsx                 # 404 page
├── components/
│   ├── ui/                           # Shadcn components (add as needed)
│   ├── app-shell/
│   │   ├── app-shell.tsx             # Main shell component
│   │   ├── app-sidebar.tsx           # Sidebar with navigation
│   │   ├── app-header.tsx            # Header with tenant + theme toggle
│   │   └── nav-item.tsx              # Navigation item component
│   └── theme/
│       ├── theme-provider.tsx        # Theme context provider
│       └── theme-toggle.tsx          # Theme toggle button
├── contexts/
│   └── role-context.tsx              # Role stub context (dev only)
├── lib/
│   ├── utils.ts                      # Existing utilities
│   ├── navigation.ts                 # Menu configuration with RBAC rules
│   ├── roles.ts                      # Role definitions and permissions
│   ├── supabase/
│   │   ├── client.ts                 # Supabase client (browser - limited)
│   │   ├── server.ts                 # Supabase client (server - service role)
│   │   └── middleware.ts             # Supabase auth middleware helpers
│   └── services/                     # BFF Services Layer
│       ├── auth.service.ts           # Auth operations (server-side)
│       └── tenant.service.ts         # Tenant context (server-side)
├── actions/                          # Server Actions
│   └── .gitkeep                      # Placeholder (actions added in E02+)
└── __tests__/
    ├── components/
    │   ├── app-shell.test.tsx
    │   └── nav-item.test.tsx
    └── lib/
        ├── navigation.test.ts
        └── roles.test.ts
```

**Structure Decision**: 
- Route group `(app)` encapsula o shell autenticado
- `app/api/` para Route Handlers (endpoints BFF)
- `lib/services/` para lógica de negócio server-side (testável)
- `lib/supabase/` separa clients browser vs server
- `actions/` para Server Actions (mutações em E02+)
- Pages são Server Components por default (data fetching no servidor)

## Complexity Tracking

> No violations detected. Implementation follows standard patterns.

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Route Groups | `(app)/` para shell | Separação de layouts sem duplicação |
| Role Stub | React Context + localStorage | Simples, removível, não polui produção |
| Theme | next-themes ou manual | Shadcn pattern standard |
