import { describe, it, expect } from 'vitest'
import { render, screen } from '@/__tests__/test-utils'
import { TenantBadge } from '@/components/app-shell/tenant-badge'

describe('TenantBadge', () => {
  it('renders tenant name placeholder', () => {
    render(<TenantBadge />)
    
    expect(screen.getByText('Organização')).toBeInTheDocument()
  })

  it('renders Intranet branding', () => {
    render(<TenantBadge />)
    
    expect(screen.getByText('Intranet')).toBeInTheDocument()
  })

  it('renders as a link to dashboard', () => {
    render(<TenantBadge />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/dashboard')
  })
})
