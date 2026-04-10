import { describe, it, expect } from 'vitest'
import {
  menuConfig,
  getActiveMenuItem,
  isRouteActive,
  getVisibleMenuItems,
  canAccessRoute,
} from '@/lib/navigation'

describe('menuConfig', () => {
  it('contains 5 main menu items', () => {
    const mainItems = menuConfig.items.filter(item => item.group === 'main')
    expect(mainItems).toHaveLength(5)
  })

  it('includes Dashboard, Colaboradores, Departamentos, Eventos, Notificações', () => {
    const mainItems = menuConfig.items.filter(item => item.group === 'main')
    const ids = mainItems.map(item => item.id)
    
    expect(ids).toContain('dashboard')
    expect(ids).toContain('colaboradores')
    expect(ids).toContain('departamentos')
    expect(ids).toContain('eventos')
    expect(ids).toContain('notificacoes')
  })

  it('has correct hrefs for menu items', () => {
    const dashboard = menuConfig.items.find(i => i.id === 'dashboard')
    const colaboradores = menuConfig.items.find(i => i.id === 'colaboradores')
    const departamentos = menuConfig.items.find(i => i.id === 'departamentos')
    const eventos = menuConfig.items.find(i => i.id === 'eventos')
    const notificacoes = menuConfig.items.find(i => i.id === 'notificacoes')

    expect(dashboard?.href).toBe('/dashboard')
    expect(colaboradores?.href).toBe('/colaboradores')
    expect(departamentos?.href).toBe('/departamentos')
    expect(eventos?.href).toBe('/eventos')
    expect(notificacoes?.href).toBe('/notificacoes')
  })
})

describe('getActiveMenuItem', () => {
  it('returns dashboard item for /dashboard', () => {
    const item = getActiveMenuItem('/dashboard')
    expect(item?.id).toBe('dashboard')
  })

  it('returns colaboradores item for /colaboradores', () => {
    const item = getActiveMenuItem('/colaboradores')
    expect(item?.id).toBe('colaboradores')
  })

  it('returns colaboradores item for /colaboradores/123', () => {
    const item = getActiveMenuItem('/colaboradores/123')
    expect(item?.id).toBe('colaboradores')
  })

  it('returns undefined for unknown route', () => {
    const item = getActiveMenuItem('/unknown')
    expect(item).toBeUndefined()
  })
})

describe('isRouteActive', () => {
  it('returns true for exact match', () => {
    expect(isRouteActive('/dashboard', '/dashboard')).toBe(true)
  })

  it('returns true for sub-route match', () => {
    expect(isRouteActive('/colaboradores/123', '/colaboradores')).toBe(true)
  })

  it('returns false for different route', () => {
    expect(isRouteActive('/eventos', '/dashboard')).toBe(false)
  })

  it('returns false when pathname does not start with href', () => {
    expect(isRouteActive('/dashboardx', '/dashboard')).toBe(false)
  })
})

describe('getVisibleMenuItems', () => {
  it('returns all main items for master role', () => {
    const items = getVisibleMenuItems('master')
    const mainItems = items.filter(i => i.group === 'main')
    expect(mainItems).toHaveLength(5)
  })

  it('returns all main items for admin role', () => {
    const items = getVisibleMenuItems('admin')
    const mainItems = items.filter(i => i.group === 'main')
    expect(mainItems).toHaveLength(5)
  })

  it('returns 5 main items for rh role (including departamentos)', () => {
    const items = getVisibleMenuItems('rh')
    const mainItems = items.filter(i => i.group === 'main')
    expect(mainItems).toHaveLength(5)
    expect(mainItems.map(i => i.id)).toContain('departamentos')
  })

  it('returns 4 main items for gestor role (no departamentos)', () => {
    const items = getVisibleMenuItems('gestor')
    const mainItems = items.filter(i => i.group === 'main')
    expect(mainItems).toHaveLength(4)
    expect(mainItems.map(i => i.id)).not.toContain('departamentos')
  })

  it('returns 4 main items for colaborador role (no departamentos)', () => {
    const items = getVisibleMenuItems('colaborador')
    const mainItems = items.filter(i => i.group === 'main')
    expect(mainItems).toHaveLength(4)
    expect(mainItems.map(i => i.id)).not.toContain('departamentos')
  })
})

describe('canAccessRoute', () => {
  it('allows master to access any route', () => {
    expect(canAccessRoute('/dashboard', 'master')).toBe(true)
    expect(canAccessRoute('/departamentos', 'master')).toBe(true)
  })

  it('allows colaborador to access dashboard', () => {
    expect(canAccessRoute('/dashboard', 'colaborador')).toBe(true)
  })

  it('denies colaborador access to departamentos', () => {
    expect(canAccessRoute('/departamentos', 'colaborador')).toBe(false)
  })

  it('allows rh to access departamentos', () => {
    expect(canAccessRoute('/departamentos', 'rh')).toBe(true)
  })

  it('returns true for unknown routes (permissive)', () => {
    expect(canAccessRoute('/unknown-route', 'colaborador')).toBe(true)
  })
})

describe('admin-global visibility', () => {
  it('admin-global is visible only to master', () => {
    const masterItems = getVisibleMenuItems('master')
    const adminItems = getVisibleMenuItems('admin')
    const colaboradorItems = getVisibleMenuItems('colaborador')
    
    expect(masterItems.find(i => i.id === 'admin-global')).toBeDefined()
    expect(adminItems.find(i => i.id === 'admin-global')).toBeUndefined()
    expect(colaboradorItems.find(i => i.id === 'admin-global')).toBeUndefined()
  })

  it('admin-global belongs to platform group', () => {
    const masterItems = getVisibleMenuItems('master')
    const adminGlobal = masterItems.find(i => i.id === 'admin-global')
    
    expect(adminGlobal?.group).toBe('platform')
  })

  it('admin-global has correct href', () => {
    const masterItems = getVisibleMenuItems('master')
    const adminGlobal = masterItems.find(i => i.id === 'admin-global')
    
    expect(adminGlobal?.href).toBe('/admin')
  })
})
