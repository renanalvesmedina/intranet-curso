import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { RoleProvider, useRole } from '@/contexts/role-context'
import { TooltipProvider } from '@/components/ui/tooltip'

function TestConsumer() {
  const { role, setRole } = useRole()
  return (
    <div>
      <span data-testid="current-role">{role}</span>
      <button onClick={() => setRole('admin')}>Set Admin</button>
    </div>
  )
}

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </RoleProvider>
  )
}

describe('RoleContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('provides default role (colaborador)', () => {
    render(<TestConsumer />, { wrapper: AllProviders })
    
    expect(screen.getByTestId('current-role')).toHaveTextContent('colaborador')
  })

  it('allows role change via setRole', async () => {
    render(<TestConsumer />, { wrapper: AllProviders })
    
    const button = screen.getByText('Set Admin')
    await act(async () => {
      fireEvent.click(button)
    })
    
    expect(screen.getByTestId('current-role')).toHaveTextContent('admin')
  })

  it('persists role to localStorage', async () => {
    render(<TestConsumer />, { wrapper: AllProviders })
    
    const button = screen.getByText('Set Admin')
    await act(async () => {
      fireEvent.click(button)
    })
    
    expect(localStorage.getItem('dev-role')).toBe('admin')
  })

  it('restores role from localStorage on mount', () => {
    localStorage.setItem('dev-role', 'rh')
    
    render(<TestConsumer />, { wrapper: AllProviders })
    
    expect(screen.getByTestId('current-role')).toHaveTextContent('rh')
  })
})
