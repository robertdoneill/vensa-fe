import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { KeyboardShortcutsProvider } from '@/components/keyboard-shortcuts-provider'

export const Route = createRootRoute({
  component: () => (
    <KeyboardShortcutsProvider>
      <Outlet />
      <TanStackRouterDevtools />
    </KeyboardShortcutsProvider>
  ),
})
