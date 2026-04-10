# Data Model: Interface e Navegação

**Feature**: 001-e01-interface-navegacao  
**Date**: 2026-04-07

## Overview

E01 é um épico de UI shell sem persistência própria de dados. O modelo de dados consiste em tipos TypeScript para configuração de navegação e controle de papéis (stub). Não há entidades de base de dados neste épico.

---

## TypeScript Types

### Role (Papel do Utilizador)

```typescript
// lib/roles.ts

/**
 * Papéis disponíveis na aplicação.
 * Alinhado com PROPOSAL.md - matriz RBAC.
 */
export type Role = 'master' | 'admin' | 'rh' | 'gestor' | 'colaborador';

/**
 * Configuração de papel com metadata.
 */
export interface RoleConfig {
  id: Role;
  label: string;
  description: string;
  /** Nível de privilégio (maior = mais permissões). Usado para ordenação. */
  level: number;
}

export const ROLES: Record<Role, RoleConfig> = {
  master: {
    id: 'master',
    label: 'Master',
    description: 'Administrador da plataforma (multi-tenant)',
    level: 100,
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    description: 'Administrador do tenant',
    level: 80,
  },
  rh: {
    id: 'rh',
    label: 'RH',
    description: 'Recursos Humanos do tenant',
    level: 60,
  },
  gestor: {
    id: 'gestor',
    label: 'Gestor',
    description: 'Gestor de equipa',
    level: 40,
  },
  colaborador: {
    id: 'colaborador',
    label: 'Colaborador',
    description: 'Colaborador padrão',
    level: 20,
  },
};
```

---

### MenuItem (Item de Navegação)

```typescript
// lib/navigation.ts

import type { ComponentType } from 'react';
import type { Role } from './roles';

/**
 * Item de menu na navegação principal.
 */
export interface MenuItem {
  /** Identificador único do item */
  id: string;
  /** Rótulo exibido no menu */
  label: string;
  /** Rota de destino (Next.js href) */
  href: string;
  /** Componente de ícone (Phosphor) */
  icon: ComponentType<{ className?: string; weight?: string }>;
  /** Papéis que podem ver este item */
  visibleTo: Role[];
  /** Se o item está desativado (ex.: módulo não implementado) */
  disabled?: boolean;
}

/**
 * Grupo de itens de menu (para agrupamento visual).
 */
export interface MenuGroup {
  /** Identificador do grupo */
  id: string;
  /** Rótulo do grupo (opcional, pode ser omitido para grupos sem título) */
  label?: string;
  /** Itens pertencentes a este grupo */
  items: MenuItem[];
}
```

---

### Tenant Context (Stub)

```typescript
// lib/tenant.ts

/**
 * Informação do tenant para exibição.
 * Em E01, usa valor placeholder; substituído por dados reais em E03.
 */
export interface TenantInfo {
  /** Identificador único do tenant */
  id: string;
  /** Nome da organização */
  name: string;
  /** URL do logo (opcional) */
  logoUrl?: string;
}

/**
 * Tenant placeholder para E01.
 * TODO: Substituir por contexto real em E03.
 */
export const PLACEHOLDER_TENANT: TenantInfo = {
  id: 'placeholder',
  name: 'Organização',
  logoUrl: undefined,
};
```

---

### Theme Configuration

```typescript
// lib/theme.ts

/**
 * Temas disponíveis na aplicação.
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Configuração de tema.
 */
export interface ThemeConfig {
  /** Tema atual selecionado */
  theme: Theme;
  /** Tema efetivo (resolvido de 'system') */
  resolvedTheme: 'light' | 'dark';
}
```

---

## State Management

### RoleContext (Stub para Desenvolvimento)

```typescript
// contexts/role-context.tsx

import type { Role } from '@/lib/roles';

export interface RoleContextValue {
  /** Papel atual do utilizador (stub) */
  role: Role;
  /** Função para alterar o papel (apenas em desenvolvimento) */
  setRole: (role: Role) => void;
  /** Se o selector deve estar visível */
  showSelector: boolean;
}
```

**State persistence**: localStorage key `dev-role-stub`

**Default value**: `'colaborador'` (papel mais restritivo para teste seguro)

---

## Navigation Configuration

### Menu Structure

| ID | Label | Href | Roles | Icon |
|----|-------|------|-------|------|
| `dashboard` | Dashboard | `/dashboard` | Todos | `House` |
| `colaboradores` | Colaboradores | `/colaboradores` | Todos | `Users` |
| `departamentos` | Departamentos | `/departamentos` | admin, rh | `Buildings` |
| `eventos` | Eventos | `/eventos` | Todos | `Calendar` |
| `notificacoes` | Notificações | `/notificacoes` | Todos | `Bell` |
| `admin-global` | Administração global | `/admin` | master | `Gear` |

### Visibility Rules (from PROPOSAL.md)

| Papel | Vê Dashboard | Vê Colaboradores | Vê Departamentos | Vê Eventos | Vê Notificações | Vê Admin Global |
|-------|--------------|------------------|------------------|------------|-----------------|-----------------|
| Master | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| RH | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Gestor | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |
| Colaborador | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |

**Nota**: Master não vê Departamentos porque opera no plano plataforma, não dentro de um tenant específico.

---

## Validation Rules

1. **MenuItem.href** deve começar com `/`
2. **MenuItem.roles** não pode estar vazio (pelo menos um papel deve ter acesso)
3. **MenuItem.id** deve ser único na lista de menu
4. **Role** deve ser um dos valores válidos do tipo `Role`

---

## State Transitions

### Theme Toggle

```
light → dark → system → light (cycle)
```

ou

```
light ↔ dark (binary toggle, ignorando system)
```

**Decisão**: Binary toggle (light ↔ dark) para simplicidade. "System" pode ser default inicial mas não no ciclo de toggle.

### Role Selector (Dev Only)

```
[qualquer papel] → [qualquer papel]
```

Sem restrições de transição — selector permite escolher qualquer papel diretamente.
