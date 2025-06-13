import * as React from "react"
import { createFileRoute } from '@tanstack/react-router'
import { 
  IconSearch, 
  IconFilter, 
  IconCheck, 
  IconAlertCircle, 
  IconDeviceFloppy 
} from "@tabler/icons-react"

import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { FileUploadCard } from "@/components/file-upload-card"
import { CUECMappingTable } from "@/components/cuec-mapping-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

import cuecData from "@/data/cuec-mapping.json"

interface CUEC {
  id: string
  text: string
  category: string
  mappedControl: string
  comment: string
  status: "mapped" | "unmapped"
}

export const Route = createFileRoute('/cuec-mapping')({
  component: CUECMappingPage,
})

function CUECMappingPage() {
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null)
  const [cuecs, setCuecs] = React.useState<CUEC[]>(cuecData.extractedCUECs as CUEC[])
  const [filterStatus, setFilterStatus] = React.useState("all")
  const [searchTerm, setSearchTerm] = React.useState("")

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    // In a real implementation, this would extract CUECs from the file
    toast.success("File uploaded successfully", {
      description: `Processing ${file.name}...`,
    })
    
    // Simulate processing
    setTimeout(() => {
      toast.success("CUECs extracted", {
        description: `Found ${cuecs.length} CUECs in the report.`,
      })
    }, 2000)
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const updateCUECMapping = (cuecId: string, field: "mappedControl" | "comment", value: string) => {
    setCuecs(
      cuecs.map((cuec) => {
        if (cuec.id === cuecId) {
          const updated = { ...cuec, [field]: value }
          // Update status based on mapping
          if (field === "mappedControl") {
            updated.status = value ? "mapped" : "unmapped"
          }
          return updated
        }
        return cuec
      })
    )
  }

  const filteredCuecs = cuecs.filter((cuec) => {
    const matchesStatus = filterStatus === "all" || cuec.status === filterStatus
    const matchesSearch =
      cuec.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuec.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const mappedCount = cuecs.filter((cuec) => cuec.status === "mapped").length
  const totalCount = cuecs.length

  const handleSaveMapping = () => {
    toast.success("Mapping saved", {
      description: "CUEC mappings have been saved successfully.",
    })
    // In a real implementation, this would save to backend
  }

  return (
    <PageLayout title="CUEC Mapping">
      <PageHeader
        description="Link third-party controls to your internal control tests to meet SOC 2 requirements"
      />

      <div className="px-4 lg:px-6 space-y-6">
        {/* Upload Section */}
        <FileUploadCard
          onFileUpload={handleFileUpload}
          uploadedFile={uploadedFile}
          onRemoveFile={removeFile}
        />

        {/* Mapping Interface */}
        {uploadedFile && (
          <div className="space-y-6">
            {/* Stats and Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-sm">
                  <span className="font-medium">{mappedCount}</span> of{" "}
                  <span className="font-medium">{totalCount}</span> CUECs mapped
                </div>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                    <IconCheck className="h-3 w-3 mr-1" />
                    {mappedCount} Mapped
                  </Badge>
                  <Badge variant="outline" className="text-orange-700 border-orange-200">
                    <IconAlertCircle className="h-3 w-3 mr-1" />
                    {totalCount - mappedCount} Unmapped
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search CUECs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <IconFilter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="mapped">Mapped</SelectItem>
                    <SelectItem value="unmapped">Unmapped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mapping Table */}
            <CUECMappingTable
              cuecs={filteredCuecs}
              internalControlTests={cuecData.internalControlTests}
              onUpdateMapping={updateCUECMapping}
            />

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSaveMapping}>
                <IconDeviceFloppy className="h-4 w-4 mr-2" />
                Save Mapping
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}