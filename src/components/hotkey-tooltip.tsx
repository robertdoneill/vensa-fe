"use client"

import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HotkeyTooltipProps {
  children: React.ReactNode
  keys: string[]
  delayDuration?: number
}

export function HotkeyTooltip({ 
  children, 
  keys, 
  delayDuration = 3000 
}: HotkeyTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-1">
          {keys.map((key, index) => (
            <React.Fragment key={key}>
              {index > 0 && (
                <span className="text-xs text-muted-foreground mx-0.5">then</span>
              )}
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