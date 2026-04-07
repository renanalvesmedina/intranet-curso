# PRD — Complemento ao PROPOSAL

## Propósito e relação documental

Este ficheiro **complementa** o [PROPOSAL.md](./PROPOSAL.md) (baseline de produto v2.2): agrega contexto de execução, requisitos a nível PRD, referências cruzadas aos restantes documentos do repositório e rastreabilidade **sem** substituir a proposta.

| Documento | Papel |
|-----------|--------|
| [PROPOSAL.md](./PROPOSAL.md) | Baseline versionada: visão, perfis, RBAC, MVP vs fases, NFRs de alto nível. **Fonte de verdade** para regras de produto. |
| **PRD.md** (este) | Complemento: objetivos mensuráveis, cenários narrativos, RF agregados, temas de entrega (contexto indireto a futuros épicos), NFRs com referências, restrições técnicas, métricas, riscos, rastreabilidade. |
| [BACKLOG.md](./BACKLOG.md) | Épicos nomeados e priorizados, user stories, critérios de aceitação por história. |

**Não contém (detalhe):** user stories completas (formato “Como… quero… para…”), priorização ao nível sprint, critérios de aceitação por item — ver [BACKLOG.md](./BACKLOG.md). **Contém, de forma superficial:** agrupamentos por **tema de entrega** alinhados aos épicos do backlog.

---

## 1. Contexto e objetivos de negócio

A plataforma é uma **intranet corporativa multi-tenant**: uma aplicação web que serve várias organizações com isolamento de dados e perfis distintos para operação global (Master) e vida interna de cada empresa (Admin, RH, Gestor, Colaborador). O objetivo é centralizar **por tenant** comunicação interna, diretório, estrutura organizacional e eventos, com fronteira clara entre administração da plataforma e administração da organização.

Detalhe de visão, princípios e resultado esperado: [PROPOSAL.md — Resumo executivo e Visão](./PROPOSAL.md).

### Objetivos mensuráveis (KPIs — a acordar)

Os valores abaixo são **placeholders**; a equipa de produto e stakeholders devem fixar metas e prazos.

| KPI | Descrição sugerida | Meta |
|-----|-------------------|------|
| O1 | Tempo ou passos para Admin/RH concluírem provisionamento de acesso (primeiro link gerado até utilizador capaz de iniciar sessão) | TBD |
| O2 | Cobertura de fluxos críticos em testes E2E (CI) alinhados ao produto | TBD |
| O3 | Incidentes de fuga de dados entre tenants (deve ser zero em produção) | 0 |
| O4 | Satisfação ou adoção no diretório/eventos (método a definir) | TBD |

---

## 2. Utilizadores e cenários (alto nível)

### Perfis

Cinco perfis operacionais estão definidos no PROPOSAL: **Master** (plataforma), **Admin**, **RH**, **Gestor**, **Colaborador** (tenant). Resumo: um papel por utilizador no tenant; colaborador com ficha pode existir sem conta; Master vê apenas agregados numéricos por tenant, sem detalhe de RH.

Tabelas completas: [PROPOSAL.md — Perfis de acesso](./PROPOSAL.md) e [PROPOSAL.md — Matriz RBAC](./PROPOSAL.md).

### Cenários narrativos por módulo (sem user story)

| Módulo | Sigla | Cenário resumido |
|--------|-------|------------------|
| Gestão de departamentos | GD | Admin e RH mantêm a estrutura; Gestor e Colaborador consomem no contexto de diretório/estrutura. |
| Gestão de colaboradores | GC | Admin/RH gerem cadastro e decisão de conta; Gestor vê empresa e equipa; Colaborador vê diretório com campos padrão e edita self-service onde permitido. |
| Gestão de eventos | GE | Admin e RH criam/editam; Admin elimina qualquer evento do tenant; RH elimina só eventos que criou; Gestor e Colaborador leem e participam conforme audiência. |

---

## 3. Âmbito funcional do MVP e temas de entrega (contexto indireto)

O MVP está listado no [PROPOSAL.md — Âmbito funcional (MVP vs fases)](./PROPOSAL.md). Abaixo, a mesma informação organizada por **capacidade** e por **tema de entrega** — linhas narrativas que alinham com os épicos em [BACKLOG.md](./BACKLOG.md) ao nível de tema; o PRD **não** duplica prioridade sprint nem AC por história.

### Por capacidade

| Capacidade | Conteúdo essencial (remete ao PROPOSAL) |
|------------|----------------------------------------|
| Identidade, sessão e tenant | Supabase Auth (email/palavra-passe); `auth.users` ↔ `profiles` ↔ `colaboradores`; RLS; tenant resolvido no servidor; URL canónica sem subdomínio de tenant. |
| Provisionamento e links | Primeiro acesso e reset gerados pela app; MVP: link em ecrã, cópia manual; sem magic link como login; sem email nativo Supabase para estes fluxos. |
| Diretório e hierarquia | Campos padrão; um departamento por colaborador; no máximo um gestor; Gestor vê empresa e equipa. |
| Eventos e audiência | Âmbitos empresa, departamento, colaboradores específicos; regras de eliminação Admin vs autor RH. |
| Notificações in-app | Atreladas a eventos; sem email de produto no MVP; geração conforme planta técnica (Cron, Edge, serviço). |
| Painel Master | Apenas contagens agregadas por tenant; sem listagens de detalhe nem impersonação. |
| Perfil | Self-service (ex.: foto, ramal) vs dados cadastrais só Admin/RH. |

