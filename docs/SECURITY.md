# Políticas de segurança da aplicação

## Propósito e âmbito

Este documento define as **políticas de segurança na aplicação** da intranet corporativa multi-tenant: princípios, controlos técnicos esperados e fronteiras de responsabilidade entre **código**, **dados** e **operação**.

**Complementa** o [PROPOSAL.md](./PROPOSAL.md) (requisitos e NFRs), o [GOVERNANCE.md](./GOVERNANCE.md) (papéis, segregação de funções, auditoria em alto nível), o [ENGINEERING.md](./ENGINEERING.md) (stack, testes, convenções do repositório) e o [QUALITY.md](./QUALITY.md) (revisão de código e critérios de implementação).

**Cobre:** autenticação e autorização; isolamento multi-tenant; superfície de API; segurança web (cliente e servidor); segredos; fluxos sensíveis (convite, reset); registo de auditoria aplicacional; ligação a privacidade e dados pessoais.

**Não substitui:** política de privacidade ou contratos legais (RGPD); runbooks de infraestrutura, SOC ou resposta a incidentes operacionais detalhada; política corporativa de TI da sua organização. **Não fixa** SLAs, RPO/RTO nem fornecedores concretos — ver PROPOSAL e acordo com infraestrutura.

---

## Princípios

| Princípio | Aplicação na plataforma |
|-----------|-------------------------|
| **Menor privilégio** | Cada perfil (Master, Admin, RH, Gestor, Colaborador) recebe apenas as permissões necessárias; um papel por utilizador no tenant. Detalhe funcional: [PROPOSAL.md](./PROPOSAL.md), [GOVERNANCE.md](./GOVERNANCE.md). |
| **Defesa em profundidade** | Autorização validada **no servidor**; isolamento reforçado na base com **RLS**; o cliente **não** é fonte de verdade para `tenant_id` nem para permissões. |
| **Separação de planos** | Plano **plataforma** (Master) vs **tenant** (demais perfis): limites de dados do Master e ausência de impersonação — ver PROPOSAL e secção “Plano Master” abaixo. |
| **Minimização e proporcionalidade** | Tratar apenas dados necessários ao produto; módulos de RH envolvem dados pessoais — alinhar com base legal e retenção (RGPD) na documentação legal, não só no código. |

---

## Autenticação

- **Fornecedor de identidade:** **Supabase Auth** (`auth.users`), com **email e palavra-passe** no uso quotidiano, conforme [PROPOSAL.md](./PROPOSAL.md). **Não** está previsto AD/SSO empresarial na proposta atual.
- **Sessões e tokens:** devem ter **escopo claro** (aplicação autenticada, sem partilha indevida de contexto entre tenants). Detalhes de configuração (duração, refresh, cookies) ficam na implementação e em artefactos técnicos quando existirem.
- **Primeiro acesso e reset de palavra-passe:** os **links** são gerados pela **aplicação**; **proibido** depender do envio nativo do Supabase para estes fluxos. **MVP:** entrega por UI (Admin/RH copiam o link); envio automático por email pela app é **opcional** e **posterior**, sempre pelo canal da aplicação — ver PROPOSAL.

---

## Autorização e RBAC

- O **contexto de tenant** e o **papel** resolvem-se após o login através da cadeia prevista no produto (ex.: `profiles` e regras de negócio), **sempre com validação no servidor** — ver [PROPOSAL.md](./PROPOSAL.md).
- A **matriz RBAC** (áreas, Master vs Admin vs RH, **eliminação de eventos** — Admin em todo o tenant, RH apenas eventos **criados por si**, limites de provisionamento) é **fonte de requisitos**; a implementação deve mapear permissões a **rotas**, **ações** e **políticas de dados** de forma testável — ver [ENGINEERING.md](./ENGINEERING.md).
- **Segregação de funções** (quem pode criar Admin, regras de eliminação de eventos, **self-service** vs dados alterados por Admin/RH, ficha vs conta com login) é obrigatória em produto e deve refletir-se em regras aplicacionais **e** nas políticas da base — ver [GOVERNANCE.md](./GOVERNANCE.md).

---

## Isolamento multi-tenant

- **Modelo de dados:** base partilhada com **`tenant_id`** nas entidades de negócio, com **Row Level Security (RLS)** no PostgreSQL como barreira **obrigatória** de isolamento — ver PROPOSAL.
- **Resolução de tenant:** **sem** subdomínio nem segmento de URL como identificador principal; o **backend** e a sessão autenticada aplicam o contexto do tenant após o login. **Proibição:** confiar apenas em parâmetros ou estado do cliente para filtrar dados entre tenants.
- **Serviços internos** (ex.: serviço de notificações em Fastify): devem respeitar o mesmo modelo de confiança — autenticação/autorização explícitas e dados filtrados por tenant; contratos documentados em evoluções de arquitetura.

---

## Plano Master e dados dos tenants

Em alinhamento com o produto:

- O **Master** **não** deve aceder a **listagens** de registos de negócio, fichas de colaboradores nem dados pessoais dos tenants.
- O acesso a dados dos tenants pelo Master limita-se a **valores agregados por contagem** (tipo `COUNT` / totais numéricos), conforme PROPOSAL.
- **Exceção controlada (bootstrap):** no **fluxo de criação de tenant**, o Master indica o **email do responsável** para criação do primeiro **Admin** e geração do link de primeiro acesso; não constitui listagem nem consulta arbitrária a cadastros de RH (ver [PROPOSAL.md](./PROPOSAL.md)).
- **Proibido:** impersonação de utilizadores de tenant e leitura de suporte ao detalhe de cadastros dos tenants para fins de “suporte” não explicitamente autorizados pelo produto e pela governação.

