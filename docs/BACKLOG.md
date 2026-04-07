# Backlog de produto — épicos, user stories e critérios de aceite

## Propósito e relação documental

Este ficheiro é o **artefacto de planeamento de entrega** da intranet corporativa multi-tenant: **épicos** ordenados, **user stories** por **perfil** e **critérios de aceite (AC)** testáveis por história.

| Documento | Papel |
|-----------|--------|
| [PROPOSAL.md](./PROPOSAL.md) | Baseline de produto: visão, perfis, RBAC, MVP vs fases. **Fonte de verdade** para regras de negócio. |
| [PRD.md](./PRD.md) | Complemento agregado: RF (FR-xx), temas de entrega (T1–T5), NFRs e rastreabilidade de alto nível. |
| **BACKLOG.md** (este) | Desdobra o trabalho em épicos priorizados, histórias no formato “Como… quero… para…” e AC por item. |

**Não substitui** [SECURITY.md](./SECURITY.md), [GOVERNANCE.md](./GOVERNANCE.md), [ARCHITECTURE.md](./ARCHITECTURE.md) nem [ENGINEERING.md](./ENGINEERING.md); remete-se a esses documentos para políticas, segregação de funções, planta técnica e qualidade de código.

---

## Convenções

| Campo | Significado |
|--------|-------------|
| **Épico** | Grande bloco funcional com objetivo de produto coerente e entregável. |
| **User story** | Necessidade expressa a partir de um **perfil** (ou “Transversal / sistema” quando não é papel de negócio). |
| **Critérios de aceite** | Condições **mínimas** para considerar a história **pronta** (demonstráveis em ambiente de homologação ou equivalente). |
| **Rastreabilidade** | Ligação a requisitos do PRD (**FR-xx**) e tema de entrega (**T1–T5**), quando aplicável. |

**Formato da história:** Como **[perfil]**, quero **[capacidade]**, para **[benefício]**.

**Perfis:** Master (plataforma), Admin, RH, Gestor, Colaborador (tenant). Ver matriz detalhada em [PROPOSAL.md](./PROPOSAL.md).

---

## Regra de dependência entre épicos (obrigatória)

Um **épico N** só é considerado **validado** quando os seus critérios de aceite **ao nível do épico** podem ser cumpridos **sem** depender de entregas dos **épicos N+1 … 10**. Épicos posteriores podem **refinar** ou **substituir stubs** introduzidos em épicos anteriores, mas **não** podem ser pré-requisito lógico para declarar um épico anterior concluído.

**Notas gerais:**

- **E01 vs E02:** a navegação por **RBAC** com sessão real exige identidade (E02). Em E01, a validação do menu segundo papel usa **stub acordado** (por exemplo rotas estáticas, dados de demonstração ou seletor de papel **apenas em ambiente de desenvolvimento**), documentado nos AC do épico.
- **E08:** a **leitura** de notificações na aplicação pode ser validada com **dados inseridos por migração/seed** ou processo manual controlado; a **geração automatizada** (Cron / Edge / serviço) pode ser entregue na mesma onda ou em história dedicada, desde que a validação do épico **não** exija E09 (Dashboards) nem E10 (Master).
- **E09:** dashboards **do tenant** não podem exigir E10; conteúdo específico do **Master** pertence a E10.

---

## Ordem sugerida de implementação (épicos)

1. **E01 — Interface e Navegação**
2. **E02 — Autenticação e Acesso**
3. **E03 — Contexto Multi-tenant**
4. **E04 — Consulta de Colaboradores**
5. **E05 — Gestão de Colaboradores**
6. **E06 — Estrutura Organizacional**
7. **E07 — Eventos Internos**
8. **E08 — Notificações Internas**
9. **E09 — Dashboards**
10. **E10 — Administração Global da Plataforma**

---

## E01 — Interface e Navegação

