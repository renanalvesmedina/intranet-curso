# Intranet Corporativa Multi-tenant

Este repositório contém uma **intranet corporativa multi-tenant** que serve várias organizações com isolamento de dados. Antes de implementar qualquer funcionalidade, compreenda o contexto abaixo.

---

## Gerenciador de Pacotes

Este projeto usa **pnpm**. Todos os comandos devem ser executados com pnpm.

```bash
# Instalar dependências (na raiz ou em cada app)
pnpm install

# Executar comando em app específica
pnpm --filter web <comando>
pnpm --filter notification-service <comando>
```

---

## Estrutura do Monorepo

```
apps/
├── web/                    # Frontend Next.js (ver apps/web/AGENTS.md)
└── notification-service/   # Serviço Fastify de notificações (ver apps/notification-service/AGENTS.md)
packages/                   # Pacotes partilhados (criar apenas quando necessário)
docs/                       # Documentação de produto e engenharia
.agents/skills/             # Skills de agente para guiar desenvolvimento
```

---

## Princípios Críticos (nunca violar)

### 1. Isolamento Multi-tenant com RLS

- **Todas** as tabelas de negócio têm coluna `tenant_id`
- **Row Level Security (RLS)** é a barreira obrigatória de isolamento — não apenas filtros na aplicação
- O **cliente (browser) nunca é fonte de verdade** para `tenant_id` nem permissões

### 2. Validação Server-side

- Contexto de tenant e papel resolvem-se **no servidor** após autenticação
- URL canónica **sem** subdomínio de tenant como identificador principal
- Toda leitura/escrita de dados sensíveis passa por validação server-side

### 3. Sem API HTTP Pública

- **Não existe** API HTTP pública genérica para exposição de dados de tenant
- Acesso através da aplicação autenticada e políticas alinhadas com RLS

---

## Modelo de Dados (encadeamento)

```
auth.users (Supabase Auth) ↔ profiles (tenant + papel) ↔ colaboradores (ficha)
```

- Um colaborador pode existir **sem** conta de login (ficha vs utilizador)
- Um utilizador tem **um único papel** no tenant

---

## Perfis e RBAC

| Perfil | Plano | Âmbito |
|--------|-------|--------|
| **Master** | Plataforma | Gestão de tenants, apenas agregados numéricos (COUNT), sem dados pessoais |
| **Admin** | Tenant | Configuração total, único que elimina eventos, cria qualquer papel |
| **RH** | Tenant | Cadastro de pessoas, cria papéis exceto Admin, elimina apenas eventos próprios |
| **Gestor** | Tenant | Diretório empresa + equipa, eventos só leitura |
| **Colaborador** | Tenant | Diretório campos padrão, perfil self-service, eventos conforme audiência |

Consultar matriz completa em [docs/PROPOSAL.md](docs/PROPOSAL.md).

---

## Hierarquia Documental

| Documento | Propósito |
|-----------|-----------|
| [PROPOSAL.md](docs/PROPOSAL.md) | Regras de produto, RBAC, MVP vs fases |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Planta técnica, contentores, RLS, fronteiras |
| [SECURITY.md](docs/SECURITY.md) | Políticas de segurança na aplicação |
| [ENGINEERING.md](docs/ENGINEERING.md) | Stack, convenções, testes |
| [UI_SPEC.md](docs/UI_SPEC.md) | Padrões de interface, navegação, tokens |
| [QUALITY.md](docs/QUALITY.md) | Código limpo, revisão, definição de pronto |
| [DELIVERY.md](docs/DELIVERY.md) | Git flow, PR, CI/deploy |
| [BACKLOG.md](docs/BACKLOG.md) | Épicos, user stories, critérios de aceite |

---

## Skills de Agente

Skills disponíveis em `.agents/skills/` para guiar desenvolvimento:

### Para apps/web (por ordem de prioridade)

| Prioridade | Fonte | Quando usar |
|------------|-------|-------------|
| 1 | `node_modules/next/dist/docs/` | **SEMPRE** consultar primeiro para APIs e convenções Next.js |
| 2 | `next-best-practices/` | RSC, async patterns, metadata, error handling |
| 3 | `vercel-react-best-practices/` | Performance, waterfalls, bundle, re-renders |
| 4 | `shadcn/` | Componentes UI, forms, styling, icons |
| 5 | `web-design-guidelines/` | Revisão UI/UX, acessibilidade |

### Para apps/notification-service

| Skill | Quando usar |
|-------|-------------|
| `fastify-best-practices/` | Plugins, routes, schemas, hooks, testing, deployment |

---

## Linguagem Ubíqua

Usar consistentemente nos nomes de módulos, funções e tipos:

- **tenant** — organização/empresa
- **colaborador** — pessoa com ficha no tenant
- **evento** — acontecimento interno (GE)
- **audiência** — âmbito de visibilidade (empresa, departamento, colaboradores específicos)
- **departamento** — unidade organizacional (GD)
- **perfil/papel** — Master, Admin, RH, Gestor, Colaborador

---

## AGENTS.md por Aplicação

Consultar instruções específicas:

- [`apps/web/AGENTS.md`](apps/web/AGENTS.md) — Frontend Next.js
- [`apps/notification-service/AGENTS.md`](apps/notification-service/AGENTS.md) — Serviço de notificações
