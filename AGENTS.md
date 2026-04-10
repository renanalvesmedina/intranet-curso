# Orientação para agentes (repositório)

## Âmbito

Antes de alterar código, identifica onde estás a trabalhar:

- **`apps/web`** — segue [apps/web/AGENTS.md](apps/web/AGENTS.md).
- **`apps/notification-service`** — segue [apps/notification-service/AGENTS.md](apps/notification-service/AGENTS.md).
- **Raiz, `docs/`, ou várias apps** — usa este ficheiro e os documentos abaixo; não dupliques regras que já estão nos AGENTS por app.

## Comandos (pnpm)

Gestor de pacotes: **pnpm**. Usa sempre `pnpm` (não `npm` nem `yarn`).

Da **raiz do repositório**, com `-C` para a pasta da app:

| Acção | `apps/web` | `apps/notification-service` |
|--------|------------|------------------------------|
| Instalar dependências | `pnpm -C apps/web install` | `pnpm -C apps/notification-service install` (quando existir `package.json`) |
| Servidor de desenvolvimento | `pnpm -C apps/web dev` | Ver [apps/notification-service/AGENTS.md](apps/notification-service/AGENTS.md) quando o serviço tiver scripts definidos |
| Build | `pnpm -C apps/web build` | Idem |
| Arranque (produção) | `pnpm -C apps/web start` (executar após `build`) | Idem |
| Lint | `pnpm -C apps/web lint` | Idem |
| Testes | `pnpm -C apps/web test` quando existir script `test` em `package.json` | Idem |

Em alternativa, entra em `apps/<app>` e corre os mesmos scripts sem prefixo (ex.: `pnpm dev`, `pnpm build`). Detalhe por app: [apps/web/AGENTS.md](apps/web/AGENTS.md), [apps/notification-service/AGENTS.md](apps/notification-service/AGENTS.md).

## Mapa de documentos (`docs/`)

Hierarquia alinhada a [docs/GOVERNANCE.md](docs/GOVERNANCE.md):

| Documento | Função |
|-----------|--------|
| [docs/PROPOSAL.md](docs/PROPOSAL.md) | Produto: requisitos, perfis, MVP e fases |
| [docs/PRD.md](docs/PRD.md) | Contexto de produto |
| [docs/GOVERNANCE.md](docs/GOVERNANCE.md) | Governação: papéis, SoD, operação |
| [docs/ENGINEERING.md](docs/ENGINEERING.md) | Stack, monorepo, princípios de implementação, ferramentas de teste |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Planta técnica: contentores, dados, RLS, fronteiras |
| [docs/SECURITY.md](docs/SECURITY.md) | Segurança na aplicação: auth, multi-tenant, API, segredos |
| [docs/QUALITY.md](docs/QUALITY.md) | Qualidade de código, testes, revisão, definição de pronto |
| [docs/DELIVERY.md](docs/DELIVERY.md) | Git, PR para `develop`, CI, deploy |
| [docs/UI_SPEC.md](docs/UI_SPEC.md) | Especificação de UI (implementação em `apps/web`) |

Outros: [docs/BACKLOG.md](docs/BACKLOG.md), etc., conforme necessidade.

## Criação de branches (Git Flow)

**Obrigatório:** ao criar branches, usa a skill [git-flow-branch-creator](.agents/skills/git-flow-branch-creator) e segue o modelo [Git Flow (nvie)](https://nvie.com/posts/a-successful-git-branching-model/).

Fluxo:
1. Executa `git status` e `git diff` para analisar as alterações.
2. Classifica o tipo de branch conforme a natureza das alterações:
   - **feature/** — novas funcionalidades, melhorias não-críticas (branch de `develop`).
   - **release-X.Y.Z** — preparação de release, versão, documentação final (branch de `develop`).
   - **hotfix/** — correções críticas de produção, segurança (branch de `master`).
3. Gera nome semântico em kebab-case: `feature/[ticket-]descricao`, `release-X.Y.Z`, `hotfix/descricao`.
4. Cria a branch a partir da origem correcta (`develop` ou `master`).

Convenções de nome (exemplos):
- `feature/user-authentication`
- `feature/001-e01-interface-navegacao`
- `release-1.0.0`
- `hotfix/auth-security-patch`

Para detalhes completos e edge cases, consulta a skill [git-flow-branch-creator](.agents/skills/git-flow-branch-creator/SKILL.md).

## Regras transversais (resumo)

- **Multi-tenant e RLS:** isolamento por `tenant_id` e políticas no PostgreSQL; ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) e [docs/SECURITY.md](docs/SECURITY.md).
- **Autorização:** validar contexto de tenant e papel **no servidor**; o cliente não é fonte de verdade para `tenant_id` nem permissões ([docs/SECURITY.md](docs/SECURITY.md)).
- **Entrega incremental:** fatias verticais testáveis, contratos estáveis (OpenAPI / tipos) quando houver integrações; ver [docs/ENGINEERING.md](docs/ENGINEERING.md).
- **Git e CI:** branch por implementação seguindo Git Flow (ver secção acima), PR para `develop`, Vitest no PR como referência; ver [docs/DELIVERY.md](docs/DELIVERY.md).
- **Qualidade:** regras de negócio testáveis (Vitest), critérios de revisão e DoD; ver [docs/QUALITY.md](docs/QUALITY.md).

## Notificações in-app (fronteira)

Conforme [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md):

- **Geração:** pg_cron → Supabase Edge Functions → **`apps/notification-service`** → inserção na base.
- **Consulta na app web:** `apps/web` lê dados via Supabase (SELECT com RLS), **sem** integração HTTP direta do browser com o `notification-service` na fase inicial.

## Skills do repositório (`.agents/skills/`)

| Skill | Pasta | Quando usar |
|--------|--------|-------------|
| **git-flow-branch-creator** | [.agents/skills/git-flow-branch-creator](.agents/skills/git-flow-branch-creator) | **Obrigatório** ao criar branches. Analisa alterações e cria branch seguindo Git Flow (feature/release/hotfix). |
| **next-best-practices** | [.agents/skills/next-best-practices](.agents/skills/next-best-practices) | Código em `apps/web` (Next.js). **Secundário** à [documentação oficial Next.js](https://nextjs.org/docs); detalhes em [apps/web/AGENTS.md](apps/web/AGENTS.md). |
| **shadcn** | [.agents/skills/shadcn](.agents/skills/shadcn) | `apps/web`: componentes Shadcn/ui, `components.json`, CLI `pnpm dlx shadcn@latest`, composição de UI. Ver [apps/web/AGENTS.md](apps/web/AGENTS.md). |
| **vercel-react-best-practices** | [.agents/skills/vercel-react-best-practices](.agents/skills/vercel-react-best-practices) | Performance React/Next em `apps/web`. |
| **web-design-guidelines** | [.agents/skills/web-design-guidelines](.agents/skills/web-design-guidelines) | Revisões de UI, a11y, UX em `apps/web`. |
| **fastify-best-practices** | [.agents/skills/fastify-best-practices](.agents/skills/fastify-best-practices) | Código em `apps/notification-service`. |

Para API e comportamento de bibliotecas, preferir documentação oficial atual (ex. regras do projeto com ctx7) quando aplicável.