**Objetivo:** Disponibilizar a **casca** da aplicação (layout, tipografia, tokens, modo claro/escuro), **rotas** e **estrutura de menu** alinhadas ao [UI_SPEC.md](./UI_SPEC.md), com identificação visível do contexto (incluindo **tenant** quando existir dados), sem obrigar módulos de negócio completos dos épicos seguintes.

**Âmbito:** Shell (ex.: sidebar, cabeçalho), navegação principal com itens: Dashboard, Colaboradores, Departamentos, Eventos, Notificações, Administração global; padrão visualização em **modal/painel** vs cadastro em **ecrã dedicado**; princípios de complexidade visual e acessibilidade resumidos no UI_SPEC.

**Fora de âmbito deste épico:** Regras de negócio completas de diretório, eventos, notificações geradas, RLS (E03), login real (E02) — estes épicos **substituem** páginas placeholder por fluxos reais.

**Nota de validação (regra anti-dependência):** Até existir sessão (E02), o comportamento “menu conforme RBAC” é demonstrado via **stub** explícito nos AC; após E02/E03, o mesmo menu deve refletir o papel **sem** alterar a semântica dos itens definida no UI_SPEC.

| ID | História | Rastreabilidade |
|----|----------|-----------------|
| US-E01-01 | **Transversal / sistema:** Como **utilizador**, quero **uma estrutura de navegação consistente e acessível**, para **orientar-me na aplicação**. | UI_SPEC; T1 (superfície) |
| US-E01-02 | **Transversal / sistema:** Como **utilizador**, quero **identificar claramente a organização (tenant) em que estou**, para **evitar erros de contexto**. | UI_SPEC; FR-02 (contexto — refinamento em E03) |
| US-E01-03 | **Master:** Como **Master**, quero **ver o item de administração global apenas quando o meu papel o permitir**, para **aceder à área de plataforma sem ruído**. | UI_SPEC; T5 |
| US-E01-04 | **Admin | RH | Gestor | Colaborador:** Como **utilizador com um papel no tenant**, quero **ver apenas os itens de menu permitidos ao meu papel**, para **não ver áreas irrelevantes**. | UI_SPEC; FR-04 (refinamento com sessão E02+) |

**Critérios de aceite (exemplos mínimos):**

- **US-E01-01:** Layout aplica tokens/estilo alinhados ao repositório (Shadcn, `globals.css`); existe navegação rasa conforme UI_SPEC; foco visível em controlos interativos.
- **US-E01-02:** O nome (ou identificador acordado) do tenant é mostrado de forma persistente em pelo menos um local (sidebar, cabeçalho ou título), quando houver dados de tenant disponíveis; se ainda não existirem, placeholder explícito aceite apenas até E03.
- **US-E01-03 / US-E01-04:** Para papéis sem sessão real, documentar **stub** (ex.: seletor dev ou fixture) que demonstra ocultação de “Administração global” para não-Master e visibilidade por papel para itens GC/GD/GE/Notificações/Dashboard; após E02, validar com sessão real.

---

## E02 — Autenticação e Acesso

**Objetivo:** Permitir **início e fim de sessão** com **email e palavra-passe** (Supabase Auth), e fluxos de **primeiro acesso** e **reset de palavra-passe** com links gerados pela aplicação e **entrega MVP por UI (copiar)**, sem magic link como método de login, alinhado ao [PROPOSAL.md](./PROPOSAL.md).

**Âmbito:** Login, logout, geração e validação de links de primeiro acesso e reset **pelo lado da aplicação**; proibição de usar email nativo do Supabase para estes fluxos; sem AD/SSO no MVP.

**Fora de âmbito:** Envio automático de email pela app (Fase 2); isolamento completo entre tenants na base (**E03**).

**Rastreabilidade principal:** FR-02 (parcial), FR-03; T1.

