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

import { controlsApi, type ControlTest } from "@/lib/api/controls"

// Extended interface with UI-specific fields
interface Control extends ControlTest {
  status?: string;
  noteCount?: number;
  evidenceCount?: number;
  commentCount?: number;
  lastResult?: any;
}

export const Route = createFileRoute('/controls/')({
  component: ControlsPage,
})

function ControlsPage() {
  const navigate = useNavigate()
  const [controls, setControls] = React.useState<Control[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedControl, setSelectedControl] = React.useState<Control | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [filteredData, setFilteredData] = React.useState<Control[]>([])
  
  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("")
  const [frequencyFilter, setFrequencyFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [ownerFilter, setOwnerFilter] = React.useState("all")

  // Load controls from API
  React.useEffect(() => {
    const loadControls = async () => {
      try {
        setIsLoading(true)
        const controlTests = await controlsApi.getControlTests()
        
        // Transform API data to match UI expectations
        const transformedControls: Control[] = await Promise.all(
          controlTests.map(async (test) => {
            // Get comments count for this test
            const comments = await controlsApi.getControlComments(test.id)
            
            // Get latest result for this test
            const results = await controlsApi.getControlResults(test.id)
            const latestResult = results.length > 0 
              ? results.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())[0]
              : undefined

            return {
              ...test,
              lastResult: latestResult ? {
                ...latestResult,
                status: latestResult.outcome ? 'pass' : 'fail',
                testDate: latestResult.created_at!,
                tester: {
                  id: test.owner.id,
                  name: test.owner.name
                }
              } : undefined,
              commentCount: comments.length,
              evidenceCount: 0, // TODO: Add evidence count when evidence is linked to controls
              status: 'active' // Default status, could be enhanced with actual status field
            }
          })
        )
        
        setControls(transformedControls)
      } catch (error) {
        console.error('Failed to load controls:', error)
        toast.error('Failed to load controls')
      } finally {
        setIsLoading(false)
      }
    }

    loadControls()
  }, [])

  const handleRowClick = (control: Control) => {
    setSelectedControl(control)
    setIsDetailOpen(true)
  }

  const handleRunTest = async (controlId: string | number) => {
    const control = controls.find(c => c.id === controlId)
    if (!control) return

    toast.info("Starting test execution", {
      description: `Running ${control.name}...`,
    })
    
    try {
      // Create a new control result
      await controlsApi.createControlResult({
        test: typeof controlId === 'string' ? parseInt(controlId) : controlId,
        outcome: true, // For demo purposes, always pass. In real app, this would be determined by test logic
        metadata: `Test executed on ${new Date().toISOString()}`
      })
      
      toast.success("Test completed", {
        description: "Control test has been executed successfully.",
      })
      
      // Reload controls to show the new result
      window.location.reload() // Simple refresh - could be optimized to just update the specific control
    } catch (error) {
      toast.error("Test execution failed", {
        description: "Failed to record test result.",
      })
    }
  }

  const handleDeleteControl = async (controlId: number) => {
    const control = controls.find(c => c.id === controlId)
    if (!control) return

    if (!confirm(`Are you sure you want to delete the control test "${control.name}"? This action cannot be undone.`)) {
      return
    }
    
    try {
      await controlsApi.deleteControlTest(controlId)
      
      toast.success("Control test deleted", {
        description: `"${control.name}" has been deleted successfully.`,
      })
      
      // Remove the control from the local state
      setControls(prevControls => prevControls.filter(c => c.id !== controlId))
    } catch (error) {
      console.error('Failed to delete control test:', error)
      toast.error("Failed to delete control test", {
        description: "Please try again or contact support.",
      })
    }
  }

  React.useEffect(() => {
    let filtered = controls

    if (searchQuery) {
      filtered = filtered.filter(control =>
        control.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        control.objective.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Note: Removed testType filter as it's not in the backend schema
    // Could be added back if testType is added to ControlTest model

    if (frequencyFilter !== "all") {
      filtered = filtered.filter(control => control.frequency === frequencyFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(control => (control.status || 'draft') === statusFilter)
    }

    if (ownerFilter !== "all") {
      filtered = filtered.filter(control => control.owner.id.toString() === ownerFilter)
    }

    setFilteredData(filtered)
  }, [controls, searchQuery, frequencyFilter, statusFilter, ownerFilter])

  const filterConfigs = [
    {
      id: "frequency",
      placeholder: "Frequency",
      value: frequencyFilter,
      onChange: setFrequencyFilter,
      options: [
        { value: "all", label: "All Frequencies" },
        { value: "d", label: "Daily" },
        { value: "w", label: "Weekly" },
        { value: "m", label: "Monthly" },
        { value: "q", label: "Quarterly" },
        { value: "y", label: "Yearly" },
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
        // Dynamically populated from actual control owners
        ...Array.from(new Set(controls.map(c => c.owner.id.toString()))).map(id => {
          const owner = controls.find(c => c.owner.id.toString() === id)?.owner
          return {
            value: id,
            label: owner?.name || `User ${id}`
          }
        })
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
            Create Control Test
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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading controls...</p>
            </div>
          </div>
        ) : (
          <ControlsDataTable 
            data={filteredData as any} 
            onRowClick={handleRowClick as any}
            onRunTest={handleRunTest}
            onDelete={handleDeleteControl}
          />
        )}
      </div>

      <ControlDetailDrawer
        control={selectedControl as any}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </PageLayout>
  )
}