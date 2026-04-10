import { describe, it, expect } from 'vitest'
import { ROLES, ROLE_LIST } from '@/lib/roles'

describe('ROLES', () => {
  it('has 5 defined roles', () => {
    expect(Object.keys(ROLES)).toHaveLength(5)
  })

  it('includes master, admin, rh, gestor, colaborador', () => {
    expect(ROLES.master).toBeDefined()
    expect(ROLES.admin).toBeDefined()
    expect(ROLES.rh).toBeDefined()
    expect(ROLES.gestor).toBeDefined()
    expect(ROLES.colaborador).toBeDefined()
  })

  it('master has highest level', () => {
    const levels = Object.values(ROLES).map(r => r.level)
    expect(ROLES.master.level).toBe(Math.max(...levels))
  })

  it('colaborador has lowest level', () => {
    const levels = Object.values(ROLES).map(r => r.level)
    expect(ROLES.colaborador.level).toBe(Math.min(...levels))
  })
})

describe('ROLE_LIST', () => {
  it('is sorted by level descending', () => {
    const levels = ROLE_LIST.map(r => r.level)
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i - 1]).toBeGreaterThanOrEqual(levels[i])
    }
  })

  it('has master first', () => {
    expect(ROLE_LIST[0].id).toBe('master')
  })
})