### Temas de entrega (indiretos — não são épicos formalizados)

Estes **temas** orientam leitura e planeamento; a decomposição em épicos, prioridades e histórias fica no artefacto posterior.

| Tema | Âmbito (leve) |
|------|----------------|
| T1 — Identidade e isolamento | Auth, vínculo ao tenant, RLS, validação server-side, sem API pública de dados de tenant. |
| T2 — Pessoas e estrutura | Departamentos, colaboradores, diretório, regras de provisionamento Admin vs RH. |
| T3 — Eventos e participação | Audiência, CRUD conforme perfil, eliminação Admin vs RH. |
| T4 — Notificações e superfície de leitura | Pipeline de geração vs leitura na app; alinhamento a [ARCHITECTURE.md](./ARCHITECTURE.md). |
| T5 — Plataforma (Master) | Gestão de tenants e dashboard de agregados apenas. |

---

## 4. Requisitos funcionais (nível PRD)

Identificadores abaixo são **agregados**; não substituem histórias nem AC por item de backlog.

| ID | Requisito | Fonte principal |
|----|-----------|-----------------|
| FR-01 | O sistema deve isolar dados por `tenant_id` com RLS como barreira obrigatória na base. | [PROPOSAL](./PROPOSAL.md), [SECURITY](./SECURITY.md) |
| FR-02 | Após login, contexto de tenant e papel devem resolver-se via cadeia de dados e políticas, com validação no servidor. | [PROPOSAL](./PROPOSAL.md), [SECURITY](./SECURITY.md) |
| FR-03 | Admin e RH geram links de primeiro acesso e reset na aplicação; MVP: entrega por UI (copiar); sem envio Supabase nativo. Na **criação de tenant**, o Master indica o email do responsável; o sistema cria o primeiro **Admin** e gera o link de primeiro acesso (mesma regra de entrega MVP). | [PROPOSAL](./PROPOSAL.md) |
| FR-04 | Matriz de permissões e SoD (Admin vs RH em papéis e eventos) devem ser aplicadas de forma consistente em UI e políticas. | [PROPOSAL](./PROPOSAL.md), [GOVERNANCE](./GOVERNANCE.md) |
| FR-05 | Eventos suportam audiência por empresa, departamento ou colaboradores específicos; listagens e detalhe filtrados por tenant e audiência. | [PROPOSAL](./PROPOSAL.md) |
| FR-06 | Master acede apenas a agregados tipo contagem por tenant; sem detalhe de registos nem impersonação. **Exceção:** na criação de tenant, o email do responsável é obrigatório para o bootstrap do primeiro Admin (sem listagens de RH). | [PROPOSAL](./PROPOSAL.md), [SECURITY](./SECURITY.md) |
| FR-07 | Notificações in-app associadas ao domínio de eventos; leitura na app conforme modelo de dados e RLS. | [PROPOSAL](./PROPOSAL.md), [ARCHITECTURE](./ARCHITECTURE.md) |

---

## 5. Requisitos não funcionais e conformidade

Consolidação com remissões; o detalhe normativo e técnico permanece em [SECURITY.md](./SECURITY.md), [GOVERNANCE.md](./GOVERNANCE.md) e [PROPOSAL.md — Requisitos não funcionais](./PROPOSAL.md).

| Área | Expectativa no PRD |
|------|-------------------|
| Segurança | Menor privilégio; defesa em profundidade (servidor + RLS); sem API HTTP pública genérica para dados de tenant; mitigação XSS/CSRF; HTTPS em produção; segredos fora do repositório. |
| Privacidade / RGPD | Dados pessoais em RH e diretório; bases legais, retenção e direitos do titular em documentação legal e processos, não só em código. |
| Auditoria | Ações sensíveis (cadastros, permissões, provisionamento) auditáveis; âmbito e retenção a acordar na implementação. |
| Disponibilidade e backups | RPO/RTO e backups: acordo com infraestrutura (sem números fixos neste PRD). |

### Verificação e qualidade (resumo)

- **Unitários e integração (Vitest):** regras de negócio alinhadas ao PROPOSAL e governação — ver [ENGINEERING.md](./ENGINEERING.md) e [QUALITY.md](./QUALITY.md).
- **E2E (Playwright, CI):** fluxos críticos; Browser MCP em desenvolvimento não substitui a suíte na CI — ver [ENGINEERING.md](./ENGINEERING.md).
- **RLS:** políticas SQL não são substituídas por testes unitários apenas; integração/base quando necessário — ver [QUALITY.md](./QUALITY.md).

---

## 6. Restrições técnicas e dependências

