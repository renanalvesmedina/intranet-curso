'use client'

import { useRole } from '@/contexts/role-context'
import { ROLE_LIST, type Role } from '@/lib/roles'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function RoleSelector() {
  const { role, setRole } = useRole()

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg border bg-card p-3 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          DEV: Papel
        </span>
        <Select value={role} onValueChange={(v) => setRole(v as Role)}>
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLE_LIST.map((r) => (
              <SelectItem key={r.id} value={r.id} className="text-xs">
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
