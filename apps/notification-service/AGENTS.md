# `apps/notification-service` — orientação para agentes

## Âmbito

Este ficheiro aplica-se ao código sob **`apps/notification-service`**. Contexto do monorepo: [AGENTS.md](../../AGENTS.md) na raiz.

## Papel do serviço

Conforme [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md):

- Invocado pela orquestração (**pg_cron** no PostgreSQL + **Supabase Edge Functions**), não pelo browser na fase inicial.
- **Persiste** notificações (e metadados associados) **diretamente no PostgreSQL** (inserções nas tabelas de domínio).
- Manter **contrato estável** (ex. OpenAPI, tipos partilhados) com as Edge Functions — ver também [docs/ENGINEERING.md](../../docs/ENGINEERING.md).

## Stack

Fastify, Node.js, TypeScript — [docs/ENGINEERING.md](../../docs/ENGINEERING.md).

## Comandos (pnpm)

Gestor de pacotes: **pnpm**. Quando existir `package.json` nesta app, usar sempre `pnpm` para scripts (não `npm` nem `yarn`).

Padrão esperado após o projeto estar configurado (ajustar nomes dos scripts ao `package.json` real):

| Acção | Comando (a partir de `apps/notification-service`) |
|--------|-----------------------------------------------------|
| Instalar dependências | `pnpm install` |
| Desenvolvimento | `pnpm dev` (ou equivalente definido no manifesto) |
| Build | `pnpm build` |
| Arranque (produção) | `pnpm start` |
| Testes | `pnpm test` (ex.: Vitest + `inject()` do Fastify) |
| Lint | `pnpm lint` (quando existir) |

Da raiz do repositório: `pnpm -C apps/notification-service <script>` (ex.: `pnpm -C apps/notification-service dev`).

## Confiança e multi-tenant

Serviços internos devem alinhar com o modelo de confiança do produto: autenticação/autorização explícitas, dados escopados por tenant; ver [docs/SECURITY.md](../../docs/SECURITY.md) (incl. secção sobre serviços internos). Complementar com políticas e RLS em [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md).

## Testes

Vitest no monorepo; para Fastify, usar `inject()` e padrões descritos na skill abaixo.

## Skill (boas práticas Fastify)

Consultar antes de implementar ou rever rotas, plugins, validação, erros, logging ou integração com base de dados:

[../../.agents/skills/fastify-best-practices/SKILL.md](../../.agents/skills/fastify-best-practices/SKILL.md)

Ordem de leitura sugerida na própria skill (ex.: plugins → routes → schemas → error-handling → logging → configuração).