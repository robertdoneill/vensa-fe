import * as React from "react"
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { IconPlus } from "@tabler/icons-react"

import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { FilterBar } from "@/components/filter-bar"
import { WorkpapersDataTable } from "@/components/workpapers-data-table"
import { WorkpaperDetailDrawer } from "@/components/workpaper-detail-drawer"
import { Button } from "@/components/ui/button"

import workpapersData from "@/data/workpapers.json"

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

export const Route = createFileRoute('/workpapers')({
  component: WorkpapersPage,
})

function WorkpapersPage() {
  const navigate = useNavigate()
  const [selectedWorkpaper, setSelectedWorkpaper] = React.useState<Workpaper | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [filteredData, setFilteredData] = React.useState(workpapersData)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [testTypeFilter, setTestTypeFilter] = React.useState("all")
  const [createdByFilter, setCreatedByFilter] = React.useState("all")

  const handleRowClick = (workpaper: Workpaper) => {
    setSelectedWorkpaper(workpaper)
    setIsDetailOpen(true)
  }

  React.useEffect(() => {
    let filtered = workpapersData

    if (searchQuery) {
      filtered = filtered.filter(
        (workpaper) =>
          workpaper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workpaper.controlTest.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((workpaper) => workpaper.status === statusFilter)
    }

    if (testTypeFilter !== "all") {
      filtered = filtered.filter((workpaper) =>
        workpaper.controlTest.toLowerCase().includes(testTypeFilter.toLowerCase())
      )
    }

    if (createdByFilter !== "all") {
      filtered = filtered.filter((workpaper) => workpaper.createdBy === createdByFilter)
    }

    setFilteredData(filtered)
  }, [searchQuery, statusFilter, testTypeFilter, createdByFilter])

  const filterConfigs = [
    {
      id: "status",
      placeholder: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "All Statuses" },
        { value: "Draft", label: "Draft" },
        { value: "In Review", label: "In Review" },
        { value: "Finalized", label: "Finalized" },
      ],
    },
    {
      id: "testType",
      placeholder: "Test Type",
      value: testTypeFilter,
      onChange: setTestTypeFilter,
      options: [
        { value: "all", label: "All Types" },
        { value: "uar", label: "UAR" },
        { value: "3wm", label: "3WM" },
        { value: "sox", label: "SOX" },
        { value: "cm", label: "Change Mgmt" },
      ],
    },
    {
      id: "createdBy",
      placeholder: "Created By",
      value: createdByFilter,
      onChange: setCreatedByFilter,
      options: [
        { value: "all", label: "All Users" },
        { value: "Jane Smith", label: "Jane Smith" },
        { value: "Mike Johnson", label: "Mike Johnson" },
        { value: "Sarah Davis", label: "Sarah Davis" },
        { value: "Alex Chen", label: "Alex Chen" },
        { value: "Lisa Wong", label: "Lisa Wong" },
      ],
    },
  ]

  return (
    <PageLayout title="Workpapers">
      <PageHeader
        description="Review and finalize control test documentation"
        actions={
          <Button onClick={() => navigate({ to: '/workpapers/generate' })}>
            <IconPlus className="h-4 w-4 mr-2" />
            Generate New Workpaper
          </Button>
        }
      />

      <div className="px-4 lg:px-6">
        <FilterBar
          searchPlaceholder="Search workpapers..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filterConfigs}
        />
      </div>

      <div className="px-4 lg:px-6">
        <WorkpapersDataTable data={filteredData} onRowClick={handleRowClick} />
      </div>

      <WorkpaperDetailDrawer
        workpaper={selectedWorkpaper}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </PageLayout>
  )
}