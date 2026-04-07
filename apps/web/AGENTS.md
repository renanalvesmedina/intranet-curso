# Frontend Next.js — apps/web

## Comandos (pnpm)

```bash
# Desenvolvimento
pnpm dev              # Iniciar servidor de desenvolvimento (http://localhost:3000)

# Build e Produção
pnpm build            # Compilar para produção
pnpm start            # Iniciar servidor de produção

# Qualidade
pnpm lint             # Executar ESLint
pnpm test             # Executar testes unitários (Vitest) - a configurar
pnpm test:e2e         # Executar testes E2E (Playwright) - a configurar
```

### Shadcn UI (pnpm dlx)

```bash
# Informações do projeto
pnpm dlx shadcn@latest info                        # Ver configuração e componentes instalados

# Adicionar componentes
pnpm dlx shadcn@latest add button                  # Adicionar componente específico
pnpm dlx shadcn@latest add button card dialog      # Adicionar múltiplos componentes
pnpm dlx shadcn@latest add @magicui/shimmer-button # Adicionar de registry externo
pnpm dlx shadcn@latest add --all                   # Adicionar todos os componentes

# Preview antes de adicionar (RECOMENDADO)
pnpm dlx shadcn@latest add button --dry-run        # Ver o que será alterado
pnpm dlx shadcn@latest add button --diff           # Ver diferenças dos ficheiros
pnpm dlx shadcn@latest add button --view           # Ver conteúdo dos ficheiros

# Pesquisar componentes
pnpm dlx shadcn@latest search @shadcn -q "sidebar" # Pesquisar em registries
pnpm dlx shadcn@latest docs button dialog          # Obter URLs de documentação

# Inicializar/Reconfigurar
pnpm dlx shadcn@latest init --preset <code>        # Inicializar com preset
```

> **Regra:** Sempre usar `--dry-run` ou `--diff` antes de sobrescrever componentes existentes.

---

## Aviso Crítico Next.js

Este projeto usa uma versão do Next.js com **breaking changes**. APIs, convenções e estrutura de ficheiros podem diferir dos dados de treino da IA.

**ANTES de escrever qualquer código Next.js:**
1. Consultar `node_modules/next/dist/docs/` para a documentação atual
2. Respeitar avisos de deprecação
3. Validar convenções de ficheiros e APIs assíncronas

---

## Stack

- **Framework:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS v4 (`@theme inline`)
- **Componentes:** Shadcn UI (preset `radix-luma`, baseColor `zinc`)
- **Ícones:** Phosphor Icons (`@phosphor-icons/react`)
- **Fontes:** Inter (corpo), Roboto (headings), Geist/Geist Mono

---

## Skills Obrigatórias (por ordem de prioridade)

| Prioridade | Fonte | Quando usar |
|------------|-------|-------------|
| 1 | `node_modules/next/dist/docs/` | **SEMPRE** consultar primeiro para APIs e convenções Next.js |
| 2 | `.agents/skills/next-best-practices/` | RSC boundaries, async patterns, metadata, error handling, route handlers |
| 3 | `.agents/skills/vercel-react-best-practices/` | Performance React/Next.js, eliminar waterfalls, bundle size, re-renders |
| 4 | `.agents/skills/shadcn/` | Componentes UI, forms, styling, icons, CLI |
| 5 | `.agents/skills/web-design-guidelines/` | Revisão UI/UX, acessibilidade |

---

## Tokens e Styling

- **Fonte de verdade:** `app/globals.css` (tokens CSS para `:root` e `.dark`)
- **Usar tokens semânticos:** `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`
- **Nunca usar:** cores Tailwind cruas (`zinc-*`, `slate-*`) em código novo
- **Utilitário:** `cn()` de `@/lib/utils` para classes condicionais

```tsx
// Correto
<div className="bg-background text-foreground">
<span className="text-muted-foreground">

// Evitar
<div className="bg-zinc-900 text-zinc-100">
```

---

## Contexto de Tenant

### Regras Obrigatórias

- **Resolver no servidor** — nunca confiar em parâmetros do cliente para `tenant_id`
- **URL canónica** — sem subdomínio de tenant como identificador
- **Nome visível** — tenant sempre identificável (sidebar, header ou título)

### Fluxo de Resolução

```
Login → auth.users → profiles (tenant_id + papel) → dados filtrados por RLS
```

---

## RBAC e Permissões

### Menu por Papel

| Item | Master | Admin | RH | Gestor | Colaborador |
|------|--------|-------|-----|--------|-------------|
| Dashboard | - | ✓ | ✓ | ✓ | ✓ |
| Colaboradores | - | ✓ | ✓ | ✓ | ✓ |
| Departamentos | - | ✓ | ✓ | ✓ | ✓ |
| Eventos | - | ✓ | ✓ | ✓ | ✓ |
| Notificações | - | ✓ | ✓ | ✓ | ✓ |
| Administração global | ✓ | - | - | - | - |

**Regra:** Não mostrar itens de menu para módulos sem permissão.

Consultar matriz completa em [docs/PROPOSAL.md](../../docs/PROPOSAL.md).

---

## Padrões de UI (UI_SPEC)

### Superfícies

| Tipo de Interação | Superfície |
|-------------------|------------|
| **Visualização** (consulta, detalhe) | Modal (`Dialog`) ou painel lateral (`Sheet`) |
| **Cadastro/Edição** (fluxos principais) | Ecrã dedicado (página completa) |

### Navegação

- **Máximo 1 nível** de agrupamento sob cada secção principal
- Se necessário mais níveis, segregar em secções distintas

### Complexidade Visual

- **Evitar:** gradientes decorativos, sombras excessivas, animações em loop
- **Usar:** tokens semânticos para comunicar função (não decoração)
- Animações apenas para feedback de estado

Consultar [docs/UI_SPEC.md](../../docs/UI_SPEC.md) para detalhes.

---

## Notificações

- **Apenas leitura** da tabela de notificações via Supabase client
- **Sem chamada direta** ao `notification-service` pelo browser
- Pipeline: `pg_cron → Edge Functions → notification-service → BD ← apps/web (SELECT)`

---

## Testes

| Tipo | Ferramenta | Obrigatório para |
|------|------------|------------------|
| Unitários | Vitest | Regras de negócio, permissões, validações |
| E2E (CI) | Playwright | Fluxos críticos (login, isolamento tenant) |
| E2E (dev) | Cursor Browser MCP | Exploração e validação rápida |

---

## Referências

- [docs/UI_SPEC.md](../../docs/UI_SPEC.md) — Padrões de interface
- [docs/PROPOSAL.md](../../docs/PROPOSAL.md) — Regras de produto e RBAC
- [docs/SECURITY.md](../../docs/SECURITY.md) — Políticas de segurança
- [docs/QUALITY.md](../../docs/QUALITY.md) — Código limpo e testes
- [docs/ENGINEERING.md](../../docs/ENGINEERING.md) — Stack e convenções
