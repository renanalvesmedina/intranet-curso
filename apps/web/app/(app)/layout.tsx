import { AppShell } from '@/components/app-shell/app-shell'
import { RoleProvider } from '@/contexts/role-context'
import { RoleSelector } from '@/components/dev/role-selector'

const isDev = process.env.NODE_ENV === 'development'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleProvider>
      <AppShell>{children}</AppShell>
      {isDev && <RoleSelector />}
    </RoleProvider>
  )
}
