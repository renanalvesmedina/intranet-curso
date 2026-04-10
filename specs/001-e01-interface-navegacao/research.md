# Research: Interface e Navegação

**Feature**: 001-e01-interface-navegacao  
**Date**: 2026-04-07

## Technical Context Resolution

### 0. Next.js como BFF (Backend for Frontend)

**Decision**: Utilizar Next.js como camada BFF entre o cliente e o Supabase

**Rationale**:
- **Segurança**: Client Components não acedem diretamente ao Supabase para writes
- **Validação centralizada**: Toda autorização passa pelo servidor Next.js
- **Flexibilidade**: Server Components para data fetching, Server Actions para mutations
- **Performance**: RSC streaming, data fetching no edge
- **Testabilidade**: Services layer testável com mocks

**Architecture**:
```
Browser → Next.js BFF (Server) → Supabase
         ├── Server Components (reads)
         ├── Server Actions (writes)
         └── Services Layer (business logic)
```

**Implementation**:
- `lib/supabase/client.ts` — Browser client (anon key, RLS enforced)
- `lib/supabase/server.ts` — Server client (with cookies for session)
- `lib/services/*.ts` — Business logic layer (testável)
- `actions/*.ts` — Server Actions para mutações

**Alternatives considered**:
- Direct Supabase from client: Rejeitado — menos controle sobre autorização, lógica dispersa
- Separate API service: Rejeitado — overhead desnecessário, Next.js já serve como BFF

**E01 Scope**: Setup da estrutura BFF; implementação completa em E02/E03.

---

### 1. Shadcn Sidebar Component

**Decision**: Utilizar o componente `Sidebar` do Shadcn UI

**Rationale**: 
- Componente oficial do registry Shadcn com suporte a collapsible, grupos, e itens de menu
- Integra com o sistema de tokens do projeto (radix-luma, zinc)
- Suporta modo mobile com Sheet drawer automaticamente
- Acessibilidade built-in (keyboard navigation, focus management)

**Alternatives considered**:
- Sidebar custom: Rejeitado — mais código, menos consistência com design system
- Radix Navigation Menu: Rejeitado — optimizado para navbars horizontais, não sidebars

**Installation**: `pnpm dlx shadcn@latest add sidebar sheet button separator`

---

### 2. Theme Management (Claro/Escuro)

**Decision**: Implementar com `next-themes` ou padrão manual via CSS class toggle

**Rationale**:
- `next-themes` é a solução padrão para Next.js App Router
- Evita flash de tema incorreto (FOUC) com script de hidratação
- Integra com tokens CSS já definidos em globals.css (`:root` e `.dark`)

**Alternatives considered**:
- Tailwind `dark:` classes apenas: Rejeitado — não persiste preferência
- React Context manual: Possível mas `next-themes` resolve edge cases

**Installation**: `pnpm add next-themes`

---

### 3. Role Stub para RBAC (Desenvolvimento)

**Decision**: React Context com DevTools selector + localStorage persistence

**Rationale**:
- Permite alternar papel sem backend (E02/E03 não implementados)
- localStorage mantém seleção entre refreshes
- Selector visível apenas em `process.env.NODE_ENV === 'development'`
- Fácil remoção quando autenticação real existir

**Implementation approach**:
```typescript
// contexts/role-context.tsx
type Role = 'master' | 'admin' | 'rh' | 'gestor' | 'colaborador';

const RoleContext = createContext<{
  role: Role;
  setRole: (role: Role) => void;
}>({ role: 'colaborador', setRole: () => {} });
```

**Alternatives considered**:
- URL query param (`?role=admin`): Rejeitado — expõe em produção se esquecido
- Environment variable: Rejeitado — não permite alternar dinamicamente

---

### 4. Navigation Configuration

**Decision**: Configuração declarativa em `lib/navigation.ts` com regras de visibilidade

**Rationale**:
- Single source of truth para menu items
- Regras de RBAC colocalizadas com definição do menu
- Facilita testes unitários (função pura `getVisibleMenuItems(role)`)

**Structure**:
```typescript
// lib/navigation.ts
export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: ComponentType;
  roles: Role[]; // Papéis que veem este item
}

export const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: House, roles: ['master', 'admin', 'rh', 'gestor', 'colaborador'] },
  { id: 'colaboradores', label: 'Colaboradores', href: '/colaboradores', icon: Users, roles: ['master', 'admin', 'rh', 'gestor', 'colaborador'] },
  { id: 'departamentos', label: 'Departamentos', href: '/departamentos', icon: Buildings, roles: ['admin', 'rh'] },
  { id: 'eventos', label: 'Eventos', href: '/eventos', icon: Calendar, roles: ['master', 'admin', 'rh', 'gestor', 'colaborador'] },
  { id: 'notificacoes', label: 'Notificações', href: '/notificacoes', icon: Bell, roles: ['master', 'admin', 'rh', 'gestor', 'colaborador'] },
  { id: 'admin-global', label: 'Administração global', href: '/admin', icon: Gear, roles: ['master'] },
];

export function getVisibleMenuItems(role: Role): MenuItem[] {
  return menuItems.filter(item => item.roles.includes(role));
}
```

---

### 5. Tenant Identification Display

**Decision**: Mostrar nome do tenant no header da sidebar + área de tenant info

**Rationale**:
- Sidebar header é área de alta visibilidade persistente
- Alinhado com UI_SPEC: "mostrar o nome da empresa de forma persistente"
- Placeholder "Organização" até E03 implementar contexto real

**Implementation**:
- Componente `TenantBadge` no header da sidebar
- Valor fixo/placeholder com comentário indicando substituição futura

---

### 6. Testing Strategy (Vitest)

**Decision**: Configurar Vitest com React Testing Library

**Rationale**:
- Stack definida em ENGINEERING.md
- Testes de componentes React com `@testing-library/react`
- Testes de funções puras para `navigation.ts` e `roles.ts`

**Installation**:
```bash
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

**Test targets (TDD)**:
1. `getVisibleMenuItems(role)` — testa filtragem por papel
2. `NavItem` — renderiza corretamente, marca ativo
3. `AppShell` — renderiza sidebar e conteúdo
4. `ThemeToggle` — alterna entre claro/escuro

---

## Dependencies Summary

| Package | Purpose | Version |
|---------|---------|---------|
| `next-themes` | Theme management | ^0.4.x |
| `vitest` | Test runner | ^3.x |
| `@testing-library/react` | React component testing | ^16.x |
| `@testing-library/jest-dom` | DOM matchers | ^6.x |
| `jsdom` | DOM environment for tests | ^26.x |

**Shadcn components to add**:
- `sidebar` — main navigation component
- `sheet` — mobile drawer (dependency of sidebar)
- `button` — actions and toggles
- `separator` — visual dividers
- `tooltip` — collapsed sidebar hints

---

## Resolved Clarifications

| Topic | Resolution |
|-------|------------|
| Sidebar vs Header layout | Sidebar como navegação principal (alinhado com UI_SPEC e Shadcn patterns) |
| Mobile behavior | Sidebar auto-converts to Sheet drawer (Shadcn built-in) |
| Icon library | Phosphor icons (per components.json) — `@phosphor-icons/react` já instalado |
| Theme persistence | localStorage via next-themes |
| Role stub activation | Dev-only selector component, localStorage persistence |