| ID | História | Rastreabilidade |
|----|----------|-----------------|
| US-E02-01 | **Transversal / sistema:** Como **utilizador**, quero **iniciar sessão com email e palavra-passe**, para **aceder à intranet**. | FR-02; T1 |
| US-E02-02 | **Transversal / sistema:** Como **utilizador**, quero **terminar sessão**, para **proteger o meu acesso**. | FR-02; T1 |
| US-E02-03 | **Admin | RH:** Como **Admin ou RH**, quero **gerar um link de primeiro acesso e vê-lo em ecrã para copiar**, para **entregar manualmente ao colaborador (MVP)**. | FR-03; T1 |
| US-E02-04 | **Admin | RH:** Como **Admin ou RH**, quero **gerar um link de reset e vê-lo em ecrã para copiar**, para **repor o acesso sem email Supabase nativo (MVP)**. | FR-03; T1 |
| US-E02-05 | **Colaborador (ou outro papel com conta nova):** Como **utilizador convidado**, quero **definir a minha palavra-passe através do link de primeiro acesso**, para **começar a usar a aplicação**. | FR-03; T1 |

**Critérios de aceite (mínimos):**

- **US-E02-01 / US-E02-02:** Fluxos de login e logout funcionais; sem uso de magic link como método de entrada quotidiano (PROPOSAL).
- **US-E02-03 / US-E02-04:** Links gerados pela aplicação; UI permite copiar; **não** depende de email automático; documentação do fluxo alinhada a [SECURITY.md](./SECURITY.md).
- **US-E02-05:** Conclusão do primeiro acesso com palavra-passe definida de forma segura segundo a stack; erros tratados com mensagens compreensíveis.

---

## E03 — Contexto Multi-tenant

**Objetivo:** Garantir que, após autenticação, o **tenant** e o **papel** se aplicam de forma **consistente na aplicação servidor** e na **base de dados** com **RLS** e `tenant_id`, sem identificar tenant por subdomínio ou segmento de URL; cadeia **auth.users ↔ profiles ↔ colaboradores** conforme [PROPOSAL.md](./PROPOSAL.md) e [ARCHITECTURE.md](./ARCHITECTURE.md).

**Âmbito:** Resolução de contexto de tenant no servidor; políticas RLS nas tabelas de negócio relevantes já introduzidas; validação de que o cliente não é fonte de verdade para `tenant_id`.

**Fora de âmbito:** Funcionalidades completas de diretório/eventos (épicos seguintes); painel Master (E10).

**Rastreabilidade principal:** FR-01, FR-02; T1.

| ID | História | Rastreabilidade |
|----|----------|-----------------|
| US-E03-01 | **Transversal / sistema:** Como **sistema**, quero **isolar dados por `tenant_id` com RLS**, para **impedir acesso cruzado entre organizações**. | FR-01; T1 |
| US-E03-02 | **Transversal / sistema:** Como **utilizador autenticado**, quero **que o meu tenant e papel sejam aplicados no servidor**, para **que as operações respeitem o meu âmbito**. | FR-02; T1 |
| US-E03-03 | **Transversal / sistema:** Como **sistema**, quero **resolver o vínculo auth.users ↔ profiles (tenant, papel) ↔ colaboradores quando aplicável**, para **alinhamento com o modelo de produto**. | PROPOSAL; ARCHITECTURE; T1 |

**Critérios de aceite (mínimos):**

- **US-E03-01:** Tabelas de negócio sensíveis ao tenant têm RLS; testes ou verificação acordada (ver [QUALITY.md](./QUALITY.md)) demonstram que utilizador de tenant A não lê/escreve dados de tenant B.
- **US-E03-02:** Rotas/ações server-side validam tenant e papel; URL canónica sem tenant no path/subdomínio como identificador principal (PROPOSAL).
- **US-E03-03:** Modelo de dados documentado/implementado conforme encadeamento conceptual; colaborador pode existir sem conta (preparação para E05).

---

## E04 — Consulta de Colaboradores

**Objetivo:** Entregar o **diretório** em modo **consulta**: pesquisa/listagem e detalhe conforme **perfil**, com **campos padrão** para Colaborador; **Gestor** com visão **de toda a empresa** e **da sua equipa**; sem ainda fechar toda a gestão administrativa e provisionamento (E05).

