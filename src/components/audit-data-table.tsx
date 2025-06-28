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
  IconFileText,
  IconCalendar,
  IconCheck,
  IconClock,
  IconFileCheck,
  IconAlertTriangle,
} from "@tabler/icons-react"
import { useNavigate } from "@tanstack/react-router"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { controlsApi } from "@/lib/api/controls"
import { workpapersApi } from "@/lib/api/workpapers"
import { exceptionsApi } from "@/lib/api/exceptions"

interface AuditTest {
  id: string | number
  controlName: string
  type: string
  status: "Draft" | "In Progress" | "Complete"
  exceptions: number
  assignedTo: string
  lastUpdated: string
  progress: number
}

interface AuditDataTableProps {
  data?: AuditTest[]
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Complete":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <IconCheck className="h-3 w-3 mr-1" />
          Complete
        </Badge>
      )
    case "In Progress":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <IconClock className="h-3 w-3 mr-1" />
          In Progress
        </Badge>
      )
    case "Draft":
      return (
        <Badge variant="secondary">
          <IconFileText className="h-3 w-3 mr-1" />
          Draft
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getTypeIcon = (type: string) => {
  const colors: Record<string, string> = {
    'UAR': 'text-blue-600',
    '3WM': 'text-green-600', 
    'ITGC': 'text-purple-600',
    'SOD': 'text-orange-600',
    'EUC': 'text-red-600',
    'SOX': 'text-purple-600',
  }
  return <IconFileCheck className={`h-4 w-4 ${colors[type] || 'text-gray-600'}`} />
}

export function AuditDataTable({ data: propData }: AuditDataTableProps) {
  const navigate = useNavigate()
  const [auditTests, setAuditTests] = React.useState<AuditTest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  React.useEffect(() => {
    const fetchAuditData = async () => {
      try {
        setIsLoading(true)
        
        // If prop data is provided, use it (for backward compatibility)
        if (propData && propData.length > 0) {
          setAuditTests(propData)
          setIsLoading(false)
          return
        }

        // Fetch real data from APIs
        const [controls, workpapers, exceptions] = await Promise.all([
          controlsApi.getControlTests(),
          workpapersApi.getWorkpapers(),
          exceptionsApi.getExceptionsWithCounts()
        ])

        // Transform data to match expected format
        const transformedData: AuditTest[] = [
          // Add control tests
          ...controls.slice(0, 5).map((control) => {
            const relatedExceptions = exceptions.filter(e => e.test_details.id === control.id)
            const relatedWorkpaper = workpapers.find(w => w.id === control.workpaper_details.id)
            
            let status: "Draft" | "In Progress" | "Complete" = "Draft"
            let progress = 0
            
            if (relatedWorkpaper) {
              if (relatedWorkpaper.status === 'finalized') {
                status = "Complete"
                progress = 100
              } else if (relatedWorkpaper.status === 'in_review') {
                status = "In Progress" 
                progress = 75
              } else {
                status = "Draft"
                progress = 25
              }
            }

            return {
              id: control.id,
              controlName: control.name,
              type: extractControlType(control.name),
              status,
              exceptions: relatedExceptions.length,
              assignedTo: control.owner.name,
              lastUpdated: new Date(control.updated_at).toLocaleDateString(),
              progress
            }
          }),
          // Add workpapers as audit tests
          ...workpapers.slice(0, 3).map((workpaper) => {
            const relatedExceptions = exceptions.filter(e => e.workpaper_details.id === workpaper.id)
            
            let status: "Draft" | "In Progress" | "Complete" = "Draft"
            let progress = 0
            
            if (workpaper.status === 'finalized') {
              status = "Complete"
              progress = 100
            } else if (workpaper.status === 'in_review') {
              status = "In Progress"
              progress = 65
            } else {
              status = "Draft"
              progress = 25
            }

            return {
              id: `WP-${workpaper.id}`,
              controlName: workpaper.title,
              type: "WP",
              status,
              exceptions: relatedExceptions.length,
              assignedTo: workpaper.organization.name,
              lastUpdated: new Date(workpaper.updated_at).toLocaleDateString(),
              progress
            }
          })
        ]

        setAuditTests(transformedData.slice(0, 8)) // Limit to 8 recent items
      } catch (error) {
        console.error('Failed to fetch audit data:', error)
        // Show empty state on error
        setAuditTests([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuditData()
  }, [propData])

  const extractControlType = (name: string): string => {
    // Extract type from control name
    if (name.toLowerCase().includes('user access')) return 'UAR'
    if (name.toLowerCase().includes('three') || name.toLowerCase().includes('3')) return '3WM'
    if (name.toLowerCase().includes('database') || name.toLowerCase().includes('itgc')) return 'ITGC'
    if (name.toLowerCase().includes('segregation') || name.toLowerCase().includes('sod')) return 'SOD'
    if (name.toLowerCase().includes('sox')) return 'SOX'
    return 'CTRL'
  }


  const handleRowClick = (auditTest: AuditTest) => {
    // Navigate based on the type of test
    if (typeof auditTest.id === 'string' && auditTest.id.startsWith('WP-')) {
      navigate({ to: '/workpapers' })
    } else {
      navigate({ to: '/controls' })
    }
  }

  const columns: ColumnDef<AuditTest>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {getTypeIcon(row.original.type)}
          <span className="font-medium">{row.getValue("id")}</span>
        </div>
      ),
    },
    {
      accessorKey: "controlName",
      header: "Control Test",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <div className="font-medium truncate">{row.getValue("controlName")}</div>
          <div className="text-sm text-muted-foreground">{row.original.type}</div>
        </div>
      ),
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
        const progress = row.original.progress
        return (
          <div className="flex items-center space-x-2 w-32">
            <Progress value={progress} className="h-2" />
            <span className="text-sm text-muted-foreground min-w-[3ch]">{progress}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: "exceptions",
      header: "Exceptions",
      cell: ({ row }) => {
        const exceptions = row.getValue("exceptions") as number
        return (
          <div className="flex items-center space-x-1">
            {exceptions > 0 ? (
              <IconAlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <IconCheck className="h-4 w-4 text-green-600" />
            )}
            <span className="text-sm">{exceptions}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {row.getValue<string>("assignedTo").split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{row.getValue("assignedTo")}</span>
        </div>
      ),
    },
    {
      accessorKey: "lastUpdated",
      header: "Last Updated",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <IconCalendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{row.getValue("lastUpdated")}</span>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: auditTests,
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
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  })

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Control Tests</CardTitle>
          <CardDescription>
            Latest activity across all audit areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading audit data...</p>
              </div>
            </div>
          ) : (
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
                          onClick={() => handleRowClick(row.original)}
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
                          <div className="text-center py-8">
                            <p className="text-muted-foreground mb-2">No audit tests found</p>
                            <p className="text-sm text-muted-foreground">Create control tests or workpapers to see data here</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {table.getFilteredRowModel().rows.length} of{" "}
                  {table.getCoreRowModel().rows.length} recent tests
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}