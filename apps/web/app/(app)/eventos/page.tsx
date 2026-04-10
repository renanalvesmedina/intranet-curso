import { Calendar } from '@phosphor-icons/react/dist/ssr'

export default function EventosPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <div className="rounded-full bg-muted p-6">
        <Calendar className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Eventos</h1>
        <p className="text-muted-foreground">
          Esta página será implementada no épico E07.
        </p>
      </div>
    </div>
  )
}
