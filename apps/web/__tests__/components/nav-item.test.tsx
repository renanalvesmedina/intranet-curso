import { describe, it, expect } from 'vitest'
import { render, screen } from '@/__tests__/test-utils'
import { NavItem } from '@/components/app-shell/nav-item'
import { House } from '@phosphor-icons/react'

describe('NavItem', () => {
  const defaultProps = {
    id: 'test',
    label: 'Test Item',
    href: '/test',
    icon: House,
    isActive: false,
  }

  it('renders the label', () => {
    render(<NavItem {...defaultProps} />)
    
    expect(screen.getByText('Test Item')).toBeInTheDocument()
  })

  it('renders a link with correct href', () => {
    render(<NavItem {...defaultProps} />)
    
    const link = screen.getByRole('link', { name: /test item/i })
    expect(link).toHaveAttribute('href', '/test')
  })

  it('shows active state when isActive is true', () => {
    render(<NavItem {...defaultProps} isActive={true} />)
    
    const link = screen.getByRole('link', { name: /test item/i })
    expect(link).toHaveAttribute('data-active', 'true')
  })

  it('shows inactive state when isActive is false', () => {
    render(<NavItem {...defaultProps} isActive={false} />)
    
    const link = screen.getByRole('link', { name: /test item/i })
    expect(link).toHaveAttribute('data-active', 'false')
  })

  it('is keyboard accessible', () => {
    render(<NavItem {...defaultProps} />)
    
    const link = screen.getByRole('link', { name: /test item/i })
    expect(link).not.toHaveAttribute('tabindex', '-1')
  })
})
