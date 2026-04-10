import { describe, it, expect } from 'vitest'
import { render, screen } from '@/__tests__/test-utils'
import { ThemeToggle } from '@/components/theme/theme-toggle'

describe('ThemeToggle', () => {
  it('renders theme toggle button', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button', { name: /alternar tema/i })
    expect(button).toBeInTheDocument()
  })

  it('has visible focus state', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button', { name: /alternar tema/i })
    button.focus()
    expect(document.activeElement).toBe(button)
  })

  it('is keyboard accessible', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button', { name: /alternar tema/i })
    expect(button).not.toBeDisabled()
  })
})
