import { ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from '@/components/ui/sidebar'
import { RoleProvider } from '@/contexts/role-context'

function AllProviders({ children }: { children: ReactNode }) {
  return (
    <RoleProvider>
      <SidebarProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </SidebarProvider>
    </RoleProvider>
  )
}

function customRender(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options })
}

export * from '@testing-library/react'
export { customRender as render }
