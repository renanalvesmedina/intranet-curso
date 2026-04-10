import { describe, it, expect } from 'vitest'
import { render, screen } from '@/__tests__/test-utils'
import { AppShell } from '@/components/app-shell/app-shell'

describe('AppShell', () => {
  it('renders the sidebar', () => {
    render(
      <AppShell>
        <div>Content</div>
      </AppShell>
    )
    
    const sidebar = document.querySelector('[data-slot="sidebar"]')
    expect(sidebar).toBeInTheDocument()
  })

  it('renders children in main content area', () => {
    render(
      <AppShell>
        <div data-testid="test-content">Test Content</div>
      </AppShell>
    )
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
  })

  it('maintains consistent layout structure', () => {
    render(
      <AppShell>
        <div>Content</div>
      </AppShell>
    )
    
    const sidebarWrapper = document.querySelector('[data-slot="sidebar-wrapper"]')
    expect(sidebarWrapper).toBeInTheDocument()
    
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })
})
