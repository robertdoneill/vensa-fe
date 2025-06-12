"use client"

import * as React from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  IconDashboard,
  IconFileDescription,
  IconFolder,
  IconListDetails,
  IconReport,
  IconMap,
  IconSettings,
  IconSearch,
  IconKeyboard,
  IconLayoutSidebar,
  IconUpload,
} from "@tabler/icons-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

interface CommandPaletteProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const navigate = useNavigate()

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [setOpen])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/dashboard' }))}
            className="flex items-center gap-2"
          >
            <IconDashboard className="size-4" />
            <span>Dashboard</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">G</kbd>
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">D</kbd>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/workpapers' }))}
            className="flex items-center gap-2"
          >
            <IconFileDescription className="size-4" />
            <span>Workpapers</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">G</kbd>
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">W</kbd>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/evidence' }))}
            className="flex items-center gap-2"
          >
            <IconFolder className="size-4" />
            <span>Evidence</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">G</kbd>
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">E</kbd>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/controls' }))}
            className="flex items-center gap-2"
          >
            <IconListDetails className="size-4" />
            <span>Controls</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">G</kbd>
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">C</kbd>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/exceptions' }))}
            className="flex items-center gap-2"
          >
            <IconReport className="size-4" />
            <span>Exceptions</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">G</kbd>
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">X</kbd>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/cuec-mapping' }))}
            className="flex items-center gap-2"
          >
            <IconMap className="size-4" />
            <span>CUEC Mapping</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">G</kbd>
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">M</kbd>
            </div>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Create">
          <CommandItem
            onSelect={() => runCommand(() => console.log('New Control Test'))}
            className="flex items-center gap-2"
          >
            <IconListDetails className="size-4" />
            <span>New Control Test</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">N</kbd>
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">C</kbd>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => console.log('New Workpaper'))}
            className="flex items-center gap-2"
          >
            <IconFileDescription className="size-4" />
            <span>New Workpaper</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">N</kbd>
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">W</kbd>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => console.log('Upload Evidence'))}
            className="flex items-center gap-2"
          >
            <IconUpload className="size-4" />
            <span>Upload Evidence</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">N</kbd>
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">E</kbd>
            </div>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="System">
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/settings' }))}
            className="flex items-center gap-2"
          >
            <IconSettings className="size-4" />
            <span>Settings</span>
            <div className="ml-auto text-xs text-muted-foreground">
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">⌘ .</kbd>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => console.log('Global Search'))}
            className="flex items-center gap-2"
          >
            <IconSearch className="size-4" />
            <span>Global Search</span>
            <div className="ml-auto text-xs text-muted-foreground">
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">⌘ K</kbd>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => console.log('Toggle Sidebar'))}
            className="flex items-center gap-2"
          >
            <IconLayoutSidebar className="size-4" />
            <span>Toggle Sidebar</span>
            <div className="ml-auto text-xs text-muted-foreground">
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">⌘ B</kbd>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => console.log('Show Shortcuts'))}
            className="flex items-center gap-2"
          >
            <IconKeyboard className="size-4" />
            <span>Show Keyboard Shortcuts</span>
            <div className="ml-auto text-xs text-muted-foreground">
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">⌘ /</kbd>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}