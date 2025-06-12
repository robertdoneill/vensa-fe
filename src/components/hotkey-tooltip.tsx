import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HotkeyTooltipProps {
  keys: string[]
  children: React.ReactNode
}

export function HotkeyTooltip({ keys, children }: HotkeyTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-1">
          <span>Press</span>
          {keys.map((key, index) => (
            <React.Fragment key={key}>
              {index > 0 && <span>+</span>}
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                {key}
              </kbd>
            </React.Fragment>
          ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}