**Âmbito:** Leitura/listagem/detalhe de colaboradores no tenant; campos padrão (ex.: email, ramal, gestor, departamento) conforme PROPOSAL.

**Fora de âmbito:** CRUD administrativo completo, atribuição de papéis e convites (E05); estrutura de departamentos editável (E06).

**Rastreabilidade principal:** FR-04 (leitura); T2.

| ID | História | Rastreabilidade |
|----|----------|-----------------|
| US-E04-01 | **Gestor:** Como **Gestor**, quero **consultar o diretório da empresa e destacar a minha equipa**, para **acompanhar o contexto organizacional**. | PROPOSAL; T2 |
| US-E04-02 | **Colaborador:** Como **Colaborador**, quero **consultar colegas no diretório com os campos padrão**, para **encontrar contactos**. | PROPOSAL; T2 |
| US-E04-03 | **Admin | RH:** Como **Admin ou RH**, quero **consultar colaboradores no contexto de gestão de pessoas**, para **apoiar operações de RH**. | PROPOSAL; T2 |

**Critérios de aceite (mínimos):**

- **US-E04-01:** Listagem/detalhe acessível ao Gestor para além da sua equipa; vista ou filtros que evidenciem reportes diretos (conforme decisão UX documentada no PRD/PROPOSAL).
- **US-E04-02:** Colaborador vê apenas campos padrão acordados para diretório; não vê dados administrativos não previstos na matriz.
- **US-E04-03:** Admin/RH vêem informação necessária à gestão em leitura; escrita administrativa pode estar limitada até E05, desde que a história E04 declare explicitamente o que é só leitura.

---

## E05 — Gestão de Colaboradores

**Objetivo:** Permitir **criação, edição e desativação** de colaboradores e **decisão de conta** (ficha vs utilizador), **atribuição de papéis** segundo **SoD** (só Admin cria Admin; RH cria RH/Gestor/Colaborador), **self-service** limitado vs **dados cadastrais** por Admin/RH, conforme [PROPOSAL.md](./PROPOSAL.md) e [GOVERNANCE.md](./GOVERNANCE.md).

**Âmbito:** CRUD GC; integração com fluxos de E02/E03 para contas; campos self-service (ex.: foto, ramal) vs dados oficiais (nome, DOB, email de ficha, etc.).

**Fora de âmbito:** Gestão de departamentos como entidade (E06); eventos (E07).

**Rastreabilidade principal:** FR-03, FR-04; T2.

| ID | História | Rastreabilidade |
|----|----------|-----------------|
| US-E05-01 | **Admin:** Como **Admin**, quero **gerir colaboradores e atribuir qualquer papel (incluindo Admin)**, para **configurar a organização**. | FR-04; GOVERNANCE; T2 |
| US-E05-02 | **RH:** Como **RH**, quero **gerir fichas e atribuir papéis RH, Gestor ou Colaborador**, para **operar people ops sem criar Admins**. | FR-04; GOVERNANCE; T2 |
| US-E05-03 | **Colaborador:** Como **Colaborador**, quero **editar apenas campos de self-service no meu perfil**, para **manter dados leves atualizados**. | PROPOSAL; T2 |
| US-E05-04 | **Transversal / sistema:** Como **sistema**, quero **distinguir colaborador com ficha de utilizador com login**, para **respeitar o modelo de provisionamento**. | PROPOSAL; FR-03; T2 |

**Critérios de aceite (mínimos):**

- **US-E05-01 / US-E05-02:** Matriz de quem pode criar que papel é aplicada em UI **e** servidor/RLS; RH não cria Admin.
- **US-E05-03:** Colaborador não altera dados cadastrais oficiais reservados a Admin/RH; campos self-service acordados funcionam.
- **US-E05-04:** Estados claros (ex.: ficha sem conta / com conta); ligação aos fluxos de primeiro acesso quando aplicável.

