import * as React from "react"
import { createFileRoute } from '@tanstack/react-router'
import { IconPlus } from "@tabler/icons-react"

import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { FilterBar } from "@/components/filter-bar"
import { ExceptionsDataTable } from "@/components/exceptions-data-table"
import { ExceptionDetailDrawer } from "@/components/exception-detail-drawer"
import { Button } from "@/components/ui/button"

import { exceptionsApi, type Exception as BaseException } from "@/lib/api/exceptions"
import { toast } from "sonner"

// Extended interface with UI-specific fields
interface Exception extends BaseException {
  status?: 'open' | 'in_progress' | 'resolved';
  noteCount?: number;
  remediationCount?: number;
  severity?: string;
  assignedTo?: string;
  description?: string;
}

export const Route = createFileRoute('/exceptions')({
  component: ExceptionsPage,
})

function ExceptionsPage() {
  const [exceptions, setExceptions] = React.useState<Exception[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedException, setSelectedException] = React.useState<Exception | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [filteredData, setFilteredData] = React.useState<Exception[]>([])
  
  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [controlTestFilter, setControlTestFilter] = React.useState("all")

  // Load exceptions from API
  React.useEffect(() => {
    const loadExceptions = async () => {
      try {
        setIsLoading(true)
        const apiExceptions = await exceptionsApi.getExceptionsWithCounts()
        
        // The API already returns the data with counts and status, just add optional UI fields
        const transformedExceptions: Exception[] = apiExceptions.map((exception) => ({
          ...exception,
          // Add optional UI fields that might be added later
          severity: undefined,
          assignedTo: undefined,
          description: undefined
        }))
        
        setExceptions(transformedExceptions)
      } catch (error) {
        console.error('Failed to load exceptions:', error)
        toast.error('Failed to load exceptions')
      } finally {
        setIsLoading(false)
      }
    }

    loadExceptions()
  }, [])

  const handleRowClick = (exception: Exception) => {
    setSelectedException(exception)
    setIsDetailOpen(true)
  }

  React.useEffect(() => {
    let filtered = exceptions

    if (searchQuery) {
      filtered = filtered.filter((exception) =>
        exception.test_details.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exception.workpaper_details.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((exception) => exception.status === statusFilter)
    }

    if (controlTestFilter !== "all") {
      filtered = filtered.filter((exception) => 
        exception.test_details.name.toLowerCase().includes(controlTestFilter.toLowerCase())
      )
    }

    setFilteredData(filtered)
  }, [exceptions, searchQuery, statusFilter, controlTestFilter])

  const filterConfigs = [
    {
      id: "status",
      placeholder: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "All Status" },
        { value: "open", label: "Open" },
        { value: "in_progress", label: "In Progress" },
        { value: "resolved", label: "Resolved" },
      ],
    },
    {
      id: "controlTest",
      placeholder: "Control Test",
      value: controlTestFilter,
      onChange: setControlTestFilter,
      width: "w-[150px]",
      options: [
        { value: "all", label: "All Tests" },
        // Dynamically populated from actual control tests
        ...Array.from(new Set(exceptions.map(e => e.test_details.name))).map(testName => ({
          value: testName.toLowerCase(),
          label: testName
        }))
      ],
    },
  ]

  // Calculate summary stats
  const summaryStats = {
    total: exceptions.length,
    open: exceptions.filter(e => e.status === "open").length,
    inProgress: exceptions.filter(e => e.status === "in_progress").length,
    resolved: exceptions.filter(e => e.status === "resolved").length,
  }

  return (
    <PageLayout title="Exceptions">
      <PageHeader
        description="Manage and resolve control test exceptions"
        actions={
          <Button>
            <IconPlus className="h-4 w-4 mr-2" />
            Add Exception
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="px-4 lg:px-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Total Exceptions</span>
              <span className="text-2xl font-bold">{summaryStats.total}</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Open</span>
              <span className="text-2xl font-bold text-gray-600">{summaryStats.open}</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">In Progress</span>
              <span className="text-2xl font-bold text-blue-600">{summaryStats.inProgress}</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Resolved</span>
              <span className="text-2xl font-bold text-green-600">{summaryStats.resolved}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <FilterBar 
          searchPlaceholder="Search exceptions..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filterConfigs} 
        />
      </div>

      <div className="px-4 lg:px-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading exceptions...</p>
            </div>
          </div>
        ) : (
          <ExceptionsDataTable data={filteredData as any} onRowClick={handleRowClick as any} />
        )}
      </div>

      <ExceptionDetailDrawer
        exception={selectedException as any}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </PageLayout>
  )
}