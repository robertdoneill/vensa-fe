import * as React from "react"
import { IconDownload, IconFileTypePdf, IconFileTypeXls, IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { workpapersApi } from "@/lib/api/workpapers"

interface WorkpaperExportButtonProps {
  workpaperId: number
  workpaperTitle: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function WorkpaperExportButton({ 
  workpaperId, 
  workpaperTitle, 
  variant = "outline",
  size = "default"
}: WorkpaperExportButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false)
  const [exportingFormat, setExportingFormat] = React.useState<'pdf' | 'xlsx' | null>(null)

  const handleExport = async (format: 'pdf' | 'xlsx') => {
    try {
      setIsExporting(true)
      setExportingFormat(format)
      
      toast.info(`Preparing ${format.toUpperCase()} export...`, {
        description: "This may take a few moments"
      })

      const blob = await workpapersApi.exportWorkpaperAsBlob(workpaperId, format)
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${workpaperTitle.replace(/[^a-z0-9]/gi, '_')}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(`${format.toUpperCase()} export completed`, {
        description: "File downloaded successfully"
      })
    } catch (error) {
      console.error('Export failed:', error)
      toast.error(`Failed to export ${format.toUpperCase()}`, {
        description: error instanceof Error ? error.message : "Export operation failed"
      })
    } finally {
      setIsExporting(false)
      setExportingFormat(null)
    }
  }

  const isExportingFormat = (format: 'pdf' | 'xlsx') => 
    isExporting && exportingFormat === format

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          disabled={isExporting}
        >
          {isExporting ? (
            <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <IconDownload className="h-4 w-4 mr-2" />
          )}
          {isExporting ? `Exporting ${exportingFormat?.toUpperCase()}...` : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
        >
          {isExportingFormat('pdf') ? (
            <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <IconFileTypePdf className="h-4 w-4 mr-2" />
          )}
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('xlsx')}
          disabled={isExporting}
        >
          {isExportingFormat('xlsx') ? (
            <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <IconFileTypeXls className="h-4 w-4 mr-2" />
          )}
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}