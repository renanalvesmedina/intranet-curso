# Contracts: Interface e Navegação

**Feature**: 001-e01-interface-navegacao  
**Date**: 2026-04-07

## Overview

Este diretório contém os contratos técnicos que definem as interfaces e comportamentos da feature E01.

## Contracts

| Contract | Description | Version |
|----------|-------------|---------|
| [bff.contract.md](./bff.contract.md) | Arquitetura BFF (Backend for Frontend) com Next.js | 1.0.0 |
| [menu.contract.md](./menu.contract.md) | Configuração do menu, itens, ícones e regras RBAC | 1.0.0 |
| [routes.contract.md](./routes.contract.md) | Rotas da aplicação, layouts e navegação | 1.0.0 |

## Quick Reference

### Menu Items

| Item | Href | Roles |
|------|------|-------|
| Dashboard | `/dashboard` | All |
| Colaboradores | `/colaboradores` | All |
| Departamentos | `/departamentos` | Admin, RH |
| Eventos | `/eventos` | All |
| Notificações | `/notificacoes` | All |
| Administração global | `/admin` | Master |

### Route Structure

```
app/
├── (app)/              # Authenticated shell
│   ├── dashboard/
│   ├── colaboradores/
│   ├── departamentos/
│   ├── eventos/
│   ├── notificacoes/
│   └── admin/
└── not-found.tsx       # 404 page
```

## Usage

Estes contratos servem como referência para:

1. **Implementação** - Estrutura exacta de tipos e configurações
2. **Testes** - Cenários de teste documentados
3. **Validação** - Verificar conformidade da implementação
4. **Documentação** - Referência para futuras alterações

## Versioning

Alterações aos contratos devem:
- Incrementar versão (semver)
- Documentar no changelog do ficheiro
- Ser revistas antes de implementação
