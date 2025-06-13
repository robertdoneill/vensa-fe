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
  IconFileTypeDocx,
  IconFileTypePdf,
  IconFileTypeXls,
  IconMail,
  IconPhoto,
  IconZip,
  IconPlayerPlay,
  IconCheck,
  IconClock,
  IconExclamationCircle,
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

interface Evidence {
  id: string
  fileName: string
  fileType: string
  uploader: {
    id: string
    name: string
    email: string
  }
  uploadedDate: string
  status: string
  fileSize: string
  tags: string[]
  linkedControlTests: Array<{
    id: string
    name: string
    type: string
  }>
  parsedEvidence?: {
    id: string
    hasExtractedTables: boolean
    extractedText?: string
    tableCount?: number
  }
}

interface EvidenceDataTableProps {
  data: Evidence[]
  onRowClick: (evidence: Evidence) => void
  onParse: (evidenceId: string) => void
}

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case "excel":
      return <IconFileTypeXls className="h-4 w-4 text-green-600" />
    case "pdf":
      return <IconFileTypePdf className="h-4 w-4 text-red-600" />
    case "email":
      return <IconMail className="h-4 w-4 text-blue-600" />
    case "image":
      return <IconPhoto className="h-4 w-4 text-purple-600" />
    case "zip":
      return <IconZip className="h-4 w-4 text-yellow-600" />
    default:
      return <IconFile className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "parsed":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <IconCheck className="h-3 w-3 mr-1" />
          Parsed
        </Badge>
      )
    case "processing":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <IconClock className="h-3 w-3 mr-1" />
          Processing
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="secondary">
          <IconClock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    case "error":
      return (
        <Badge variant="destructive">
          <IconExclamationCircle className="h-3 w-3 mr-1" />
          Error
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function EvidenceDataTable({ data, onRowClick, onParse }: EvidenceDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const columns: ColumnDef<Evidence>[] = [
    {
      accessorKey: "fileName",
      header: "File Name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {getFileIcon(row.original.fileType)}
          <span className="font-medium truncate max-w-xs">{row.getValue("fileName")}</span>
        </div>
      ),
    },
    {
      accessorKey: "fileSize",
      header: "Size",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.getValue("fileSize")}</span>
      ),
    },
    {
      accessorKey: "uploader",
      header: "Uploaded By",
      cell: ({ row }) => {
        const uploader = row.getValue("uploader") as Evidence["uploader"]
        return (
          <div className="text-sm">
            <div className="font-medium">{uploader.name}</div>
            <div className="text-muted-foreground">{uploader.email}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "uploadedDate",
      header: "Upload Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("uploadedDate"))
        return (
          <span className="text-sm text-muted-foreground">
            {date.toLocaleDateString()}
          </span>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.getValue("tags") as string[]
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "linkedControlTests",
      header: "Linked Tests",
      cell: ({ row }) => {
        const tests = row.getValue("linkedControlTests") as Evidence["linkedControlTests"]
        if (tests.length === 0) {
          return <span className="text-muted-foreground text-sm">None</span>
        }
        return (
          <div className="max-w-xs">
            <span className="text-sm">{tests[0].name}</span>
            {tests.length > 1 && (
              <span className="text-muted-foreground text-sm"> +{tests.length - 1}</span>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const evidence = row.original
        const canParse = evidence.status === "pending" || evidence.status === "error"
        
        return (
          <div className="flex items-center space-x-2">
            {canParse && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onParse(evidence.id)
                }}
              >
                <IconPlayerPlay className="h-3 w-3 mr-1" />
                Parse
              </Button>
            )}
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
                  No evidence found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of{" "}
          {table.getCoreRowModel().rows.length} file(s)
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