---

## Superfície de API e integrações

- **Sem API HTTP pública** genérica da aplicação para exposição de dados de tenant; o acesso passa pela **aplicação autenticada** e políticas alinhadas com **RLS** — ver NFRs no PROPOSAL e [ENGINEERING.md](./ENGINEERING.md).
- Integrações futuras (ex.: email transacional para links, serviços externos) devem ser **autenticadas**, com **segredos** fora do repositório e revisão de impacto em isolamento e RGPD.

---

## Segurança da aplicação web

- **XSS:** tratar conteúdo controlado pelo utilizador com cuidado; seguir boas práticas da stack **Next.js** / React e evitar `dangerouslySetInnerHTML` e padrões equivalentes sem sanitização explícita quando aplicável.
- **CSRF:** usar proteções adequadas ao modelo de sessão e de cookies da aplicação e às APIs server-side (Route Handlers, Server Actions) conforme a implementação.
- **Cabeçalhos e políticas do browser:** configurar de forma coerente com o deployment (por exemplo políticas de conteúdo onde fizer sentido), sem substituir controlos de autorização no servidor.
- **Transporte:** tráfego de produção sobre **HTTPS**.

---

## Segredos e configuração

- **Proibido** commitar segredos (chaves de API, service roles, passwords) no repositório.
- Utilizar **variáveis de ambiente** ou gestão de segredos do ambiente de execução; princípio de **menor privilégio** também nas chaves de serviço (ex.: chaves com permissões mínimas necessárias).
- Separar configuração de **desenvolvimento**, **staging** e **produção**; não reutilizar credenciais de produção em ambientes de teste partilhados sem controlo.

---

## Dados pessoais e privacidade (ligação aplicacional)

- Os módulos de RH e diretório tratam **dados pessoais**. A conformidade com **RGPD** (bases legais, retenção, direitos do titular) deve constar da **documentação legal** e dos processos da organização, não apenas de políticas técnicas aqui descritas — ver PROPOSAL.
- **Self-service vs cadastro oficial:** em linha com o [PROPOSAL.md](./PROPOSAL.md), o utilizador pode alterar **apenas** campos de perfil acordados como **self-service** (ex.: foto, ramal); **nome**, **data de nascimento**, **email** e restantes dados de ficha tratados como cadastro de **Admin/RH** não devem ser mutáveis pelo próprio sem fluxo administrativo. A implementação deve **validar no servidor** esta separação.
- **Retenção e eliminação:** definir e documentar na implementação e na governação de dados, em articulação com o responsável legal/designado.

---

## Auditoria aplicacional

- Ações sensíveis (alterações em **cadastros de pessoas**, **permissões**, **provisionamento de acesso**) devem ser **auditáveis**: registo de quem alterou o quê, com âmbito e retenção **a acordar** na implementação — ver PROPOSAL e GOVERNANCE.
- Os requisitos de auditoria **não** substituem logs de infraestrutura nem monitorização de segurança em rede; complementam-nos.

---

## Notificações e canais

- **Notificações in-app** (eventos) são o canal de produto previsto para alertas de eventos; **sem** email de produto para comunicados/digestos na proposta atual — ver PROPOSAL.
- Qualquer evolução para envio de email (ex.: links de primeiro acesso) deve manter o princípio de **não** usar email nativo do Supabase para esses fluxos e de tratar integrações como **superfície sensível** (segredos, abuso, RGPD).

---

## Dependências e supply chain

- Manter dependências atualizadas de forma **controlada** (revisão de PRs, lockfiles).
- Em caso de vulnerabilidades conhecidas em dependências críticas, priorizar **atualização** ou **mitigação** documentada.

---

## Divulgação responsável

Se descobrir uma vulnerabilidade de segurança neste projeto, **não** abra issue pública com detalhes exploráveis. Contacte os maintainers do repositório por um canal **privado** (email de segurança ou contacto indicado pelo proprietário do projeto — **a definir** pela organização).

---

## Hierarquia e revisão

| Documento | Relação com segurança |
|-----------|------------------------|
| [PROPOSAL.md](./PROPOSAL.md) | Requisitos de produto, NFRs de segurança e privacidade. |
| [GOVERNANCE.md](./GOVERNANCE.md) | SoD, auditoria em alto nível, responsabilidades por plano. |
| [ENGINEERING.md](./ENGINEERING.md) | Stack, testes (Vitest, Playwright), validação server-side. |
| [QUALITY.md](./QUALITY.md) | Revisão de código e critérios de implementação (complementar à segurança). |
| **SECURITY.md** (este) | Políticas de segurança **na aplicação** e controlos técnicos esperados. |

| Campo | Valor |
|--------|--------|
| **Versão** | 1.3 |
| **Data** | 2026-04-06 |
| **Alterações em 1.3** | Plano Master: exceção controlada na **criação de tenant** (email do responsável, primeiro Admin, link de primeiro acesso), alinhado ao PROPOSAL 2.2. |
| **Alterações em 1.2** | Hierarquia documental: referência ao [QUALITY.md](./QUALITY.md). |
| **Alterações em 1.1** | Autorização e dados pessoais: eliminação de eventos (Admin/RH); self-service vs Admin/RH alinhados ao PROPOSAL 2.1. |

Alterações a **SECURITY.md** devem ser revistas pela **equipa técnica** e, quando afetarem produto ou dados pessoais, articuladas com **produto** e **responsável legal** conforme o processo interno.

---

**Documento:** políticas de segurança da aplicação (complementar ao [PROPOSAL.md](./PROPOSAL.md), [GOVERNANCE.md](./GOVERNANCE.md), [ENGINEERING.md](./ENGINEERING.md) e [QUALITY.md](./QUALITY.md)).