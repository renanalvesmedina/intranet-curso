# Qualidade de código e implementação

## Propósito e âmbito

Este documento define **expectativas de qualidade** para o código e a implementação no monorepo: legibilidade, testes, revisão e critérios de conclusão de trabalho. Complementa o [ENGINEERING.md](./ENGINEERING.md) (stack, ferramentas, estrutura de `apps/`) sem repetir a escolha de Vitest, Playwright ou Cursor Browser MCP.

**Complementa** o [PROPOSAL.md](./PROPOSAL.md) (regras de negócio a respeitar nos testes), o [GOVERNANCE.md](./GOVERNANCE.md) (SoD e auditoria em alto nível) e o [SECURITY.md](./SECURITY.md) (políticas de segurança).

**Cobre:** código limpo e legível no contexto deste projeto; o que testar e em que camadas; revisão de código; definição de pronto sugerida.

**Não cobre:** métricas de cobertura numéricas obrigatórias (a equipa pode acordar valores em CI); estilo de commits; política legal ou RGPD — ver PROPOSAL e SECURITY.

---

## Código limpo e legível

**Objetivo:** código que a **próxima pessoa** (ou o próprio autor, meses depois) consegue entender e alterar **com confiança**, alinhado ao domínio do produto.

| Princípio | O que esperamos |
|-----------|------------------|
| **Linguagem ubíqua** | Nomes de módulos, funções, tipos e variáveis refletem o domínio ([PROPOSAL.md](./PROPOSAL.md)): tenant, colaborador, evento, audiência, departamento, perfis (Admin, RH, …). Evitar abreviaturas opacas fora de convenções explícitas. |
| **Responsabilidade única** | Funções e componentes com um propósito claro; quando um bloco cresce ou mistura UI, I/O e regras, extrair (ex.: regras puras testáveis à parte). |
| **Sem duplicação injustificada** | Duas cópias da mesma regra de negócio devem convergir para uma função ou módulo partilhado; duplicação só quando o custo de abstração for maior que o benefício (documentar o “porquê”). |
| **Complexidade controlada** | Preferir fluxos lineares e condicionais legíveis; evitar aninhamento profundo; extrair decisões nomeadas (`canDeleteEvent`, `isAudienceVisible`, etc.). |
| **Comentários** | Comentar o **porquê** ou invariantes não óbvios, não o óbvio. Regras críticas podem referenciar o teste que as cobre ou o PROPOSAL. |
| **TypeScript** | Tipos nas fronteiras (APIs públicas de módulos, DTOs, respostas); evitar `any` sem justificação comentada; `unknown` + narrowing quando o tipo for realmente dinâmico. |

O [ENGINEERING.md](./ENGINEERING.md) descreve **inversão de dependências** e regras em **módulos puros** — isso suporta código testável e mais simples de ler.

---

## Testes e evidência de comportamento

As **ferramentas** (Vitest, Playwright, Browser MCP) estão no [ENGINEERING.md](./ENGINEERING.md). Aqui ficam os **critérios**:

### Testes unitários (Vitest)

- **Obrigatórios** para **regras de negócio** derivadas do PROPOSAL e da governação: permissões por recurso/ação, audiência de eventos, invariantes de `tenant_id`, eliminação de eventos (Admin vs autor RH), campos self-service vs Admin/RH, limites do Master, etc.
- Preferir **arrange–act–assert** e nomes de teste que descrevam o cenário (ex.: “RH não pode apagar evento criado por outro utilizador”).
- **Unitários não substituem** validação de **RLS** e políticas SQL — integração ou testes de base complementam quando necessário.

### Testes de integração

- Onde o risco for **persistência + políticas** (Supabase/PostgreSQL), validar com projeto de teste ou ambiente local conforme a equipa definir.

### Testes E2E (Playwright na CI)

- Cobrir **fluxos críticos** do produto (login, isolamento de tenant, jornadas de eventos/diretório conforme prioridade). O Browser MCP em desenvolvimento **não** substitui a suíte na CI.

### Critério para alterações de comportamento

- Mudança na regra de negócio → **teste novo ou atualizado** que falharia antes da correção (regressão futura visível).

---

## Revisão de código

O trabalho a integrar deve seguir o fluxo descrito no [DELIVERY.md](./DELIVERY.md) (**branch dedicada**, **PR para `develop`**). Quem revê verifica, entre outros:

- **Legibilidade** e aderência a esta página; nomes e estrutura coerentes com o domínio.
- **Segurança e dados:** alinhamento com [SECURITY.md](./SECURITY.md) (validação no servidor, sem confiar no cliente para tenant/permissões, segredos fora do diff).
- **Testes:** existência e qualidade dos testes para a lógica nova ou alterada.
- **Âmbito do PR:** alterações focadas; evitar refactors grandes não pedidos no mesmo PR.

---

## Definição de pronto (sugerida)

Uma entrega pode considerar-se **pronta para merge** quando:

1. O código cumpre o espírito deste **QUALITY.md** e do **ENGINEERING.md**, e o **PR** para **`develop`** segue o [DELIVERY.md](./DELIVERY.md).
2. **Testes** relevantes passam (unitários mínimos para regras de negócio tocadas).
3. O **workflow GitHub Actions** de **testes unitários** no PR (quando executado) deve estar **verde** ou as falhas **justificadas** antes do merge — serve de **referência** conjuntamente com a revisão; **Lint** e outras verificações acordadas na CI (quando existirem) passam.
4. Não há **segredos** nem dados sensíveis introduzidos no repositório.
5. Comportamento sensível ao produto está **alinhado** ao PROPOSAL (e documentação atualizada se a mudança for de requisito).

---

## Hierarquia e revisão

| Documento | Relação |
|-----------|---------|
| [ENGINEERING.md](./ENGINEERING.md) | Stack, monorepo, ferramentas de teste. |
| [DELIVERY.md](./DELIVERY.md) | Branches, PR para `develop`, CI/deploy. |
| **QUALITY.md** (este) | Padrões de código, testes “o quê”, revisão, definição de pronto. |
| [SECURITY.md](./SECURITY.md) | Segurança e dados. |
| [PROPOSAL.md](./PROPOSAL.md) | Regras de negócio a cobrir por testes. |

| Campo | Valor |
|--------|--------|
| **Versão** | 1.2 |
| **Data** | 2026-04-02 |
| **Alterações em 1.2** | DoD: workflow GitHub Actions de testes unitários no PR como referência de aprovação (ver [DELIVERY.md](./DELIVERY.md)). |
| **Alterações em 1.1** | Ligação ao [DELIVERY.md](./DELIVERY.md) em revisão, DoD e hierarquia. |

Alterações a **QUALITY.md** devem ser revistas pela **equipa técnica**.

---

**Documento:** qualidade de código e implementação (complementar ao [ENGINEERING.md](./ENGINEERING.md) e ao [DELIVERY.md](./DELIVERY.md)).