import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconUser,
  IconCalendar,
  IconLink,
} from "@tabler/icons-react"

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

interface Exception {
  id: string
  summary: string
  controlTest: string
  severity: string
  status: string
  assignedTo: string
  dateIdentified: string
  description: string
  linkedEvidence: Array<{
    name: string
    type: string
  }>
  rootCause: string
  comments: Array<{
    id: number
    user: string
    text: string
    timestamp: string
  }>
  auditTrail: Array<{
    action: string
    user: string
    date: string
  }>
}

interface ExceptionsDataTableProps {
  data: Exception[]
  onRowClick: (exception: Exception) => void
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "High":
      return <IconAlertCircle className="h-4 w-4 text-red-600" />
    case "Medium":
      return <IconAlertTriangle className="h-4 w-4 text-yellow-600" />
    case "Low":
      return <IconInfoCircle className="h-4 w-4 text-blue-600" />
    default:
      return <IconInfoCircle className="h-4 w-4 text-gray-600" />
  }
}

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "High":
      return (
        <Badge variant="destructive">
          High
        </Badge>
      )
    case "Medium":
      return (
        <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Medium
        </Badge>
      )
    case "Low":
      return (
        <Badge variant="secondary">
          Low
        </Badge>
      )
    default:
      return <Badge variant="secondary">{severity}</Badge>
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Open":
      return (
        <Badge variant="outline" className="text-gray-600 border-gray-300">
          Open
        </Badge>
      )
    case "In Progress":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          In Progress
        </Badge>
      )
    case "Resolved":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          Resolved
        </Badge>
      )
    case "Escalated":
      return (
        <Badge variant="default" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          Escalated
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getControlTestBadge = (controlTest: string) => {
  const type = controlTest.split('-')[0]
  const colors: Record<string, string> = {
    'SOX': 'bg-purple-100 text-purple-800',
    'UAR': 'bg-blue-100 text-blue-800',
    '3WM': 'bg-green-100 text-green-800',
    'CM': 'bg-orange-100 text-orange-800',
    'AP': 'bg-red-100 text-red-800',
  }
  return (
    <Badge variant="outline" className={`${colors[type] || 'bg-gray-100 text-gray-800'} border-0`}>
      {controlTest}
    </Badge>
  )
}

export function ExceptionsDataTable({ data, onRowClick }: ExceptionsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const columns: ColumnDef<Exception>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: "summary",
      header: "Summary",
      cell: ({ row }) => (
        <div className="max-w-md">
          <div className="flex items-start space-x-2">
            {getSeverityIcon(row.original.severity)}
            <span className="text-sm font-medium truncate">{row.getValue("summary")}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "controlTest",
      header: "Control Test",
      cell: ({ row }) => getControlTestBadge(row.getValue("controlTest")),
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => getSeverityBadge(row.getValue("severity")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <IconUser className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue("assignedTo")}</span>
        </div>
      ),
    },
    {
      accessorKey: "dateIdentified",
      header: "Date Identified",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <IconCalendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{row.getValue("dateIdentified")}</span>
        </div>
      ),
    },
    {
      id: "evidence",
      header: "Evidence",
      cell: ({ row }) => {
        const evidence = row.original.linkedEvidence
        return (
          <div className="flex items-center space-x-1">
            <IconLink className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{evidence.length}</span>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility,
    },
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No exceptions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of{" "}
          {table.getCoreRowModel().rows.length} exception(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}