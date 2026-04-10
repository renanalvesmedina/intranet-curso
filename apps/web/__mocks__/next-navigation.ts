import { vi } from 'vitest'

export const redirect = vi.fn()

export const usePathname = () => '/dashboard'

export const useRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
})

export const useSearchParams = () => new URLSearchParams()

export const useParams = () => ({})

export const notFound = vi.fn()
