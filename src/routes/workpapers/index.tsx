import * as React from "react"
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { IconPlus } from "@tabler/icons-react"

import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { FilterBar } from "@/components/filter-bar"
import { WorkpapersDataTable } from "@/components/workpapers-data-table"
import { Button } from "@/components/ui/button"

import { workpapersApi, type Workpaper as BaseWorkpaper } from "@/lib/api/workpapers"
import { toast } from "sonner"

interface Workpaper extends BaseWorkpaper {
  evidenceCount: number
  createdBy: string
  description?: string
  criteria?: string
  objective?: string
  controlTest?: string
}

export const Route = createFileRoute('/workpapers/')({
  component: WorkpapersPage,
})

function WorkpapersPage() {
  const navigate = useNavigate()
  const [workpapers, setWorkpapers] = React.useState<Workpaper[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [filteredData, setFilteredData] = React.useState<Workpaper[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [createdByFilter, setCreatedByFilter] = React.useState("all")

  // Load workpapers from API
  React.useEffect(() => {
    const loadWorkpapers = async () => {
      try {
        setIsLoading(true)
        const apiWorkpapers = await workpapersApi.getWorkpapers()
        
        // Transform API data to match UI expectations
        const transformedWorkpapers: Workpaper[] = apiWorkpapers.map((workpaper) => ({
          ...workpaper,
          evidenceCount: 0, // TODO: Get actual evidence count when evidence is linked to workpapers
          createdBy: workpaper.organization.name, // Using organization as placeholder for creator
          // Optional fields that might be added later
          description: workpaper.description || '',
          criteria: '',
          objective: '',
          controlTest: '',
          // Add missing arrays to prevent map errors
          aiFindings: [],
          comments: '',
          auditTrail: [
            {
              action: 'created workpaper',
              user: workpaper.organization.name,
              date: new Date(workpaper.created_at).toLocaleDateString()
            }
          ]
        }))
        
        setWorkpapers(transformedWorkpapers)
      } catch (error) {
        console.error('Failed to load workpapers:', error)
        toast.error('Failed to load workpapers')
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkpapers()
  }, [])

  const handleRowClick = (workpaper: Workpaper) => {
    navigate({ to: `/workpapers/${workpaper.id}` })
  }

  const handleWorkpaperDeleted = () => {
    // Refresh the workpapers list
    const loadWorkpapers = async () => {
      try {
        setIsLoading(true)
        const apiWorkpapers = await workpapersApi.getWorkpapers()
        
        // Transform API data to match UI expectations
        const transformedWorkpapers: Workpaper[] = apiWorkpapers.map((workpaper) => ({
          ...workpaper,
          evidenceCount: 0, // TODO: Get actual evidence count when evidence is linked to workpapers
          createdBy: workpaper.organization.name, // Using organization as placeholder for creator
          // Optional fields that might be added later
          description: workpaper.description || '',
          criteria: '',
          objective: '',
          controlTest: '',
          // Add missing arrays to prevent map errors
          aiFindings: [],
          comments: '',
          auditTrail: [
            {
              action: 'created workpaper',
              user: workpaper.organization.name,
              date: new Date(workpaper.created_at).toLocaleDateString()
            }
          ]
        }))
        
        setWorkpapers(transformedWorkpapers)
      } catch (error) {
        console.error('Failed to load workpapers:', error)
        toast.error('Failed to refresh workpapers')
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkpapers()
  }

  React.useEffect(() => {
    let filtered = workpapers

    if (searchQuery) {
      filtered = filtered.filter(
        (workpaper) =>
          workpaper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (workpaper.controlTest && workpaper.controlTest.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((workpaper) => workpaper.status === statusFilter)
    }

    if (createdByFilter !== "all") {
      filtered = filtered.filter((workpaper) => workpaper.createdBy === createdByFilter)
    }

    setFilteredData(filtered)
  }, [workpapers, searchQuery, statusFilter, createdByFilter])

  const filterConfigs = [
    {
      id: "status",
      placeholder: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "All Statuses" },
        { value: "draft", label: "Draft" },
        { value: "in_review", label: "In Review" },
        { value: "finalized", label: "Finalized" },
        // Add more status options based on your backend status values
      ],
    },
    {
      id: "createdBy",
      placeholder: "Organization",
      value: createdByFilter,
      onChange: setCreatedByFilter,
      options: [
        { value: "all", label: "All Organizations" },
        // Dynamically populated from actual workpaper organizations
        ...Array.from(new Set(workpapers.map(w => w.createdBy))).map(org => ({
          value: org,
          label: org
        }))
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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading workpapers...</p>
            </div>
          </div>
        ) : (
          <WorkpapersDataTable 
            data={filteredData} 
            onRowClick={handleRowClick} 
            onWorkpaperDeleted={handleWorkpaperDeleted}
          />
        )}
      </div>
    </PageLayout>
  )
}