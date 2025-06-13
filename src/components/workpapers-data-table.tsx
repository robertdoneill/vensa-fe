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
  IconFile,
  IconUser,
  IconCalendar,
  IconFileCheck,
  IconFiles,
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
import { Progress } from "@/components/ui/progress"

interface Workpaper {
  id: string
  title: string
  controlTest: string
  status: string
  lastModified: string
  evidenceCount: number
  createdBy: string
  description: string
  criteria: string
  objective: string
  aiFindings: Array<{
    step: string
    outcome: string
    status: string
  }>
  comments: string
  auditTrail: Array<{
    action: string
    user: string
    date: string
  }>
}

interface WorkpapersDataTableProps {
  data: Workpaper[]
  onRowClick: (workpaper: Workpaper) => void
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Finalized":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <IconFileCheck className="h-3 w-3 mr-1" />
          Finalized
        </Badge>
      )
    case "In Review":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          In Review
        </Badge>
      )
    case "Draft":
      return (
        <Badge variant="secondary">
          Draft
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getTestTypeBadge = (controlTest: string) => {
  const type = controlTest.split('-')[0]
  const colors: Record<string, string> = {
    'SOX': 'bg-purple-100 text-purple-800',
    'UAR': 'bg-blue-100 text-blue-800',
    '3WM': 'bg-green-100 text-green-800',
    'CM': 'bg-orange-100 text-orange-800',
    'FC': 'bg-red-100 text-red-800',
  }
  return (
    <Badge variant="outline" className={`${colors[type] || 'bg-gray-100 text-gray-800'} border-0`}>
      {type}
    </Badge>
  )
}

const getCompletionPercentage = (workpaper: Workpaper) => {
  const totalSteps = workpaper.aiFindings.length
  if (totalSteps === 0) return 0
  
  const completedSteps = workpaper.aiFindings.filter(
    finding => finding.status === "Complete"
  ).length
  
  return Math.round((completedSteps / totalSteps) * 100)
}

export function WorkpapersDataTable({ data, onRowClick }: WorkpapersDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const columns: ColumnDef<Workpaper>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <IconFile className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("id")}</span>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <div className="font-medium truncate">{row.getValue("title")}</div>
          <div className="text-sm text-muted-foreground">{row.original.controlTest}</div>
        </div>
      ),
    },
    {
      accessorKey: "controlTest",
      header: "Type",
      cell: ({ row }) => getTestTypeBadge(row.getValue("controlTest")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      id: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const percentage = getCompletionPercentage(row.original)
        return (
          <div className="flex items-center space-x-2 w-32">
            <Progress value={percentage} className="h-2" />
            <span className="text-sm text-muted-foreground min-w-[3ch]">{percentage}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: "evidenceCount",
      header: "Evidence",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <IconFiles className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue("evidenceCount")}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdBy",
      header: "Owner",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <IconUser className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue("createdBy")}</span>
        </div>
      ),
    },
    {
      accessorKey: "lastModified",
      header: "Last Modified",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <IconCalendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{row.getValue("lastModified")}</span>
        </div>
      ),
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
                  No workpapers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of{" "}
          {table.getCoreRowModel().rows.length} workpaper(s)
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