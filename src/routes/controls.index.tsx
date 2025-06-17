import * as React from "react"
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { IconPlus } from "@tabler/icons-react"

import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { FilterBar } from "@/components/filter-bar"
import { ControlsDataTable } from "@/components/controls-data-table"
import { ControlDetailDrawer } from "@/components/control-detail-drawer"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import controlsData from "@/data/controls.json"

interface Control {
  id: string
  name: string
  objective: string
  frequency: string
  owner: {
    id: string
    name: string
    email: string
  }
  criteria: string
  testType: string
  createdAt: string
  updatedAt: string
  lastResult: {
    id: string
    status: string
    testDate: string
    tester: {
      id: string
      name: string
    }
  } | null
  commentCount: number
  evidenceCount: number
  status: string
}

export const Route = createFileRoute('/controls/')({
  component: ControlsPage,
})

function ControlsPage() {
  const navigate = useNavigate()
  const [controls] = React.useState(controlsData)
  const [selectedControl, setSelectedControl] = React.useState<Control | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [filteredData, setFilteredData] = React.useState(controls)
  
  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("")
  const [testTypeFilter, setTestTypeFilter] = React.useState("all")
  const [frequencyFilter, setFrequencyFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [ownerFilter, setOwnerFilter] = React.useState("all")

  const handleRowClick = (control: Control) => {
    setSelectedControl(control)
    setIsDetailOpen(true)
  }

  const handleRunTest = async (controlId: string) => {
    const control = controls.find(c => c.id === controlId)
    if (!control) return

    toast.info("Starting test execution", {
      description: `Running ${control.name}...`,
    })
    
    // Simulate test execution - in real app, this would POST to API
    setTimeout(() => {
      toast.success("Test completed", {
        description: "Control test has been executed successfully.",
      })
    }, 2000)
  }

  React.useEffect(() => {
    let filtered = controls

    if (searchQuery) {
      filtered = filtered.filter(control =>
        control.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        control.objective.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (testTypeFilter !== "all") {
      filtered = filtered.filter(control => control.testType === testTypeFilter)
    }

    if (frequencyFilter !== "all") {
      filtered = filtered.filter(control => control.frequency === frequencyFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(control => control.status === statusFilter)
    }

    if (ownerFilter !== "all") {
      filtered = filtered.filter(control => control.owner.id === ownerFilter)
    }

    setFilteredData(filtered)
  }, [controls, searchQuery, testTypeFilter, frequencyFilter, statusFilter, ownerFilter])

  const filterConfigs = [
    {
      id: "testType",
      placeholder: "Test Type",
      value: testTypeFilter,
      onChange: setTestTypeFilter,
      options: [
        { value: "all", label: "All Types" },
        { value: "sox", label: "SOX" },
        { value: "uar", label: "UAR" },
        { value: "3wm", label: "3-Way Match" },
        { value: "change_mgmt", label: "Change Mgmt" },
        { value: "custom", label: "Custom" },
      ],
    },
    {
      id: "frequency",
      placeholder: "Frequency",
      value: frequencyFilter,
      onChange: setFrequencyFilter,
      options: [
        { value: "all", label: "All Frequencies" },
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
        { value: "quarterly", label: "Quarterly" },
        { value: "annually", label: "Annually" },
      ],
    },
    {
      id: "status",
      placeholder: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "draft", label: "Draft" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      id: "owner",
      placeholder: "Owner",
      value: ownerFilter,
      onChange: setOwnerFilter,
      width: "w-[150px]",
      options: [
        { value: "all", label: "All Owners" },
        { value: "USR-001", label: "Jane Smith" },
        { value: "USR-002", label: "Mike Johnson" },
        { value: "USR-003", label: "Sarah Davis" },
        { value: "USR-004", label: "Alex Chen" },
        { value: "USR-005", label: "John Doe" },
      ],
    },
  ]

  return (
    <PageLayout title="Controls">
      <PageHeader
        description="Define and manage control tests for compliance"
        actions={
          <Button onClick={() => navigate({ to: '/controls/create' })}>
            <IconPlus className="h-4 w-4 mr-2" />
            Create Control
          </Button>
        }
      />

      <div className="px-4 lg:px-6">
        <FilterBar
          searchPlaceholder="Search controls..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filterConfigs}
        />
      </div>

      <div className="px-4 lg:px-6">
        <ControlsDataTable 
          data={filteredData} 
          onRowClick={handleRowClick}
          onRunTest={handleRunTest}
        />
      </div>

      <ControlDetailDrawer
        control={selectedControl}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </PageLayout>
  )
}