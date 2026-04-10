# Contract: Next.js BFF Architecture

**Feature**: 001-e01-interface-navegacao  
**Version**: 1.0.0  
**Date**: 2026-04-07

## Overview

Este contrato define a arquitetura BFF (Backend for Frontend) usando Next.js como camada intermediária entre o cliente (browser) e o Supabase (data layer).

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Browser (Client)                               │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    React Client Components                          │ │
│  │  - UI interactions, local state, event handlers                     │ │
│  │  - Calls Server Actions for mutations                               │ │
│  │  - NO direct Supabase access for writes                             │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Next.js BFF Server                                │
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────────┐ │
│  │ Server Components│  │  Server Actions  │  │    Route Handlers      │ │
│  │                  │  │                  │  │      (app/api/)        │ │
│  │ - Data fetching  │  │ - Mutations      │  │                        │ │
│  │ - RSC streaming  │  │ - Form handling  │  │ - Webhooks             │ │
│  │ - SEO/metadata   │  │ - Revalidation   │  │ - External integrations│ │
│  └────────┬─────────┘  └────────┬─────────┘  └───────────┬────────────┘ │
│           │                     │                        │              │
│           └─────────────────────┼────────────────────────┘              │
│                                 ▼                                        │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                      Services Layer                                 │ │
│  │                    (lib/services/*.ts)                              │ │
│  │                                                                      │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │ │
│  │  │ AuthService │  │TenantService│  │ UserService │  │EventService│  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘  │ │
│  │                                                                      │ │
│  │  - Business logic                                                    │ │
│  │  - Validation                                                        │ │
│  │  - Authorization checks                                              │ │
│  │  - Testable with mocks                                               │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                 │                                        │
│                                 ▼                                        │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    Supabase Clients                                 │ │
│  │                   (lib/supabase/*.ts)                               │ │
│  │                                                                      │ │
│  │  ┌─────────────────────┐        ┌─────────────────────┐            │ │
│  │  │   Server Client     │        │   Browser Client    │            │ │
│  │  │ (service role key)  │        │ (anon key - limited)│            │ │
│  │  │                     │        │                     │            │ │
│  │  │ - Full DB access    │        │ - RLS enforced      │            │ │
│  │  │ - Bypass RLS        │        │ - Read-only (E01)   │            │ │
│  │  │ - Server-side only  │        │ - Realtime subs     │            │ │
│  │  └─────────────────────┘        └─────────────────────┘            │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           Supabase                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │   PostgreSQL    │  │   Supabase Auth │  │     Edge Functions      │  │
│  │   + RLS         │  │                 │  │   (notifications)       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Core Principles

### 1. Server-First Data Access

| Rule | Description |
|------|-------------|
| **Server Components default** | Pages são Server Components; data fetching no servidor |
| **No client writes** | Client Components não escrevem diretamente no Supabase |
| **Server Actions for mutations** | Todas as mutações via Server Actions |
| **Service role on server** | Supabase service role key apenas no servidor |

### 2. Client Limitations

| Allowed | Not Allowed |
|---------|-------------|
| Read via Supabase client (RLS enforced) | Direct INSERT/UPDATE/DELETE |
| Realtime subscriptions | Service role key access |
| Call Server Actions | Bypass RLS |
| UI state management | Business logic |

### 3. Authorization Flow

```
1. Request arrives at Server Component/Action
2. Get session from cookies (Supabase Auth)
3. Extract user role and tenant_id
4. Service validates authorization
5. If authorized: execute operation
6. If not: return 403 or redirect
```

---

## File Structure

```text
apps/web/lib/
├── supabase/
│   ├── client.ts       # Browser client (anon key)
│   ├── server.ts       # Server client (service role)
│   └── middleware.ts   # Auth helpers for middleware
│
├── services/           # Business logic layer
│   ├── auth.service.ts
│   ├── tenant.service.ts
│   ├── user.service.ts
│   └── [module].service.ts
│
└── actions/            # Server Actions (when needed)
    └── [module].actions.ts
```

---

## Supabase Clients

### Browser Client (`lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Usage**: 
- Realtime subscriptions
- Client-side reads (RLS enforced)
- Auth state listeners

### Server Client (`lib/supabase/server.ts`)

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

// Admin client for service operations (use sparingly)
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Server-only!
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
}
```

**Usage**:
- Server Components data fetching
- Server Actions mutations
- Route Handlers

---

## Services Layer Pattern

### Base Service Structure

```typescript
// lib/services/base.service.ts

import { createClient, createAdminClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseService {
  protected client: SupabaseClient;
  
  constructor(client?: SupabaseClient) {
    // Allow dependency injection for testing
    this.client = client!;
  }
  
  static async create(): Promise<BaseService> {
    throw new Error('Implement in subclass');
  }
}
```

### Example Service

```typescript
// lib/services/tenant.service.ts

import { createClient } from '@/lib/supabase/server';
import type { TenantInfo } from '@/lib/tenant';

export class TenantService {
  private constructor(private client: Awaited<ReturnType<typeof createClient>>) {}
  
  static async create() {
    const client = await createClient();
    return new TenantService(client);
  }
  
  async getCurrentTenant(): Promise<TenantInfo | null> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return null;
    
    const { data: profile } = await this.client
      .from('profiles')
      .select('tenant_id, tenants(id, name)')
      .eq('user_id', user.id)
      .single();
    
    if (!profile?.tenants) return null;
    
    return {
      id: profile.tenants.id,
      name: profile.tenants.name,
    };
  }
}
```

---

## Server Components Pattern

### Data Fetching

```typescript
// app/(app)/dashboard/page.tsx

import { TenantService } from '@/lib/services/tenant.service';

export default async function DashboardPage() {
  const tenantService = await TenantService.create();
  const tenant = await tenantService.getCurrentTenant();
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Organização: {tenant?.name ?? 'Não definida'}</p>
    </div>
  );
}
```

### With Loading State

```typescript
// app/(app)/dashboard/page.tsx
import { Suspense } from 'react';
import { DashboardContent } from './dashboard-content';
import { DashboardSkeleton } from './dashboard-skeleton';

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

// dashboard-content.tsx (Server Component)
async function DashboardContent() {
  const tenantService = await TenantService.create();
  const tenant = await tenantService.getCurrentTenant();
  // ...
}
```

---

## Server Actions Pattern

### Definition

```typescript
// actions/user.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { UserService } from '@/lib/services/user.service';

export async function updateProfile(formData: FormData) {
  const userService = await UserService.create();
  
  // Validate authorization
  const user = await userService.getCurrentUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }
  
  // Validate input
  const name = formData.get('name') as string;
  if (!name || name.length < 2) {
    return { error: 'Nome inválido' };
  }
  
  // Execute mutation
  const result = await userService.updateProfile(user.id, { name });
  
  if (result.error) {
    return { error: result.error.message };
  }
  
  // Revalidate cache
  revalidatePath('/profile');
  
  return { success: true };
}
```

### Usage in Client Component

```typescript
// components/profile-form.tsx
'use client';

import { updateProfile } from '@/actions/user.actions';
import { useActionState } from 'react';

export function ProfileForm() {
  const [state, formAction, pending] = useActionState(updateProfile, null);
  
  return (
    <form action={formAction}>
      <input name="name" required />
      <button type="submit" disabled={pending}>
        {pending ? 'A guardar...' : 'Guardar'}
      </button>
      {state?.error && <p className="text-destructive">{state.error}</p>}
    </form>
  );
}
```

---

## Route Handlers Pattern

### When to Use

| Use Route Handlers | Use Server Actions |
|-------------------|-------------------|
| Webhooks from external services | Form submissions |
| API for mobile apps (future) | Data mutations from UI |
| Health checks | Revalidation triggers |
| File uploads with progress | Simple CRUD operations |

### Example

```typescript
// app/api/health/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
```

---

## Environment Variables

### Required

```env
# .env.local

# Public (exposed to browser)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Server-only (NEVER expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Validation

```typescript
// lib/env.ts

export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];
  
  const serverRequired = [
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  
  // Check public vars
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }
  
  // Check server vars (only on server)
  if (typeof window === 'undefined') {
    for (const key of serverRequired) {
      if (!process.env[key]) {
        throw new Error(`Missing required server env var: ${key}`);
      }
    }
  }
}
```

---

## Testing Strategy

### Services (Unit Tests)

```typescript
// __tests__/services/tenant.service.test.ts

import { TenantService } from '@/lib/services/tenant.service';

// Mock Supabase client
const mockClient = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
  })),
};

describe('TenantService', () => {
  it('returns null when no user', async () => {
    mockClient.auth.getUser.mockResolvedValue({ data: { user: null } });
    
    const service = new TenantService(mockClient as any);
    const result = await service.getCurrentTenant();
    
    expect(result).toBeNull();
  });
});
```

### Server Actions (Integration Tests)

```typescript
// __tests__/actions/user.actions.test.ts

import { updateProfile } from '@/actions/user.actions';

describe('updateProfile', () => {
  it('returns error for invalid name', async () => {
    const formData = new FormData();
    formData.set('name', 'a'); // Too short
    
    const result = await updateProfile(formData);
    
    expect(result.error).toBe('Nome inválido');
  });
});
```

---

## E01 Scope (BFF)

Para E01, a arquitetura BFF está preparada mas com implementação mínima:

| Component | E01 Status | Notes |
|-----------|------------|-------|
| Server Components | ✓ Setup | Pages são Server Components |
| Browser Client | ✓ Setup | Preparado mas não usado |
| Server Client | ✓ Setup | Preparado mas não usado |
| Services Layer | Stub | TenantService com placeholder |
| Server Actions | N/A | Nenhuma mutação em E01 |
| Route Handlers | Optional | Health check apenas |

A implementação completa da camada de serviços acontece em E02 (Auth) e E03 (Multi-tenant).

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-07 | Initial BFF architecture contract |
