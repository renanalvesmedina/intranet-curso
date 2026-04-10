# Quickstart: Interface e Navegação

**Feature**: 001-e01-interface-navegacao  
**Date**: 2026-04-07

## Prerequisites

- Node.js 20+
- pnpm instalado (`npm install -g pnpm`)
- Repositório clonado

## Setup Inicial

```bash
# 1. Navegar para apps/web
cd apps/web

# 2. Instalar dependências
pnpm install

# 3. Adicionar dependências de runtime (se não existirem)
pnpm add next-themes

# 4. Adicionar dependências de desenvolvimento para testes
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom

# 5. Adicionar componentes Shadcn necessários
pnpm dlx shadcn@latest add sidebar sheet button separator tooltip
```

## Desenvolvimento

```bash
# Servidor de desenvolvimento
pnpm dev

# Aceder em http://localhost:3000
```

### Role Selector (Dev Only)

Em ambiente de desenvolvimento, um selector de papel aparece no canto inferior direito. Use-o para testar a visibilidade de menu conforme diferentes papéis:

- **Master**: Vê "Administração global", não vê "Departamentos"
- **Admin/RH**: Vê "Departamentos", não vê "Administração global"
- **Gestor/Colaborador**: Não vê "Departamentos" nem "Administração global"

### Theme Toggle

O botão de alternância de tema está no footer da sidebar. Clique para alternar entre modo claro e escuro.

## Testes

```bash
# Executar todos os testes
pnpm test

# Executar em modo watch
pnpm test --watch

# Executar com coverage
pnpm test --coverage
```

### Testes Chave

| Ficheiro | O que testa |
|----------|-------------|
| `__tests__/lib/navigation.test.ts` | Filtragem de menu por papel |
| `__tests__/lib/roles.test.ts` | Definições de papéis |
| `__tests__/components/nav-item.test.tsx` | Renderização de item de menu |
| `__tests__/components/app-shell.test.tsx` | Estrutura do shell |

## Estrutura de Ficheiros

```
apps/web/
├── app/
│   ├── api/             # Route Handlers (BFF endpoints)
│   │   └── health/
│   ├── (app)/           # Route group do shell autenticado
│   │   ├── layout.tsx   # Layout com AppShell (Server Component)
│   │   ├── dashboard/
│   │   ├── colaboradores/
│   │   ├── departamentos/
│   │   ├── eventos/
│   │   ├── notificacoes/
│   │   └── admin/
│   └── layout.tsx       # Root layout
├── components/
│   ├── app-shell/       # Componentes do shell
│   └── theme/           # Componentes de tema
├── contexts/
│   └── role-context.tsx # Contexto de papel (stub)
├── lib/
│   ├── navigation.ts    # Configuração de menu
│   ├── roles.ts         # Definições de papéis
│   ├── supabase/        # Clients Supabase (browser/server)
│   │   ├── client.ts    # Browser client (anon key)
│   │   └── server.ts    # Server client (session-aware)
│   └── services/        # BFF Services Layer
│       └── tenant.service.ts
└── actions/             # Server Actions (E02+)
```

## Arquitetura BFF

O projeto usa Next.js como **Backend for Frontend**:

| Camada | Responsabilidade |
|--------|------------------|
| **Server Components** | Data fetching, SSR, SEO |
| **Client Components** | UI interactions, local state |
| **Server Actions** | Mutações, form handling |
| **Services Layer** | Business logic, autorização |
| **Supabase Clients** | Acesso a dados (server vs browser) |

**Regra principal**: Client Components não escrevem diretamente no Supabase. Todas as mutações passam por Server Actions que validam autorização.

## Validação Manual

### Checklist de Verificação

- [ ] Layout com sidebar visível em todas as páginas `/dashboard`, `/colaboradores`, etc.
- [ ] Menu destaca item ativo corretamente
- [ ] Theme toggle funciona (claro ↔ escuro)
- [ ] Nome do tenant ("Organização") visível na sidebar
- [ ] Foco visível ao navegar por teclado (Tab)
- [ ] Role selector visível apenas em `NODE_ENV=development`
- [ ] Mudar papel altera itens visíveis no menu

### Validação Visual (FR-005)

- [ ] Preset Shadcn aplicado: radix-luma (verificar `components.json`)
- [ ] Base color: zinc (tons neutros em backgrounds, borders)
- [ ] Ícones Phosphor renderizam corretamente em todos os itens de menu
- [ ] Contraste adequado em ambos os temas (claro e escuro)
- [ ] Tokens semânticos funcionam (ex.: `text-muted-foreground`, `bg-accent`)

### Verificação por Papel

1. **Selecionar papel "Colaborador"**
   - ✓ Vê: Dashboard, Colaboradores, Eventos, Notificações
   - ✗ Não vê: Departamentos, Administração global

2. **Selecionar papel "Admin"**
   - ✓ Vê: Dashboard, Colaboradores, Departamentos, Eventos, Notificações
   - ✗ Não vê: Administração global

3. **Selecionar papel "Master"**
   - ✓ Vê: Dashboard, Colaboradores, Eventos, Notificações, Administração global
   - ✗ Não vê: Departamentos

## Troubleshooting

### Sidebar não aparece

1. Verificar que componentes Shadcn foram instalados: `pnpm dlx shadcn@latest add sidebar`
2. Verificar imports em `app/(app)/layout.tsx`

### Testes falham

1. Verificar que jsdom está configurado em `vitest.config.ts`
2. Verificar que `@testing-library/jest-dom` está importado no setup

### Theme não persiste

1. Verificar que `next-themes` está instalado
2. Verificar que `ThemeProvider` envolve a aplicação no root layout

## Próximos Passos

Após E01 completo:
- **E02**: Substituir stub de RBAC por autenticação real (Supabase Auth)
- **E03**: Substituir tenant placeholder por contexto multi-tenant
- **E04+**: Substituir páginas placeholder por módulos de negócio
