/**
 * Papéis disponíveis na aplicação.
 * Alinhado com PROPOSAL.md - matriz RBAC.
 */
export type Role = 'master' | 'admin' | 'rh' | 'gestor' | 'colaborador'

/**
 * Configuração de papel com metadata.
 */
export interface RoleConfig {
  id: Role
  label: string
  description: string
  /** Nível de privilégio (maior = mais permissões). Usado para ordenação. */
  level: number
}

export const ROLES: Record<Role, RoleConfig> = {
  master: {
    id: 'master',
    label: 'Master',
    description: 'Administrador da plataforma (multi-tenant)',
    level: 100,
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    description: 'Administrador do tenant',
    level: 80,
  },
  rh: {
    id: 'rh',
    label: 'RH',
    description: 'Recursos Humanos do tenant',
    level: 60,
  },
  gestor: {
    id: 'gestor',
    label: 'Gestor',
    description: 'Gestor de equipa',
    level: 40,
  },
  colaborador: {
    id: 'colaborador',
    label: 'Colaborador',
    description: 'Colaborador padrão',
    level: 20,
  },
}

/** Lista ordenada de papéis por nível (maior primeiro) */
export const ROLE_LIST = Object.values(ROLES).sort((a, b) => b.level - a.level)
