# Contract: Menu de Navegação

**Feature**: 001-e01-interface-navegacao  
**Version**: 1.0.0  
**Date**: 2026-04-07

## Overview

Este contrato define a estrutura do menu de navegação principal da aplicação, incluindo itens, agrupamentos, ícones e regras de visibilidade por papel (RBAC).

---

## Menu Items

### Estrutura Completa

| ID | Label | Href | Icon (Phosphor) | Grupo |
|----|-------|------|-----------------|-------|
| `dashboard` | Dashboard | `/dashboard` | `House` | main |
| `colaboradores` | Colaboradores | `/colaboradores` | `Users` | main |
| `departamentos` | Departamentos | `/departamentos` | `Buildings` | main |
| `eventos` | Eventos | `/eventos` | `Calendar` | main |
| `notificacoes` | Notificações | `/notificacoes` | `Bell` | main |
| `admin-global` | Administração global | `/admin` | `GearSix` | platform |

---

## Visibility Matrix (RBAC)

### Por Item

| Item | Master | Admin | RH | Gestor | Colaborador |
|------|--------|-------|-----|--------|-------------|
| Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ |
| Colaboradores | ✓ | ✓ | ✓ | ✓ | ✓ |
| Departamentos | ✗ | ✓ | ✓ | ✗ | ✗ |
| Eventos | ✓ | ✓ | ✓ | ✓ | ✓ |
| Notificações | ✓ | ✓ | ✓ | ✓ | ✓ |
| Administração global | ✓ | ✗ | ✗ | ✗ | ✗ |

### Por Papel (Itens Visíveis)

| Papel | Itens Visíveis |
|-------|----------------|
| **Master** | Dashboard, Colaboradores, Eventos, Notificações, Administração global |
| **Admin** | Dashboard, Colaboradores, Departamentos, Eventos, Notificações |
| **RH** | Dashboard, Colaboradores, Departamentos, Eventos, Notificações |
| **Gestor** | Dashboard, Colaboradores, Eventos, Notificações |
| **Colaborador** | Dashboard, Colaboradores, Eventos, Notificações |

**Notas**:
- Master opera no plano plataforma, não vê Departamentos (módulo tenant-specific)
- Administração global é exclusiva para Master (gestão de tenants)

---

## TypeScript Interface

```typescript
// lib/navigation.ts

import type { Icon } from '@phosphor-icons/react';

/**
 * Papéis disponíveis no sistema.
 */
export type Role = 'master' | 'admin' | 'rh' | 'gestor' | 'colaborador';

/**
 * Grupos de menu para organização visual.
 */
export type MenuGroup = 'main' | 'platform';

/**
 * Item de navegação do menu principal.
 */
export interface MenuItem {
  /** Identificador único */
  id: string;
  /** Texto exibido no menu */
  label: string;
  /** Rota de destino */
  href: string;
  /** Componente de ícone Phosphor */
  icon: Icon;
  /** Papéis que podem ver este item */
  visibleTo: Role[];
  /** Grupo ao qual pertence */
  group: MenuGroup;
  /** Se o item está temporariamente desabilitado */
  disabled?: boolean;
  /** Badge de notificação (ex: contagem) */
  badge?: number | string;
}

/**
 * Configuração completa do menu.
 */
export interface MenuConfig {
  /** Itens do menu */
  items: MenuItem[];
  /** Ordem dos grupos */
  groupOrder: MenuGroup[];
  /** Labels dos grupos (opcional) */
  groupLabels?: Record<MenuGroup, string>;
}
```

---

## Menu Configuration

```typescript
// lib/navigation.ts

import {
  House,
  Users,
  Buildings,
  Calendar,
  Bell,
  GearSix,
} from '@phosphor-icons/react';

export const menuConfig: MenuConfig = {
  items: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: House,
      visibleTo: ['master', 'admin', 'rh', 'gestor', 'colaborador'],
      group: 'main',
    },
    {
      id: 'colaboradores',
      label: 'Colaboradores',
      href: '/colaboradores',
      icon: Users,
      visibleTo: ['master', 'admin', 'rh', 'gestor', 'colaborador'],
      group: 'main',
    },
    {
      id: 'departamentos',
      label: 'Departamentos',
      href: '/departamentos',
      icon: Buildings,
      visibleTo: ['admin', 'rh'],
      group: 'main',
    },
    {
      id: 'eventos',
      label: 'Eventos',
      href: '/eventos',
      icon: Calendar,
      visibleTo: ['master', 'admin', 'rh', 'gestor', 'colaborador'],
      group: 'main',
    },
    {
      id: 'notificacoes',
      label: 'Notificações',
      href: '/notificacoes',
      icon: Bell,
      visibleTo: ['master', 'admin', 'rh', 'gestor', 'colaborador'],
      group: 'main',
    },
    {
      id: 'admin-global',
      label: 'Administração global',
      href: '/admin',
      icon: GearSix,
      visibleTo: ['master'],
      group: 'platform',
    },
  ],
  groupOrder: ['main', 'platform'],
  groupLabels: {
    main: undefined, // Sem label para grupo principal
    platform: 'Plataforma',
  },
};
```

