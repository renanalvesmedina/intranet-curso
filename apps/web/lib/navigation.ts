import type { ComponentType } from 'react'
import type { Role } from './roles'
import {
  House,
  Users,
  Buildings,
  Calendar,
  Bell,
  Gear,
} from '@phosphor-icons/react'

/**
 * Grupos de menu para organização visual.
 */
export type MenuGroup = 'main' | 'platform'

/**
 * Item de navegação do menu principal.
 */
export interface MenuItem {
  /** Identificador único */
  id: string
  /** Texto exibido no menu */
  label: string
  /** Rota de destino */
  href: string
  /** Componente de ícone Phosphor */
  icon: ComponentType<{ className?: string; weight?: 'regular' | 'bold' }>
  /** Papéis que podem ver este item */
  visibleTo: Role[]
  /** Grupo ao qual pertence */
  group: MenuGroup
  /** Se o item está temporariamente desabilitado */
  disabled?: boolean
  /** Badge de notificação (ex: contagem) */
  badge?: number | string
}

/**
 * Configuração completa do menu.
 */
export interface MenuConfig {
  /** Itens do menu */
  items: MenuItem[]
  /** Ordem dos grupos */
  groupOrder: MenuGroup[]
  /** Labels dos grupos (opcional) */
  groupLabels?: Partial<Record<MenuGroup, string | undefined>>
}

/**
 * Configuração do menu principal.
 */
export const menuConfig: MenuConfig = {
  items: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: House,
      visibleTo: ['master', 'admin', 'rh', 'gestor', 'colaborador'],
      group: 'main',
    },
    {
      id: 'colaboradores',
      label: 'Colaboradores',
      href: '/colaboradores',
      icon: Users,
      visibleTo: ['master', 'admin', 'rh', 'gestor', 'colaborador'],
      group: 'main',
    },
    {
      id: 'departamentos',
      label: 'Departamentos',
      href: '/departamentos',
      icon: Buildings,
      visibleTo: ['master', 'admin', 'rh'],
      group: 'main',
    },
    {
      id: 'eventos',
      label: 'Eventos',
      href: '/eventos',
      icon: Calendar,
      visibleTo: ['master', 'admin', 'rh', 'gestor', 'colaborador'],
      group: 'main',
    },
    {
      id: 'notificacoes',
      label: 'Notificações',
      href: '/notificacoes',
      icon: Bell,
      visibleTo: ['master', 'admin', 'rh', 'gestor', 'colaborador'],
      group: 'main',
    },
    {
      id: 'admin-global',
      label: 'Administração global',
      href: '/admin',
      icon: Gear,
      visibleTo: ['master'],
      group: 'platform',
    },
  ],
  groupOrder: ['main', 'platform'],
  groupLabels: {
    main: undefined,
    platform: 'Plataforma',
  },
}

/**
 * Verifica se uma rota está activa baseado no pathname.
 */
export function isRouteActive(pathname: string, href: string): boolean {
  if (pathname === href) return true
  if (pathname.startsWith(href + '/')) return true
  return false
}

/**
 * Obtém o item de menu activo baseado no pathname.
 */
export function getActiveMenuItem(pathname: string): MenuItem | undefined {
  return menuConfig.items.find(item => isRouteActive(pathname, item.href))
}

/**
 * Obtém os itens de menu visíveis para um papel.
 */
export function getVisibleMenuItems(role: Role): MenuItem[] {
  return menuConfig.items.filter(item => item.visibleTo.includes(role))
}

/**
 * Verifica se um papel pode aceder a uma rota.
 * Rotas desconhecidas são permitidas por defeito (permissive).
 */
export function canAccessRoute(pathname: string, role: Role): boolean {
  const item = menuConfig.items.find(i => isRouteActive(pathname, i.href))
  if (!item) return true
  return item.visibleTo.includes(role)
}
