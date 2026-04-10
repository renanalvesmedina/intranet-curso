'use client'

import Link from 'next/link'
import type { ComponentType } from 'react'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

interface NavItemProps {
  id: string
  label: string
  href: string
  icon: ComponentType<{ className?: string; weight?: 'regular' | 'bold' }>
  isActive: boolean
  badge?: number | string
}

export function NavItem({
  label,
  href,
  icon: Icon,
  isActive,
  badge,
}: NavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={href}>
          <Icon className="size-4" weight={isActive ? 'bold' : 'regular'} />
          <span>{label}</span>
          {badge !== undefined && (
            <span className="ml-auto text-xs text-muted-foreground">
              {badge}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
