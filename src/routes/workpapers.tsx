import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from "@/components/app-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconEye, IconEdit, IconDownload } from "@tabler/icons-react"

import workpapersData from "@/data/workpapers-data.json"

export const Route = createFileRoute('/workpapers')({
  component: Workpapers,
})

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Done":
      return "default"
    case "In Process":
      return "secondary"
    default:
      return "outline"
  }
}

function Workpapers() {
  return (
    <AppLayout>
      <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Workpaper Management</h3>
            <p className="text-sm text-muted-foreground">
              Track and manage audit workpaper completion status
            </p>
          </div>
          
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Header</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Limit</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workpapersData.map((workpaper) => (
                  <TableRow key={workpaper.id}>
                    <TableCell className="font-medium">{workpaper.id}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="truncate font-medium">{workpaper.header}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {workpaper.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(workpaper.status)} className="text-xs">
                        {workpaper.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{workpaper.target}</TableCell>
                    <TableCell className="text-center">{workpaper.limit}</TableCell>
                    <TableCell>{workpaper.reviewer}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <IconEye className="size-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <IconEdit className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <IconDownload className="size-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      </div>
    </AppLayout>
  )
}