# Contract: Rotas da Aplicação

**Feature**: 001-e01-interface-navegacao  
**Version**: 1.0.0  
**Date**: 2026-04-07

## Overview

Este contrato define as rotas da aplicação implementadas no E01, incluindo estrutura de ficheiros Next.js, layouts, e comportamento de navegação.

---

## Route Structure

### Next.js App Router

```
apps/web/app/
├── layout.tsx              # Root layout (theme provider, fonts)
├── page.tsx                # Landing → redirect to /dashboard
├── not-found.tsx           # 404 page
├── (app)/                  # Route group: authenticated shell
│   ├── layout.tsx          # AppShell layout (sidebar + header)
│   ├── dashboard/
│   │   └── page.tsx        # Dashboard page
│   ├── colaboradores/
│   │   └── page.tsx        # Colaboradores page
│   ├── departamentos/
│   │   └── page.tsx        # Departamentos page
│   ├── eventos/
│   │   └── page.tsx        # Eventos page
│   ├── notificacoes/
│   │   └── page.tsx        # Notificações page
│   └── admin/
│       └── page.tsx        # Administração global page
└── (auth)/                 # Route group: authentication (E02)
    └── [placeholder]       # Login, etc. (future)
```

---

## Routes Table

### Public Routes

| Route | File | Layout | Description |
|-------|------|--------|-------------|
| `/` | `app/page.tsx` | Root | Landing, redirect to `/dashboard` |
| `/404` | `app/not-found.tsx` | Root | Page not found |

### Authenticated Routes (App Shell)

| Route | File | Layout | Access | Description |
|-------|------|--------|--------|-------------|
| `/dashboard` | `app/(app)/dashboard/page.tsx` | AppShell | All roles | Dashboard principal |
| `/colaboradores` | `app/(app)/colaboradores/page.tsx` | AppShell | All roles | Diretório de colaboradores |
| `/departamentos` | `app/(app)/departamentos/page.tsx` | AppShell | Admin, RH | Estrutura organizacional |
| `/eventos` | `app/(app)/eventos/page.tsx` | AppShell | All roles | Eventos internos |
| `/notificacoes` | `app/(app)/notificacoes/page.tsx` | AppShell | All roles | Centro de notificações |
| `/admin` | `app/(app)/admin/page.tsx` | AppShell | Master only | Administração da plataforma |

---

## Route Access Control

### Visibility vs Access

| Concept | E01 Behavior | E02+ Behavior |
|---------|--------------|---------------|
| **Menu Visibility** | Controlado por role stub | Controlado por sessão real |
| **Route Access** | Páginas visíveis a todos (placeholder) | Middleware valida sessão e papel |
| **Unauthorized Access** | N/A (sem auth) | Redirect to `/login` ou 403 |

### Access Matrix

| Route | Master | Admin | RH | Gestor | Colaborador |
|-------|--------|-------|-----|--------|-------------|
| `/dashboard` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/colaboradores` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/departamentos` | ✗ | ✓ | ✓ | ✗ | ✗ |
| `/eventos` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/notificacoes` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/admin` | ✓ | ✗ | ✗ | ✗ | ✗ |

---

## Layout Hierarchy

```
RootLayout (app/layout.tsx)
├── ThemeProvider
├── Fonts (Inter, Geist, Geist Mono)
└── children
    │
    ├── Landing Page (app/page.tsx)
    │   └── Redirect to /dashboard
    │
    ├── Not Found (app/not-found.tsx)
    │   └── 404 content with navigation link
    │
    └── AppShellLayout (app/(app)/layout.tsx)
        ├── RoleProvider (dev stub)
        ├── AppShell
        │   ├── Sidebar
        │   │   ├── TenantBadge
        │   │   ├── Navigation
        │   │   └── Footer (theme toggle)
        │   └── Main Content Area
        │       ├── Header (optional)
        │       └── children (page content)
        │
        └── RoleSelector (dev only)
```

---

## Page Components

### Placeholder Page Template

Todas as páginas em E01 são placeholders que serão substituídos em épicos posteriores.

```typescript
// Template para páginas placeholder
// app/(app)/[module]/page.tsx

import { House } from '@phosphor-icons/react'; // Icon apropriado

export default function ModulePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <div className="rounded-full bg-muted p-6">
        <House className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Esta página será implementada no épico E09.
        </p>
      </div>
    </div>
  );
}
```

### Page Metadata

| Page | Title | Description | Épico Destino |
|------|-------|-------------|---------------|
| Dashboard | `Dashboard \| Intranet` | Resumo do contexto | E09 |
| Colaboradores | `Colaboradores \| Intranet` | Diretório da empresa | E04, E05 |
| Departamentos | `Departamentos \| Intranet` | Estrutura organizacional | E06 |
| Eventos | `Eventos \| Intranet` | Eventos internos | E07 |
| Notificações | `Notificações \| Intranet` | Centro de notificações | E08 |
| Admin | `Administração \| Intranet` | Gestão da plataforma | E10 |

---

## Navigation Behavior

### Route Transitions

| From | To | Behavior |
|------|-----|----------|
| Any page | Menu item click | Client-side navigation (Next.js Link) |
| `/` | `/dashboard` | Server redirect |
| Invalid URL | `/404` | Not found page |
| Unauthorized route | TBD (E02) | Redirect to login or 403 |

### Active State Detection

```typescript
// lib/navigation.ts

/**
 * Determina se uma rota está ativa baseado no pathname atual.
 * Usa startsWith para suportar sub-rotas.
 */
export function isRouteActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    // Dashboard é ativo apenas para match exato ou /dashboard/*
    return pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  }
  // Outras rotas: startsWith match
  return pathname.startsWith(href);
}
```