---

## E06 — Estrutura Organizacional

**Objetivo:** Disponibilizar o módulo **GD** (departamentos/unidades): CRUD por Admin/RH e **consumo** por Gestor/Colaborador no contexto de diretório/estrutura; regra de **um departamento por colaborador** e **no máximo um gestor** por colaborador (validação progressiva com E05 onde necessário).

**Âmbito:** Departamentos no tenant; associação colaborador–departamento; leitura para perfis sem escrita.

**Fora de âmbito:** Eventos (E07); notificações (E08).

**Rastreabilidade principal:** FR-04; T2.

| ID | História | Rastreabilidade |
|----|----------|-----------------|
| US-E06-01 | **Admin | RH:** Como **Admin ou RH**, quero **criar, editar e desativar departamentos**, para **reflectir a estrutura da organização**. | PROPOSAL; T2 |
| US-E06-02 | **Gestor | Colaborador:** Como **Gestor ou Colaborador**, quero **consultar a estrutura no contexto do diretório**, para **entender a organização**. | PROPOSAL; T2 |

**Critérios de aceite (mínimos):**

- **US-E06-01:** Operações persistidas com `tenant_id` e RLS; integridade (ex.: não apagar departamento em uso sem regra acordada — documentar comportamento).
- **US-E06-02:** Visualização coerente com permissões; sem edição para estes perfis.

---

## E07 — Eventos Internos

**Objetivo:** Implementar o módulo **GE**: criação e edição por **Admin e RH**; **eliminação** por Admin (qualquer evento do tenant) e por RH (apenas eventos **criados por si**); **audiência** empresa, departamento ou colaboradores específicos; **Gestor e Colaborador** leem e participam (ex.: inscrição) quando a audiência incluir o utilizador.

**Âmbito:** CRUD de eventos, persistência de autor para regra de eliminação; listagens e detalhe filtrados por tenant e audiência.

**Fora de âmbito:** Notificações in-app geradas e centro de leitura completo (**E08** pode consumir eventos já criados); email de produto (fora MVP).

**Rastreabilidade principal:** FR-04, FR-05; T3.

| ID | História | Rastreabilidade |
|----|----------|-----------------|
| US-E07-01 | **Admin | RH:** Como **Admin ou RH**, quero **criar e editar eventos com audiência adequada**, para **comunicar iniciativas internas**. | FR-05; T3 |
| US-E07-02 | **Admin:** Como **Admin**, quero **eliminar qualquer evento do meu tenant**, para **cumprir governação da organização**. | FR-04; GOVERNANCE; T3 |
| US-E07-03 | **RH:** Como **RH**, quero **eliminar apenas eventos de que sou autor**, para **respeitar segregação com Admin**. | FR-04; GOVERNANCE; T3 |
| US-E07-04 | **Gestor | Colaborador:** Como **Gestor ou Colaborador**, quero **ver e participar em eventos cuja audiência me inclua**, para **estar informado e inscrito quando aplicável**. | FR-05; T3 |

**Critérios de aceite (mínimos):**

- **US-E07-01:** Três tipos de audiência disponíveis e gravados corretamente; eventos isolados por tenant.
- **US-E07-02 / US-E07-03:** Regras de eliminação aplicadas em UI e políticas de dados; autor do evento persistido.
- **US-E07-04:** Utilizador não vê eventos fora da audiência; participação conforme produto (ex.: inscrição) implementada ou explicitamente “MVP mínimo” com roadmap interno — desde que a história declare o alcance.

---

## E08 — Notificações Internas

**Objetivo:** Disponibilizar **notificações in-app** associadas ao domínio de **eventos**, com **leitura** na aplicação a partir das tabelas sob **RLS**, alinhado a [ARCHITECTURE.md](./ARCHITECTURE.md) (geração via pipeline **Cron / Edge / notification-service** gravando na BD; cliente **não** é fonte de verdade para escrita).

