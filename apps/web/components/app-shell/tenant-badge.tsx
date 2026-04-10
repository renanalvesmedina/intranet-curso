'use client'

import Link from 'next/link'
import { SidebarMenuButton, SidebarMenuItem, SidebarMenu } from '@/components/ui/sidebar'
import { House } from '@phosphor-icons/react'
import { PLACEHOLDER_TENANT } from '@/lib/tenant'

export function TenantBadge() {
  const tenant = PLACEHOLDER_TENANT

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/dashboard">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <House className="size-4" weight="bold" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">Intranet</span>
              <span className="text-xs text-muted-foreground">
                {tenant.name}
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
