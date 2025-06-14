import * as React from "react"
import { useNavigate } from "@tanstack/react-router"
import { useHotkeys } from "react-hotkeys-hook"
import { CommandPalette } from "@/components/command-palette"

interface KeyboardShortcutsProviderProps {
  children: React.ReactNode
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  const navigate = useNavigate()
  const [commandOpen, setCommandOpen] = React.useState(false)

  // Navigation shortcuts - using callback to ensure navigation happens
  useHotkeys('g+d', () => {
    console.log('Navigating to dashboard')
    navigate({ to: '/dashboard' })
  }, { preventDefault: true })
  
  useHotkeys('g+w', () => {
    console.log('Navigating to workpapers')
    navigate({ to: '/workpapers' })
  }, { preventDefault: true })
  
  useHotkeys('g+e', () => {
    console.log('Hotkey g+e triggered - Navigating to evidence')
    navigate({ to: '/evidence' })
  }, { preventDefault: true })
  
  useHotkeys('g+c', () => {
    console.log('Hotkey g+c triggered - Navigating to controls')
    navigate({ to: '/controls' })
  }, { preventDefault: true })
  
  useHotkeys('g+x', () => {
    console.log('Hotkey g+x triggered - Navigating to exceptions')
    navigate({ to: '/exceptions' })
  }, { preventDefault: true })
  
  useHotkeys('g+m', () => {
    console.log('Hotkey g+m triggered - Navigating to cuec-mapping')
    navigate({ to: '/cuec-mapping' })
  }, { preventDefault: true })

  // Command palette shortcuts
  useHotkeys('meta+k,ctrl+k', () => setCommandOpen(true), { preventDefault: true })
  useHotkeys('meta+shift+p,ctrl+shift+p', () => setCommandOpen(true), { preventDefault: true })

  // Quick create shortcuts
  useHotkeys('n+c', () => console.log('New Control Test'), { preventDefault: true })
  useHotkeys('n+w', () => console.log('New Workpaper'), { preventDefault: true })
  useHotkeys('n+e', () => console.log('Upload Evidence'), { preventDefault: true })

  // System shortcuts
  useHotkeys('meta+period,ctrl+period', () => navigate({ to: '/settings' }), { preventDefault: true })
  useHotkeys('meta+slash,ctrl+slash', () => console.log('Show keyboard shortcuts'), { preventDefault: true })

  // Search shortcut
  useHotkeys('/', (event) => {
    event.preventDefault()
    setCommandOpen(true)
  })

  // Sidebar toggle (handled by the sidebar component itself via Cmd+B)

  return (
    <>
      {children}
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />
    </>
  )
}