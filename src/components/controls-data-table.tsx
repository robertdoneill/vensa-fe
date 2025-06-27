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
  IconPlayerPlay,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconClock,
  IconMessageCircle,
  IconFiles,
  IconTarget,
  IconCalendar,
} from "@tabler/icons-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { MoreHorizontal, Edit, Trash2, History } from "lucide-react"

interface Control {
  id: number
  name: string
  objective: string
  frequency: 'd' | 'w' | 'm' | 'q' | 'y'
  owner: {
    id: number
    name: string
  }
  criteria: string
  created_at: string
  updated_at: string
  workpaper_details: {
    id: number
    title: string
  }
  lastResult?: {
    id?: number
    status: string
    testDate: string
    tester: {
      id: number
      name: string
    }
    outcome: boolean
    metadata: string
  }
  commentCount: number
  evidenceCount: number
  status: string
}

interface ControlsDataTableProps {
  data: Control[]
  onRowClick: (control: Control) => void
  onRunTest?: (controlId: string | number) => void
}

const getTestTypeIcon = (testType: string) => {
  switch (testType) {
    case "sox":
      return <IconTarget className="h-4 w-4 text-red-600" />
    case "uar":
      return <IconCheck className="h-4 w-4 text-blue-600" />
    case "3wm":
      return <IconFiles className="h-4 w-4 text-green-600" />
    case "change_mgmt":
      return <IconClock className="h-4 w-4 text-purple-600" />
    case "custom":
      return <IconTarget className="h-4 w-4 text-orange-600" />
    default:
      return <IconTarget className="h-4 w-4 text-gray-600" />
  }
}

const getTestTypeLabel = (testType: string) => {
  const labels: Record<string, string> = {
    sox: "SOX",
    uar: "UAR",
    "3wm": "3-Way Match",
    change_mgmt: "Change Mgmt",
    custom: "Custom",
  }
  return labels[testType] || testType
}

const getFrequencyBadge = (frequency: string) => {
  const colors: Record<string, string> = {
    d: "bg-purple-100 text-purple-800",
    w: "bg-blue-100 text-blue-800", 
    m: "bg-cyan-100 text-cyan-800",
    q: "bg-green-100 text-green-800",
    y: "bg-orange-100 text-orange-800",
  }

  const labels: Record<string, string> = {
    d: "Daily",
    w: "Weekly",
    m: "Monthly", 
    q: "Quarterly",
    y: "Yearly"
  }
  
  return (
    <Badge variant="secondary" className={colors[frequency] || "bg-gray-100 text-gray-800"}>
      <IconCalendar className="h-3 w-3 mr-1" />
      {labels[frequency] || frequency}
    </Badge>
  )
}

const getResultBadge = (status: string) => {
  switch (status) {
    case "pass":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <IconCheck className="h-3 w-3 mr-1" />
          Pass
        </Badge>
      )
    case "fail":
      return (
        <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100">
          <IconX className="h-3 w-3 mr-1" />
          Fail
        </Badge>
      )
    case "exception":
      return (
        <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <IconAlertTriangle className="h-3 w-3 mr-1" />
          Exception
        </Badge>
      )
    default:
      return <Badge variant="secondary">Not Tested</Badge>
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          Active
        </Badge>
      )
    case "draft":
      return (
        <Badge variant="secondary">
          Draft
        </Badge>
      )
    case "inactive":
      return (
        <Badge variant="outline" className="text-gray-500">
          Inactive
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function ControlsDataTable({ data, onRowClick, onRunTest }: ControlsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const columns: ColumnDef<Control>[] = [
    {
      accessorKey: "name",
      header: "Control Test",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{row.getValue("name")}</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            {row.original.commentCount > 0 && (
              <div className="flex items-center space-x-1">
                <IconMessageCircle className="h-3 w-3" />
                <span>{row.original.commentCount}</span>
              </div>
            )}
            {row.original.evidenceCount > 0 && (
              <div className="flex items-center space-x-1">
                <IconFiles className="h-3 w-3" />
                <span>{row.original.evidenceCount}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "objective",
      header: "Objective",
      cell: ({ row }) => (
        <p className="text-sm text-muted-foreground truncate max-w-xs">
          {row.getValue("objective")}
        </p>
      ),
    },
    {
      accessorKey: "workpaper_details",
      header: "Workpaper",
      cell: ({ row }) => {
        const workpaper = row.getValue("workpaper_details") as Control["workpaper_details"]
        return (
          <Badge variant="outline">
            {workpaper.title}
          </Badge>
        )
      },
    },
    {
      accessorKey: "frequency",
      header: "Frequency",
      cell: ({ row }) => getFrequencyBadge(row.getValue("frequency")),
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => {
        const owner = row.getValue("owner") as Control["owner"]
        return (
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {owner.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">{owner.name}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "lastResult",
      header: "Last Run",
      cell: ({ row }) => {
        const lastResult = row.getValue("lastResult") as Control["lastResult"]
        if (!lastResult) {
          return <span className="text-sm text-muted-foreground">Never run</span>
        }
        
        return (
          <div className="text-sm">
            <div>{new Date(lastResult.testDate).toLocaleDateString()}</div>
            <div className="text-xs text-muted-foreground">
              by {lastResult.tester.name}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "result",
      header: "Result",
      cell: ({ row }) => {
        const lastResult = row.original.lastResult
        if (!lastResult) {
          return <Badge variant="outline" className="text-gray-500">Not tested</Badge>
        }
        return getResultBadge(lastResult.status)
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const control = row.original
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onRunTest && (
                <DropdownMenuItem onClick={() => onRunTest(control.id)}>
                  <IconPlayerPlay className="h-4 w-4 mr-2" />
                  Run Test
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <History className="h-4 w-4 mr-2" />
                View History
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconMessageCircle className="h-4 w-4 mr-2" />
                Comments ({control.commentCount})
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
                  No controls found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of{" "}
          {table.getCoreRowModel().rows.length} control(s)
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