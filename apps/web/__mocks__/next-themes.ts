import { vi } from 'vitest'

export const useTheme = () => ({
  theme: 'light',
  setTheme: vi.fn(),
  resolvedTheme: 'light',
  themes: ['light', 'dark', 'system'],
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => children