### URL Patterns (Preparação para E02+)

| Pattern | Example | Purpose |
|---------|---------|---------|
| `/[module]` | `/colaboradores` | Lista/index do módulo |
| `/[module]/[id]` | `/colaboradores/123` | Detalhe de item |
| `/[module]/new` | `/eventos/new` | Criar novo item |
| `/[module]/[id]/edit` | `/eventos/123/edit` | Editar item |

**Nota**: Rotas com parâmetros serão implementadas nos épicos respectivos. E01 implementa apenas as rotas base (index).

---

## Error Handling

### 404 Not Found

```typescript
// app/not-found.tsx

import Link from 'next/link';
import { Warning } from '@phosphor-icons/react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Warning className="h-16 w-16 text-muted-foreground" />
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
      <p className="text-muted-foreground">
        A página que procura não existe ou foi movida.
      </p>
      <Link
        href="/dashboard"
        className="text-primary underline-offset-4 hover:underline"
      >
        Voltar ao Dashboard
      </Link>
    </div>
  );
}
```

### Error Boundary (Preparação)

```typescript
// app/(app)/error.tsx (opcional em E01)

'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">Algo correu mal</h2>
      <button onClick={reset} className="text-primary hover:underline">
        Tentar novamente
      </button>
    </div>
  );
}
```

---

## TypeScript Interfaces

```typescript
// types/routes.ts

/**
 * Identificadores de rota válidos.
 */
export type RouteId = 
  | 'dashboard'
  | 'colaboradores'
  | 'departamentos'
  | 'eventos'
  | 'notificacoes'
  | 'admin';

/**
 * Mapeamento de IDs para paths.
 */
export const ROUTES: Record<RouteId, string> = {
  dashboard: '/dashboard',
  colaboradores: '/colaboradores',
  departamentos: '/departamentos',
  eventos: '/eventos',
  notificacoes: '/notificacoes',
  admin: '/admin',
} as const;

/**
 * Configuração de uma rota.
 */
export interface RouteConfig {
  id: RouteId;
  path: string;
  title: string;
  description: string;
  /** Épico onde será implementada */
  targetEpic: string;
  /** Se está implementada ou é placeholder */
  isPlaceholder: boolean;
}

/**
 * Configuração de todas as rotas.
 */
export const routeConfigs: RouteConfig[] = [
  {
    id: 'dashboard',
    path: '/dashboard',
    title: 'Dashboard',
    description: 'Resumo do contexto do tenant',
    targetEpic: 'E09',
    isPlaceholder: true,
  },
  {
    id: 'colaboradores',
    path: '/colaboradores',
    title: 'Colaboradores',
    description: 'Diretório e gestão de colaboradores',
    targetEpic: 'E04/E05',
    isPlaceholder: true,
  },
  {
    id: 'departamentos',
    path: '/departamentos',
    title: 'Departamentos',
    description: 'Estrutura organizacional',
    targetEpic: 'E06',
    isPlaceholder: true,
  },
  {
    id: 'eventos',
    path: '/eventos',
    title: 'Eventos',
    description: 'Eventos internos da organização',
    targetEpic: 'E07',
    isPlaceholder: true,
  },
  {
    id: 'notificacoes',
    path: '/notificacoes',
    title: 'Notificações',
    description: 'Centro de notificações in-app',
    targetEpic: 'E08',
    isPlaceholder: true,
  },
  {
    id: 'admin',
    path: '/admin',
    title: 'Administração global',
    description: 'Gestão da plataforma (Master)',
    targetEpic: 'E10',
    isPlaceholder: true,
  },
];
```

---

## Middleware (Preparação para E02)

```typescript
// middleware.ts (a implementar em E02)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que requerem autenticação
const protectedRoutes = [
  '/dashboard',
  '/colaboradores',
  '/departamentos',
  '/eventos',
  '/notificacoes',
  '/admin',
];

// Rotas públicas
const publicRoutes = ['/', '/login', '/primeiro-acesso', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // E01: Sem autenticação, permite todas as rotas
  // E02+: Verificar sessão e redirecionar conforme necessário
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## Test Scenarios

### Navigation Tests

```typescript
// __tests__/navigation.test.ts

describe('Route Navigation', () => {
  describe('isRouteActive', () => {
    it('marks dashboard as active for /dashboard', () => {
      expect(isRouteActive('/dashboard', '/dashboard')).toBe(true);
    });

    it('marks dashboard as active for /dashboard/widget', () => {
      expect(isRouteActive('/dashboard/widget', '/dashboard')).toBe(true);
    });

    it('marks colaboradores as active for /colaboradores', () => {
      expect(isRouteActive('/colaboradores', '/colaboradores')).toBe(true);
    });

    it('marks colaboradores as active for /colaboradores/123', () => {
      expect(isRouteActive('/colaboradores/123', '/colaboradores')).toBe(true);
    });

    it('does not mark dashboard as active for /colaboradores', () => {
      expect(isRouteActive('/colaboradores', '/dashboard')).toBe(false);
    });
  });
});

describe('Route Access', () => {
  it('master can access /admin', () => {
    expect(canAccessRoute('master', '/admin')).toBe(true);
  });

  it('admin cannot access /admin', () => {
    expect(canAccessRoute('admin', '/admin')).toBe(false);
  });

  it('colaborador cannot access /departamentos', () => {
    expect(canAccessRoute('colaborador', '/departamentos')).toBe(false);
  });

  it('admin can access /departamentos', () => {
    expect(canAccessRoute('admin', '/departamentos')).toBe(true);
  });
});
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-07 | Initial contract definition |
