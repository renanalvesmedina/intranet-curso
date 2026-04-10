import { Gear } from '@phosphor-icons/react/dist/ssr'

export default function AdminPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <div className="rounded-full bg-muted p-6">
        <Gear className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Administração global</h1>
        <p className="text-muted-foreground">
          Gestão multi-tenant da plataforma. Visível apenas para papel Master.
        </p>
      </div>
    </div>
  )
}
