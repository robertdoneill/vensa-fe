import * as React from "react"
import { createFileRoute } from '@tanstack/react-router'
import { IconPlus } from "@tabler/icons-react"

import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { FilterBar } from "@/components/filter-bar"
import { ExceptionsDataTable } from "@/components/exceptions-data-table"
import { ExceptionDetailDrawer } from "@/components/exception-detail-drawer"
import { Button } from "@/components/ui/button"

import exceptionsData from "@/data/exceptions.json"

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

export const Route = createFileRoute('/exceptions')({
  component: ExceptionsPage,
})

function ExceptionsPage() {
  const [selectedException, setSelectedException] = React.useState<Exception | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [filteredData, setFilteredData] = React.useState(exceptionsData)
  
  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [severityFilter, setSeverityFilter] = React.useState("all")
  const [assignedToFilter, setAssignedToFilter] = React.useState("all")
  const [controlTestFilter, setControlTestFilter] = React.useState("all")
  const [dateRangeFilter, setDateRangeFilter] = React.useState("all")

  const handleRowClick = (exception: Exception) => {
    setSelectedException(exception)
    setIsDetailOpen(true)
  }

  React.useEffect(() => {
    let filtered = exceptionsData

    if (searchQuery) {
      filtered = filtered.filter((exception) =>
        exception.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exception.controlTest.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((exception) => exception.status === statusFilter)
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter((exception) => exception.severity === severityFilter)
    }

    if (assignedToFilter !== "all") {
      filtered = filtered.filter((exception) => exception.assignedTo === assignedToFilter)
    }

    if (controlTestFilter !== "all") {
      filtered = filtered.filter((exception) => 
        exception.controlTest.toLowerCase().includes(controlTestFilter.toLowerCase())
      )
    }

    // For date range filter, you would implement date comparison logic here
    // This is a simplified version
    if (dateRangeFilter !== "all") {
      // Implementation would depend on your date filtering requirements
    }

    setFilteredData(filtered)
  }, [searchQuery, statusFilter, severityFilter, assignedToFilter, controlTestFilter, dateRangeFilter])

  const filterConfigs = [
    {
      id: "status",
      placeholder: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "All Status" },
        { value: "Open", label: "Open" },
        { value: "In Progress", label: "In Progress" },
        { value: "Resolved", label: "Resolved" },
        { value: "Escalated", label: "Escalated" },
      ],
    },
    {
      id: "severity",
      placeholder: "Severity",
      value: severityFilter,
      onChange: setSeverityFilter,
      options: [
        { value: "all", label: "All Severity" },
        { value: "High", label: "High" },
        { value: "Medium", label: "Medium" },
        { value: "Low", label: "Low" },
      ],
    },
    {
      id: "assignedTo",
      placeholder: "Assigned To",
      value: assignedToFilter,
      onChange: setAssignedToFilter,
      options: [
        { value: "all", label: "All Users" },
        { value: "Jane Smith", label: "Jane Smith" },
        { value: "Mike Johnson", label: "Mike Johnson" },
        { value: "Sarah Davis", label: "Sarah Davis" },
        { value: "Alex Chen", label: "Alex Chen" },
        { value: "John Doe", label: "John Doe" },
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
        { value: "sox", label: "SOX-404" },
        { value: "uar", label: "UAR-Q4" },
        { value: "cm", label: "CM-101" },
        { value: "3wm", label: "3WM-Q4" },
        { value: "ap", label: "AP-Q4" },
      ],
    },
    {
      id: "dateRange",
      placeholder: "Date Range",
      value: dateRangeFilter,
      onChange: setDateRangeFilter,
      options: [
        { value: "all", label: "All Time" },
        { value: "today", label: "Today" },
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" },
        { value: "quarter", label: "This Quarter" },
      ],
    },
  ]

  // Calculate summary stats
  const summaryStats = {
    total: exceptionsData.length,
    open: exceptionsData.filter(e => e.status === "Open").length,
    high: exceptionsData.filter(e => e.severity === "High").length,
    escalated: exceptionsData.filter(e => e.status === "Escalated").length,
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
              <span className="text-sm font-medium text-muted-foreground">High Severity</span>
              <span className="text-2xl font-bold text-red-600">{summaryStats.high}</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Escalated</span>
              <span className="text-2xl font-bold text-purple-600">{summaryStats.escalated}</span>
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
        <ExceptionsDataTable data={filteredData} onRowClick={handleRowClick} />
      </div>

      <ExceptionDetailDrawer
        exception={selectedException}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </PageLayout>
  )
}