| Tópico | Descrição | Documento |
|--------|-----------|-----------|
| Frontend | Next.js, React, TypeScript, Tailwind, Shadcn UI em `apps/web`. | [ENGINEERING.md](./ENGINEERING.md) |
| Dados e Auth | Supabase Auth + PostgreSQL + RLS; migrações no projeto Supabase. | [ENGINEERING.md](./ENGINEERING.md), [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Notificações | Geração: pg_cron + Edge Functions → `notification-service` (Fastify) → INSERT na BD; leitura na web via tabela, RLS; fase inicial sem browser a chamar diretamente o serviço. | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| CI | GitHub Actions com testes unitários no PR como referência para aprovação; deploy hml/prod conforme infra. | [DELIVERY.md](./DELIVERY.md) |
| Monorepo | Apps sob `apps/`; pacotes partilhados em `packages/` só quando necessário. | [ENGINEERING.md](./ENGINEERING.md) |

---

## 7. Fora de âmbito (MVP) e fases posteriores

Alinhado a [PROPOSAL.md — Fase 2](./PROPOSAL.md): envio automático por email de links (app, não Supabase) habilitável por env; ficheiros partilhados; integrações externas; relatórios analíticos; white-label; fluxos de aprovação mais complexos para Gestor; **sem** módulo de comunicados no MVP; **sem** AD/SSO; **sem** onboarding wizard na app.

**Gatilhos de revisão deste PRD:** alteração material ao PROPOSAL; mudança de fronteiras técnicas (novos contentores, API pública, mudança de fluxo de notificações); entrada em Fase 2 de um tema acima.

---

## 8. Riscos e decisões em aberto

Expansão da tabela em [PROPOSAL.md — Riscos e decisões em aberto](./PROPOSAL.md).

| Tema | Nota (produto) | Impacto | Opções / próximos passos | Dono sugerido | Critério de fecho |
|------|----------------|---------|---------------------------|---------------|-------------------|
| UX do diretório (Gestor) | Equilíbrio vista empresa completa vs equipa | Médio — afeta adoção e navegação | Exploração UX, protótipos | Produto / UX | Decisão de navegação e atalhos documentada |
| Entrega de convite e reset | MVP: ecrã + cópia; depois email pela app | Médio — operação e suporte | Templates, fila, fornecedor quando env ligado | Produto + Eng | Envio opcional testado em staging |
| White-label | Fora do MVP | Baixo no MVP | Adiar a Fase 2 | Produto | Alinhamento com PROPOSAL Fase 2 |
| Master e dados dos tenants | Só COUNT; sem detalhe nem impersonação | Alto se mal implementado — risco legal/compliance | Views, funções `SECURITY DEFINER` controladas, testes | Eng + Segurança | Revisão de políticas e auditoria |

---

## 9. Rastreabilidade documental

| Área / secção PROPOSAL | Tema de entrega (indireto) | Documentos relacionados |
|------------------------|----------------------------|-------------------------|
| Modelo multi-tenant, RLS | T1 | [ARCHITECTURE](./ARCHITECTURE.md), [SECURITY](./SECURITY.md) |
| Autenticação e provisionamento | T1, T2 | [PROPOSAL](./PROPOSAL.md), [GOVERNANCE](./GOVERNANCE.md), [SECURITY](./SECURITY.md) |
| Perfis, RBAC, SoD | T1–T3 | [PROPOSAL](./PROPOSAL.md), [GOVERNANCE](./GOVERNANCE.md) |
| GD / GC / módulos | T2 | [PROPOSAL](./PROPOSAL.md) |
| GE, audiência, notificações | T3, T4 | [PROPOSAL](./PROPOSAL.md), [ARCHITECTURE](./ARCHITECTURE.md) |
| Master, agregados | T5 | [PROPOSAL](./PROPOSAL.md), [SECURITY](./SECURITY.md) |
| Testes e DoD | — | [ENGINEERING](./ENGINEERING.md), [QUALITY](./QUALITY.md), [DELIVERY](./DELIVERY.md) |

---

## 10. Ligação ao planeamento de entrega

**Épicos**, **user stories** e **critérios de aceitação** ao nível de backlog estão no [BACKLOG.md](./BACKLOG.md). Este PRD mantém o nível **agregado** e os **temas de entrega** descritos na secção 3; o backlog desdobra o trabalho em itens priorizados e testáveis por história, com **regra de dependência entre épicos** e rastreabilidade a **FR-xx** e **T1–T5** onde aplicável.

---

## 11. Governança do PRD

- **Alterações de regra de produto** devem primeiro refletir-se no [PROPOSAL.md](./PROPOSAL.md) e no processo descrito em [GOVERNANCE.md](./GOVERNANCE.md).
- Este documento deve **versionar-se** (versão e data) quando o conteúdo de complemento mudar de forma material.

| Campo | Valor |
|-------|--------|
| **Versão** | 1.2 |
| **Data** | 2026-04-06 |
| **Baseline PROPOSAL referenciada** | 2.2 |

---

**Documento:** PRD complementar ao [PROPOSAL.md](./PROPOSAL.md).