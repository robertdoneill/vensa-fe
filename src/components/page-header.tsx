import * as React from "react"

interface PageHeaderProps {
  title?: string
  description?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          {title && <h2 className="text-3xl font-bold tracking-tight">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
    </div>
  )
}