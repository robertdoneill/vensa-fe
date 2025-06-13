import * as React from "react"
import { createFileRoute } from '@tanstack/react-router'
import { IconUpload } from "@tabler/icons-react"

import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { FilterBar } from "@/components/filter-bar"
import { EvidenceDataTable } from "@/components/evidence-data-table"
import { EvidenceDetailDrawer } from "@/components/evidence-detail-drawer"
import { EvidenceUploadDialog } from "@/components/evidence-upload-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import evidenceData from "@/data/evidence.json"

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

export const Route = createFileRoute('/evidence')({
  component: EvidencePage,
})

function EvidencePage() {
  const [evidence, setEvidence] = React.useState(evidenceData)
  const [selectedEvidence, setSelectedEvidence] = React.useState<Evidence | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isUploadOpen, setIsUploadOpen] = React.useState(false)
  const [filteredData, setFilteredData] = React.useState(evidence)
  
  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("")
  const [fileTypeFilter, setFileTypeFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [linkedTestFilter, setLinkedTestFilter] = React.useState("all")

  const handleRowClick = (evidenceItem: Evidence) => {
    setSelectedEvidence(evidenceItem)
    setIsDetailOpen(true)
  }

  const handleUpload = async (files: FileList) => {
    toast.success(`Uploading ${files.length} file(s)...`)
    setIsUploadOpen(false)
    
    // Simulate upload - in real app, this would POST to API
    setTimeout(() => {
      toast.success("Files uploaded successfully!")
    }, 2000)
  }

  const handleParse = async (evidenceId: string) => {
    setEvidence(prev => prev.map(item => 
      item.id === evidenceId ? { ...item, status: "processing" } : item
    ))
    
    toast.info("Parsing started", {
      description: "File is being processed...",
    })

    // Simulate parsing completion
    setTimeout(() => {
      setEvidence(prev => prev.map(item => 
        item.id === evidenceId ? { 
          ...item, 
          status: "parsed",
          parsedEvidence: {
            id: `PE-${Date.now()}`,
            hasExtractedTables: item.fileType === "excel",
            tableCount: item.fileType === "excel" ? 3 : 0
          }
        } : item
      ))
      toast.success("Parsing complete", {
        description: "File has been successfully parsed.",
      })
    }, 3000)
  }

  React.useEffect(() => {
    let filtered = evidence

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (fileTypeFilter !== "all") {
      filtered = filtered.filter(item => item.fileType === fileTypeFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    if (linkedTestFilter !== "all") {
      if (linkedTestFilter === "unlinked") {
        filtered = filtered.filter(item => item.linkedControlTests.length === 0)
      } else {
        filtered = filtered.filter(item =>
          item.linkedControlTests.some(ct => ct.id === linkedTestFilter)
        )
      }
    }

    setFilteredData(filtered)
  }, [evidence, searchQuery, fileTypeFilter, statusFilter, linkedTestFilter])

  const filterConfigs = [
    {
      id: "fileType",
      placeholder: "File Type",
      value: fileTypeFilter,
      onChange: setFileTypeFilter,
      options: [
        { value: "all", label: "All Types" },
        { value: "excel", label: "Excel" },
        { value: "pdf", label: "PDF" },
        { value: "email", label: "Email" },
        { value: "image", label: "Image" },
        { value: "zip", label: "Archive" },
      ],
    },
    {
      id: "status",
      placeholder: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "All Status" },
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "parsed", label: "Parsed" },
        { value: "error", label: "Error" },
      ],
    },
    {
      id: "linkedTest",
      placeholder: "Linked Test",
      value: linkedTestFilter,
      onChange: setLinkedTestFilter,
      width: "w-[180px]",
      options: [
        { value: "all", label: "All Tests" },
        { value: "unlinked", label: "Unlinked" },
        { value: "CT-001", label: "SOX-404-Revenue Recognition" },
        { value: "CT-002", label: "UAR-Q4-Access Controls" },
        { value: "CT-003", label: "3WM-Q4-Three Way Match" },
        { value: "CT-004", label: "CM-101-Change Management" },
        { value: "CT-005", label: "FC-Q4-Financial Close" },
      ],
    },
  ]

  return (
    <PageLayout title="Evidence">
      <PageHeader
        description="Upload, manage, and link evidence to control tests"
        actions={
          <Button onClick={() => setIsUploadOpen(true)}>
            <IconUpload className="h-4 w-4 mr-2" />
            Upload Evidence
          </Button>
        }
      />

      <div className="px-4 lg:px-6">
        <FilterBar
          searchPlaceholder="Search files..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filterConfigs}
        />
      </div>

      <div className="px-4 lg:px-6">
        <EvidenceDataTable 
          data={filteredData} 
          onRowClick={handleRowClick}
          onParse={handleParse}
        />
      </div>

      <EvidenceDetailDrawer
        evidence={selectedEvidence}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <EvidenceUploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUpload={handleUpload}
      />
    </PageLayout>
  )
}