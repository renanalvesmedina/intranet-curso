<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# `apps/web` — orientação para agentes

## Âmbito

Este ficheiro aplica-se ao código sob **`apps/web`**. Contexto do monorepo: [AGENTS.md](../../AGENTS.md) na raiz.

## Stack

Next.js, React, TypeScript, Tailwind CSS, Shadcn — ver [docs/ENGINEERING.md](../../docs/ENGINEERING.md) e [docs/UI_SPEC.md](../../docs/UI_SPEC.md).

## Comandos (pnpm)

Gestor de pacotes: **pnpm**. A partir de **`apps/web`**:

| Acção | Comando |
|--------|---------|
| Instalar dependências | `pnpm install` |
| Servidor de desenvolvimento (Next.js) | `pnpm dev` |
| Build de produção | `pnpm build` |
| Servidor após build | `pnpm start` |
| Lint (ESLint) | `pnpm lint` |
| Testes | `pnpm test` — quando existir script `test` em [package.json](package.json) (Vitest alinhado a [docs/ENGINEERING.md](../../docs/ENGINEERING.md)) |

Da raiz do repositório: `pnpm -C apps/web <script>` (ex.: `pnpm -C apps/web dev`).

## Shadcn/ui — carregar e criar componentes

O projeto usa Shadcn com [components.json](components.json) (`rsc`, preset de estilo, alias `@/components/ui`). **Não** inventes componentes de UI próprios (botões, diálogos, cartões, etc.) se já existir equivalente no registo — usa a CLI e compõe blocos existentes.

**Runner do CLI (este repositório):** `pnpm dlx shadcn@latest` (equivalente pnpm ao indicado na skill; não usar `npx` aqui).

| Acção | Comando (executar dentro de `apps/web`) |
|--------|----------------------------------------|
| Contexto do projeto (JSON: aliases, componentes instalados, paths) | `pnpm dlx shadcn@latest info` — opcional `--json` |
| Procurar componentes nos registos | `pnpm dlx shadcn@latest search` — ex.: `pnpm dlx shadcn@latest search @shadcn -q "sidebar"` |
| Documentação e URLs de exemplos | `pnpm dlx shadcn@latest docs <componente>` — ex.: `pnpm dlx shadcn@latest docs button dialog` |
| **Adicionar** componentes ao código-fonte | `pnpm dlx shadcn@latest add button card dialog` |
| Pré-visualizar alterações antes de aplicar | `pnpm dlx shadcn@latest add <componente> --dry-run` / `--diff <ficheiro>` |
| Ver item do registo ainda não instalado | `pnpm dlx shadcn@latest view @shadcn/button` |

**Fluxo recomendado (alinhado à skill):**

1. Ver o que já existe: `pnpm dlx shadcn@latest info` ou listar `components/ui` (path em `components.json`, alias `@/components/ui`).
2. Pesquisar antes de criar UI à mão: `pnpm dlx shadcn@latest search …`.
3. Antes de usar ou alterar um componente, obter docs oficiais: `pnpm dlx shadcn@latest docs <nome>`.
4. Instalar com `add`; para atualizações, usar `--dry-run` e `--diff` e **não** sobrescrever sem aprovação explícita.
5. Registos de terceiros: **não assumir** o registo — se o pedido for ambíguo, confirmar qual usar. Dependências extra: `pnpm add …` (não misturar com outros gestores).

Regras de composição, formulários, ícones e estilos: [.agents/skills/shadcn/SKILL.md](../../.agents/skills/shadcn/SKILL.md) e `rules/*.md` na mesma pasta.

## Segurança e dados

- Alinhar com [docs/SECURITY.md](../../docs/SECURITY.md): sessão, RBAC, validação **no servidor**; o cliente não é fonte de verdade para `tenant_id` nem permissões.
- Leituras Supabase devem respeitar **RLS**; políticas detalhadas nas migrações / [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md).

## UI

Seguir [docs/UI_SPEC.md](../../docs/UI_SPEC.md). Componentes base: secção **Shadcn/ui** acima. Para revisões de UI, acessibilidade ou UX, usar a skill **web-design-guidelines** (ver tabela abaixo).

## Notificações in-app

A app **lê** notificações a partir dos dados já persistidos (tabelas via Supabase + RLS). **Não** assumas integração HTTP do frontend com `apps/notification-service` na fase inicial — ver [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md).

## Testes

Vitest para unitários/integração; E2E: Playwright (CI) e Browser MCP em desenvolvimento — [docs/ENGINEERING.md](../../docs/ENGINEERING.md). Quando o script existir, correr com `pnpm test` nesta pasta.

## Prioridade de fontes (Next.js)

Em dúvida ou conflito:

1. **Documentação oficial** da versão instalada: [nextjs.org/docs](https://nextjs.org/docs) e `node_modules/next/dist/docs/` (como no aviso acima).
2. Depois, a skill **next-best-practices** do repositório como complemento (não substitui a doc oficial nem avisos de deprecação).

A skill **next-best-practices** só deve orientar padrões do monorepo **depois** de confirmar API, breaking changes e comportamento na documentação oficial Next.js.

## Tabela de skills (por prioridade)

| Prioridade | Fonte | Caminho / notas |
|------------|--------|-----------------|
| **1 — Next.js (oficial)** | Documentação da versão em uso | [nextjs.org/docs](https://nextjs.org/docs); `node_modules/next/dist/docs/` (bloco no topo deste ficheiro) |
| **2 — Boas práticas Next (skill)** | Convenções no monorepo | [../../.agents/skills/next-best-practices/SKILL.md](../../.agents/skills/next-best-practices/SKILL.md) e ficheiros temáticos (ex. `file-conventions.md`, `data-patterns.md`) |
| **3 — Shadcn/ui (skill)** | Adicionar, pesquisar, compor e atualizar componentes; evitar UI reinventada | [../../.agents/skills/shadcn/SKILL.md](../../.agents/skills/shadcn/SKILL.md); CLI com `pnpm dlx shadcn@latest` (ver secção Shadcn neste ficheiro) |
| **4 — Performance React/Next** | Otimização (após base Next oficial) | [../../.agents/skills/vercel-react-best-practices/SKILL.md](../../.agents/skills/vercel-react-best-practices/SKILL.md); regras em `rules/*.md`; opcional: [../../.agents/skills/vercel-react-best-practices/AGENTS.md](../../.agents/skills/vercel-react-best-practices/AGENTS.md) |
| **5 — UI / a11y** | Revisões de interface | [../../.agents/skills/web-design-guidelines/SKILL.md](../../.agents/skills/web-design-guidelines/SKILL.md) |