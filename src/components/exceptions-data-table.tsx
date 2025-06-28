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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, MessageSquare, Settings } from "lucide-react"

interface Exception {
  id: number
  test_details: {
    id: number
    name: string
  }
  workpaper_details: {
    id: number
    title: string
  }
  created_at: string
  updated_at: string
  noteCount: number
  remediationCount: number
  status: 'open' | 'in_progress' | 'resolved'
  severity?: string
  assignedTo?: string
  description?: string
}

interface ExceptionsDataTableProps {
  data: Exception[]
  onRowClick: (exception: Exception) => void
}



const getStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return (
        <Badge variant="outline" className="text-gray-600 border-gray-300">
          Open
        </Badge>
      )
    case "in_progress":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          In Progress
        </Badge>
      )
    case "resolved":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          Resolved
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}


export function ExceptionsDataTable({ data, onRowClick }: ExceptionsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const columns: ColumnDef<Exception>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-medium">EXC-{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: "test_details",
      header: "Control Test",
      cell: ({ row }) => {
        const testDetails = row.getValue("test_details") as Exception["test_details"]
        return (
          <div className="max-w-md">
            <span className="text-sm font-medium truncate">{testDetails.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "workpaper_details",
      header: "Workpaper",
      cell: ({ row }) => {
        const workpaperDetails = row.getValue("workpaper_details") as Exception["workpaper_details"]
        return (
          <Badge variant="outline">
            {workpaperDetails.title}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "noteCount",
      header: "Notes",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <IconLink className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue("noteCount")}</span>
        </div>
      ),
    },
    {
      accessorKey: "remediationCount",
      header: "Remediations",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <IconLink className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue("remediationCount")}</span>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Date Created",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <IconCalendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date(row.getValue("created_at")).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "updated_at",
      header: "Last Updated",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <IconCalendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date(row.getValue("updated_at")).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const exception = row.original
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="h-4 w-4 mr-2" />
                Manage Notes ({exception.noteCount})
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Manage Remediations ({exception.remediationCount})
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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