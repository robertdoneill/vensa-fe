import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { KeyboardShortcutsProvider } from '@/components/keyboard-shortcuts-provider'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  component: () => (
    <KeyboardShortcutsProvider>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </KeyboardShortcutsProvider>
  ),
})
