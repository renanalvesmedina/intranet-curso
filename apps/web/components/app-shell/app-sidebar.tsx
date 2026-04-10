'use client'

import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { NavItem } from './nav-item'
import { TenantBadge } from './tenant-badge'
import { getVisibleMenuItems, isRouteActive, menuConfig } from '@/lib/navigation'
import { useRole } from '@/contexts/role-context'

export function AppSidebar() {
  const pathname = usePathname()
  const { role } = useRole()
  const visibleItems = getVisibleMenuItems(role)
  const mainItems = visibleItems.filter(item => item.group === 'main')
  const platformItems = visibleItems.filter(item => item.group === 'platform')

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <TenantBadge />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="py-2">
            {mainItems.map(item => (
              <NavItem
                key={item.id}
                id={item.id}
                label={item.label}
                href={item.href}
                icon={item.icon}
                isActive={isRouteActive(pathname, item.href)}
                badge={item.badge}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {platformItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {menuConfig.groupLabels?.platform}
            </SidebarGroupLabel>
            <SidebarMenu>
              {platformItems.map(item => (
                <NavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  isActive={isRouteActive(pathname, item.href)}
                  badge={item.badge}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
