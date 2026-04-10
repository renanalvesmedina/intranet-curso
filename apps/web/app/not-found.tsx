import Link from 'next/link'
import { House, ArrowLeft } from '@phosphor-icons/react/dist/ssr'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="rounded-full bg-muted p-6">
        <House className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Página não encontrada
        </p>
      </div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Dashboard
      </Link>
    </div>
  )
}