**Âmbito:** Modelo de dados de notificações; UI de listagem/leitura; integração com eventos (ciclo de vida que dispara geração conforme arquitetura).

**Fora de âmbito:** Email de produto; dashboards agregados (E09).

**Nota de validação (regra anti-dependência):** O épico é válido se a **leitura** e as **políticas** estiverem corretas; a **geração automatizada** completa pode ser validada com **seed** ou execução controlada, desde que documentado nos AC.

**Rastreabilidade principal:** FR-07; T4.

| ID | História | Rastreabilidade |
|----|----------|-----------------|
| US-E08-01 | **Admin | RH | Gestor | Colaborador:** Como **utilizador no tenant**, quero **ver notificações in-app relacionadas com eventos a que tenho acesso**, para **não perder informação relevante**. | FR-07; T4 |
| US-E08-02 | **Transversal / sistema:** Como **sistema**, quero **gerar e persistir notificações segundo o pipeline acordado**, para **alimentar a inbox sem expor dados entre tenants**. | FR-07; ARCHITECTURE; T4 |

**Critérios de aceite (mínimos):**

- **US-E08-01:** Lista/detalhe respeita RLS e audiência de eventos; estados lidas/não lidas ou equivalente acordado.
- **US-E08-02:** Escrita de notificações **não** depende do browser a chamar o serviço de forma insegura; contrato entre componentes alinhado à planta; em ambientes sem pipeline completo, **seed** documentado satisfaz o AC até o pipeline estar ativo.

---

## E09 — Dashboards

**Objetivo:** Entregar o **Dashboard** como ponto de entrada e **resumo do contexto do tenant** ([UI_SPEC.md](./UI_SPEC.md)), com widgets acordados (ex.: contagens ou atalhos) baseados em dados já disponíveis dos épicos **E04–E08**, **sem** depender de E10.

**Âmbito:** Dashboard padrão após login para utilizadores do tenant; conteúdo útil e coerente com RBAC (o que cada perfil pode ver).

**Fora de âmbito:** Painel **Master** de plataforma (**E10**); white-label.

**Rastreabilidade:** T2–T4 (consumo agregado); não duplica FR-06 (Master).

| ID | História | Rastreabilidade |
|----|----------|-----------------|
| US-E09-01 | **Admin | RH | Gestor | Colaborador:** Como **utilizador do tenant**, quero **um resumo inicial do meu contexto**, para **priorizar o que importa**. | UI_SPEC; T2–T4 |
| US-E09-02 | **Transversal / sistema:** Como **sistema**, quero **apresentar apenas métricas e ligações permitidas ao papel**, para **respeitar RBAC**. | FR-04; T2–T4 |

**Critérios de aceite (mínimos):**

- **US-E09-01:** Dashboard mostra pelo menos um conjunto mínimo de cartões/resumos (definir na sprint: ex.: próximos eventos, notificações não lidas, atalhos) usando dados reais quando E04–E08 existirem.
- **US-E09-02:** Nenhum widget expõe dados ou ações proibidas ao papel; validação no servidor.

---

## E10 — Administração Global da Plataforma

**Objetivo:** Permitir ao **Master** gerir o **ciclo de vida dos tenants** e consultar **apenas agregados numéricos** por tenant (tipo contagem), **sem** listagens de detalhe de RH, **sem** dados pessoais e **sem** impersonação, conforme [PROPOSAL.md](./PROPOSAL.md) e [SECURITY.md](./SECURITY.md). Na **criação** de um tenant, o Master indica o **email do responsável**; a aplicação cria automaticamente o primeiro **Admin** e gera o **link de primeiro acesso** (MVP: ecrã + cópia), alinhado a **FR-03** no [PRD.md](./PRD.md) e à secção *Criação de tenant e primeiro administrador* do PROPOSAL.

**Âmbito:** CRUD de tenants (criar/editar/suspender conforme produto); **bootstrap do primeiro Admin** no ato da criação (email obrigatório, papel Admin, link de primeiro acesso); dashboard de agregados; UI de “Administração global”.

