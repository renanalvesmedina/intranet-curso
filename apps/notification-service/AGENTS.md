# Serviço de Notificações — apps/notification-service

## Comandos (pnpm)

```bash
# Desenvolvimento
pnpm dev              # Iniciar servidor de desenvolvimento com watch
pnpm start            # Iniciar servidor

# Build
pnpm build            # Compilar TypeScript

# Qualidade
pnpm lint             # Executar ESLint
pnpm test             # Executar testes unitários (Vitest)
pnpm test:watch       # Executar testes em modo watch

# Tipos
pnpm typecheck        # Verificar tipos TypeScript
```

> **Nota:** Este serviço ainda não foi inicializado. Criar `package.json` com os scripts acima ao iniciar o desenvolvimento.

---

## Propósito

Serviço HTTP dedicado a **persistir notificações in-app** na base de dados. Recebe pedidos da orquestração (pg_cron + Edge Functions) e insere registos no PostgreSQL. **Não é chamado diretamente pelo browser** na fase inicial.

---

## Stack

- **Framework:** Fastify (Node.js, TypeScript)
- **Base de dados:** PostgreSQL (Supabase) com RLS
- **Testes:** Vitest

---

## Skill Obrigatória

| Skill | Quando usar |
|-------|-------------|
| `.agents/skills/fastify-best-practices/` | Plugins, routes, schemas, hooks, error handling, testing, deployment |

Consultar a skill antes de implementar rotas, validações ou plugins.

---

## Pipeline de Notificações

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────────┐     ┌────────────┐
│  pg_cron    │ ──► │ Edge Functions  │ ──► │ notification-service │ ──► │ PostgreSQL │
│  (Postgres) │     │   (Supabase)    │     │      (Fastify)       │     │   (RLS)    │
└─────────────┘     └─────────────────┘     └──────────────────────┘     └────────────┘
                                                                               ▲
                                                                               │
                                                                         ┌─────┴─────┐
                                                                         │ apps/web  │
                                                                         │ (SELECT)  │
                                                                         └───────────┘
```

**Responsabilidades:**
- **Este serviço:** Recebe payload das Edge Functions → INSERT na BD
- **apps/web:** Apenas SELECT com RLS (sem chamada HTTP a este serviço)

---

## Contrato com Edge Functions

### Requisitos

- **Contrato estável** — HTTP ou evento, documentado e testável
- **OpenAPI ou tipos partilhados** — para desenvolvimento independente do frontend
- **Versionamento** — alterações de contrato devem ser comunicadas

### Exemplo de Payload

```typescript
interface CreateNotificationPayload {
  tenant_id: string
  event_id: string
  recipient_ids: string[]
  type: 'event_created' | 'event_updated' | 'event_reminder'
  metadata?: Record<string, unknown>
}
```

---

## Isolamento Multi-tenant

### Regras Obrigatórias

1. **Sempre incluir `tenant_id`** em todas as inserções
2. **Autenticação explícita** — validar origem do pedido (Edge Functions)
3. **Nunca confiar** em dados do payload sem validação
4. **RLS ativo** — mesmo com inserção direta, respeitar políticas

### Validação de Entrada

```typescript
const createNotificationSchema = {
  body: {
    type: 'object',
    required: ['tenant_id', 'event_id', 'recipient_ids', 'type'],
    properties: {
      tenant_id: { type: 'string', format: 'uuid' },
      event_id: { type: 'string', format: 'uuid' },
      recipient_ids: { type: 'array', items: { type: 'string', format: 'uuid' } },
      type: { type: 'string', enum: ['event_created', 'event_updated', 'event_reminder'] }
    }
  }
}
```

---

## Regras de Domínio

### Notificações e Eventos

- Notificações estão **associadas ao domínio de eventos** (GE)
- **Audiência** respeita âmbitos: empresa, departamento, colaboradores específicos
- Criar notificação apenas para **destinatários válidos** dentro da audiência do evento

### Estados

- `unread` — notificação criada, não visualizada
- `read` — utilizador marcou como lida
- Retenção e limpeza a definir na implementação

---

## Testes

| Tipo | Ferramenta | Obrigatório para |
|------|------------|------------------|
| Unitários | Vitest | Regras de negócio, validações de payload |
| Integração | Vitest + Fastify inject | Rotas e contratos HTTP |
| Contrato | Tipos partilhados | Compatibilidade com Edge Functions |

### Princípio

- Testável **sem depender do frontend**
- Contrato testável com mocks das Edge Functions

---

## Estrutura Sugerida

```
apps/notification-service/
├── src/
│   ├── app.ts              # Configuração Fastify
│   ├── routes/
│   │   └── notifications.ts
│   ├── plugins/
│   │   ├── database.ts     # Conexão PostgreSQL
│   │   └── auth.ts         # Validação de origem
│   ├── schemas/
│   │   └── notification.ts
│   └── services/
│       └── notification.service.ts
├── test/
│   ├── routes/
│   └── services/
├── package.json
└── tsconfig.json
```

---

## Referências

- [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) — Planta técnica e pipeline
- [docs/ENGINEERING.md](../../docs/ENGINEERING.md) — Stack e convenções
- [docs/SECURITY.md](../../docs/SECURITY.md) — Políticas de segurança
- [docs/PROPOSAL.md](../../docs/PROPOSAL.md) — Regras de negócio (audiência, eventos)
