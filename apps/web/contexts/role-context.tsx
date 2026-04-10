'use client'

import { createContext, useContext, useState, useSyncExternalStore, useCallback, type ReactNode } from 'react'
import type { Role } from '@/lib/roles'

const STORAGE_KEY = 'dev-role'
const DEFAULT_ROLE: Role = 'colaborador'

interface RoleContextValue {
  role: Role
  setRole: (role: Role) => void
}

const RoleContext = createContext<RoleContextValue | null>(null)

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) {
    throw new Error('useRole must be used within RoleProvider')
  }
  return ctx
}

interface RoleProviderProps {
  children: ReactNode
}

function getStoredRole(): Role {
  if (typeof window === 'undefined') return DEFAULT_ROLE
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && isValidRole(stored)) {
    return stored as Role
  }
  return DEFAULT_ROLE
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

export function RoleProvider({ children }: RoleProviderProps) {
  const storedRole = useSyncExternalStore(
    subscribe,
    getStoredRole,
    () => DEFAULT_ROLE
  )
  
  const [role, setRoleState] = useState<Role>(storedRole)

  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole)
    localStorage.setItem(STORAGE_KEY, newRole)
  }, [])

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

function isValidRole(value: string): value is Role {
  return ['master', 'admin', 'rh', 'gestor', 'colaborador'].includes(value)
}
