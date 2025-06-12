"use client"

import { IconEye, IconFileExport, IconAlertTriangle, IconCircleCheck, IconClock } from "@tabler/icons-react"

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

interface AuditTest {
  id: string
  controlName: string
  type: string
  status: "Draft" | "In Progress" | "Complete"
  exceptions: number
  assignedTo: string
  lastUpdated: string
  progress: number
}

interface AuditDataTableProps {
  data: AuditTest[]
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Complete":
      return <IconCircleCheck className="size-4 text-green-600" />
    case "In Progress":
      return <IconClock className="size-4 text-blue-600" />
    case "Draft":
      return <IconClock className="size-4 text-gray-400" />
    default:
      return <IconClock className="size-4 text-gray-400" />
  }
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Complete":
      return "default"
    case "In Progress":
      return "secondary"
    case "Draft":
      return "outline"
    default:
      return "outline"
  }
}

export function AuditDataTable({ data }: AuditDataTableProps) {
  return (
    <div className="px-4 lg:px-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Recent Control Test Activity</h3>
        <p className="text-sm text-muted-foreground">
          Latest control testing progress and status updates
        </p>
      </div>
      
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Control Test</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Exceptions</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{test.controlName}</span>
                    <span className="text-xs text-muted-foreground">{test.id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {test.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    <Badge variant={getStatusVariant(test.status)} className="text-xs">
                      {test.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {test.exceptions > 0 ? (
                    <div className="flex items-center justify-center gap-1">
                      <IconAlertTriangle className="size-4 text-red-500" />
                      <span className="font-medium text-red-600">{test.exceptions}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </TableCell>
                <TableCell>{test.assignedTo}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(test.lastUpdated).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <IconEye className="size-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <IconFileExport className="size-4" />
                      <span className="sr-only">Export</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}