**Fora de âmbito:** Consulta ou gestão de conteúdos de negócio dos tenants após o bootstrap (diretório, eventos, etc. — épicos do tenant); **não** se considera “listagem de RH” o email único do responsável exigido na criação do tenant (PROPOSAL).

**Rastreabilidade principal:** FR-06; T5.

| ID | História | Rastreabilidade |
|----|----------|-----------------|
| US-E10-01 | **Master:** Como **Master**, quero **criar e gerir tenants na plataforma**, para **onboarding e operação multi-tenant**. | FR-06; T5 |
| US-E10-02 | **Master:** Como **Master**, quero **ver apenas totais agregados por tenant (ex.: contagens)**, para **acompanhar a plataforma sem aceder a dados pessoais**. | FR-06; SECURITY; T5 |
| US-E10-03 | **Transversal / sistema:** Como **sistema**, quero **impedir acesso Master a detalhe de dados de tenant e impersonação**, para **cumprir o modelo de segurança**. | FR-06; SECURITY; T5 |
| US-E10-04 | **Master:** Como **Master**, ao **criar um tenant**, quero **indicar o email do responsável e obter automaticamente a criação do primeiro Admin com link de primeiro acesso**, para **entregar o acesso inicial sem depender de já existir um administrador no tenant**. | FR-03; FR-06; PROPOSAL; T5 |

**Critérios de aceite (mínimos):**

- **US-E10-01:** Operações de tenant persistidas; apenas Master acede a estas funções.
- **US-E10-02:** Dashboard/agregados mostram apenas métricas permitidas; **não** há tabelas de colaboradores/eventos/RH ao nível de linha.
- **US-E10-03:** Testes ou revisão de políticas/views confirmam bloqueio de detalhe e ausência de impersonação.
- **US-E10-04:** Criação de tenant **exige** email do responsável; criação de conta com papel **Admin** nesse tenant; geração de **link de primeiro acesso** pela aplicação; MVP: link **visível em ecrã** para cópia; sem email nativo Supabase; validação **server-side** do fluxo.

---

## Tabela de rastreabilidade PRD (RF ↔ épicos)

| RF | Resumo | Épicos principais |
|----|--------|-------------------|
| FR-01 | Isolamento `tenant_id` + RLS | E03 |
| FR-02 | Contexto tenant e papel no servidor | E02, E03 |
| FR-03 | Links primeiro acesso/reset (app, MVP cópia); bootstrap primeiro Admin na criação de tenant (Master) | E02, E05, E10 |
| FR-04 | RBAC e SoD em UI e políticas | E01–E07, E09 |
| FR-05 | Eventos e audiência | E07 |
| FR-06 | Master só agregados | E10 |
| FR-07 | Notificações in-app (eventos) | E08 |

---

## Temas de entrega PRD (T1–T5) ↔ épicos

| Tema | Âmbito | Épicos |
|------|--------|--------|
| T1 — Identidade e isolamento | Auth, tenant, RLS | E01–E03 |
| T2 — Pessoas e estrutura | Colaboradores, departamentos, diretório | E04–E06 |
| T3 — Eventos e participação | GE | E07 |
| T4 — Notificações e leitura | In-app | E08 |
| T5 — Plataforma (Master) | Tenants e agregados | E10 |

**Nota:** **E09 (Dashboards)** consome T2–T4 sem substituir os requisitos das áreas.

---

## Evolução documental

| Campo | Valor |
|-------|--------|
| **Versão** | 1.1 |
| **Data** | 2026-04-06 |
| **Baseline PROPOSAL referenciada** | 2.2 |

Alterações a épicos ou prioridade global devem alinhar com [GOVERNANCE.md](./GOVERNANCE.md) e, em regras de produto, com [PROPOSAL.md](./PROPOSAL.md).

---

**Documento:** backlog de entrega complementar ao [PRD.md](./PRD.md) e ao [PROPOSAL.md](./PROPOSAL.md).