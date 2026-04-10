import { Buildings } from '@phosphor-icons/react/dist/ssr'

export default function DepartamentosPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <div className="rounded-full bg-muted p-6">
        <Buildings className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Departamentos</h1>
        <p className="text-muted-foreground">
          Esta página será implementada no épico E06.
        </p>
      </div>
    </div>
  )
}
