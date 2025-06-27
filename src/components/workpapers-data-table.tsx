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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { WorkpaperExportButton } from "@/components/workpaper-export-button"
import { workpapersApi } from "@/lib/api/workpapers"
import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Workpaper {
  id: number
  title: string
  organization: {
    id: number
    name: string
  }
  period_start: string
  period_end: string
  status: string
  created_at: string
  updated_at: string
  evidenceCount: number
  createdBy: string
  controlTest?: string
  description?: string
  criteria?: string
  objective?: string
}

interface WorkpapersDataTableProps {
  data: Workpaper[]
  onRowClick: (workpaper: Workpaper) => void
  onWorkpaperDeleted?: () => void
}

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "finalized":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <IconFileCheck className="h-3 w-3 mr-1" />
          Finalized
        </Badge>
      )
    case "in_review":
    case "in review":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          In Review
        </Badge>
      )
    case "draft":
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

const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate).toLocaleDateString()
  const end = new Date(endDate).toLocaleDateString()
  return `${start} - ${end}`
}

export function WorkpapersDataTable({ data, onRowClick, onWorkpaperDeleted }: WorkpapersDataTableProps) {
  const navigate = useNavigate()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [workpaperToDelete, setWorkpaperToDelete] = React.useState<Workpaper | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDeleteClick = (workpaper: Workpaper, e: React.MouseEvent) => {
    e.stopPropagation()
    setWorkpaperToDelete(workpaper)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!workpaperToDelete) return
    
    setIsDeleting(true)
    try {
      await workpapersApi.deleteWorkpaper(workpaperToDelete.id)
      toast.success(`Workpaper "${workpaperToDelete.title}" deleted successfully`)
      setDeleteDialogOpen(false)
      setWorkpaperToDelete(null)
      onWorkpaperDeleted?.()
    } catch (error) {
      console.error('Failed to delete workpaper:', error)
      toast.error('Failed to delete workpaper', {
        description: 'Please try again or contact support.'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditClick = (workpaper: Workpaper, e: React.MouseEvent) => {
    e.stopPropagation()
    navigate({ to: `/workpapers/${workpaper.id}/edit` })
  }

  const handleViewClick = (workpaper: Workpaper, e: React.MouseEvent) => {
    e.stopPropagation()
    navigate({ to: `/workpapers/${workpaper.id}` })
  }

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
          <div className="text-sm text-muted-foreground">
            {formatDateRange(row.original.period_start, row.original.period_end)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "organization",
      header: "Organization",
      cell: ({ row }) => {
        const org = row.getValue("organization") as Workpaper["organization"]
        return (
          <Badge variant="outline">
            {org.name}
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
      accessorKey: "period_start",
      header: "Period",
      cell: ({ row }) => (
        <div className="text-sm">
          {formatDateRange(row.original.period_start, row.original.period_end)}
        </div>
      ),
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
      accessorKey: "updated_at",
      header: "Last Modified",
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
        const workpaper = row.original
        
        return (
          <div className="flex items-center space-x-2">
            <WorkpaperExportButton 
              workpaperId={workpaper.id}
              workpaperTitle={workpaper.title}
              size="sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => handleViewClick(workpaper, e)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleEditClick(workpaper, e)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={(e) => handleDeleteClick(workpaper, e)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workpaper</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{workpaperToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Workpaper'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}