---

## Helper Functions

```typescript
// lib/navigation.ts

/**
 * Filtra itens de menu visíveis para um papel específico.
 */
export function getVisibleMenuItems(role: Role): MenuItem[] {
  return menuConfig.items.filter(item => item.visibleTo.includes(role));
}

/**
 * Agrupa itens visíveis por grupo.
 */
export function getMenuItemsByGroup(role: Role): Record<MenuGroup, MenuItem[]> {
  const visibleItems = getVisibleMenuItems(role);
  
  return menuConfig.groupOrder.reduce((acc, group) => {
    acc[group] = visibleItems.filter(item => item.group === group);
    return acc;
  }, {} as Record<MenuGroup, MenuItem[]>);
}

/**
 * Verifica se um papel tem acesso a uma rota específica.
 */
export function canAccessRoute(role: Role, href: string): boolean {
  const item = menuConfig.items.find(i => i.href === href);
  if (!item) return false;
  return item.visibleTo.includes(role);
}

/**
 * Obtém o item de menu ativo baseado no pathname.
 */
export function getActiveMenuItem(pathname: string): MenuItem | undefined {
  return menuConfig.items.find(item => pathname.startsWith(item.href));
}
```

---

## Visual Specifications

### Layout da Sidebar

```
┌─────────────────────────────────┐
│  [Logo/Nome]                    │
│  Organização                    │  ← Tenant name
├─────────────────────────────────┤
│                                 │
│  🏠 Dashboard                   │  ← Active state highlighted
│  👥 Colaboradores               │
│  🏢 Departamentos               │  ← Hidden for Gestor/Colaborador
│  📅 Eventos                     │
│  🔔 Notificações           (3)  │  ← Badge opcional
│                                 │
├─────────────────────────────────┤
│  Plataforma                     │  ← Group label (Master only)
│  ⚙️ Administração global        │
│                                 │
├─────────────────────────────────┤
│  [Theme Toggle] [User Menu]     │  ← Footer actions
└─────────────────────────────────┘
```

### Estados Visuais

| Estado | Estilo |
|--------|--------|
| **Default** | `text-muted-foreground`, icon regular |
| **Hover** | `bg-accent`, `text-accent-foreground` |
| **Active** | `bg-primary/10`, `text-primary`, icon bold |
| **Disabled** | `opacity-50`, `pointer-events-none` |
| **With Badge** | Badge circular no canto direito |

### Ícones (Phosphor)

| Item | Ícone Regular | Ícone Active (Bold) |
|------|---------------|---------------------|
| Dashboard | `<House />` | `<House weight="bold" />` |
| Colaboradores | `<Users />` | `<Users weight="bold" />` |
| Departamentos | `<Buildings />` | `<Buildings weight="bold" />` |
| Eventos | `<Calendar />` | `<Calendar weight="bold" />` |
| Notificações | `<Bell />` | `<Bell weight="bold" />` |
| Administração global | `<GearSix />` | `<GearSix weight="bold" />` |

---

## Test Scenarios

### Unit Tests (`navigation.test.ts`)

```typescript
describe('getVisibleMenuItems', () => {
  it('returns all main items for admin', () => {
    const items = getVisibleMenuItems('admin');
    expect(items.map(i => i.id)).toEqual([
      'dashboard', 'colaboradores', 'departamentos', 'eventos', 'notificacoes'
    ]);
  });

  it('excludes departamentos for colaborador', () => {
    const items = getVisibleMenuItems('colaborador');
    expect(items.find(i => i.id === 'departamentos')).toBeUndefined();
  });

  it('includes admin-global only for master', () => {
    expect(getVisibleMenuItems('master').find(i => i.id === 'admin-global')).toBeDefined();
    expect(getVisibleMenuItems('admin').find(i => i.id === 'admin-global')).toBeUndefined();
  });

  it('excludes departamentos for master (platform scope)', () => {
    const items = getVisibleMenuItems('master');
    expect(items.find(i => i.id === 'departamentos')).toBeUndefined();
  });
});

describe('canAccessRoute', () => {
  it('returns true for allowed routes', () => {
    expect(canAccessRoute('admin', '/departamentos')).toBe(true);
  });

  it('returns false for restricted routes', () => {
    expect(canAccessRoute('colaborador', '/departamentos')).toBe(false);
    expect(canAccessRoute('admin', '/admin')).toBe(false);
  });
});
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-07 | Initial contract definition |
