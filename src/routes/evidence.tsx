import * as React from "react"
import { createFileRoute, redirect } from '@tanstack/react-router'

import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EvidenceUpload } from "@/components/evidence/evidence-upload"
import { EvidenceList } from "@/components/evidence/evidence-list"
import { authService } from '@/lib/api/auth'

export const Route = createFileRoute('/evidence')({
  beforeLoad: () => {
    // Redirect to login if not authenticated
    if (!authService.isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: EvidencePage,
})

function EvidencePage() {
  const [activeTab, setActiveTab] = React.useState('upload')
  const [refreshKey, setRefreshKey] = React.useState(0)

  const handleUploadSuccess = () => {
    // Refresh the evidence list after successful upload
    setRefreshKey(prev => prev + 1)
    setActiveTab('manage')
  }

  return (
    <PageLayout title="Evidence">
      <PageHeader
        description="Upload, manage, and link evidence to control tests"
      />

      <div className="px-4 lg:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="upload">Upload Evidence</TabsTrigger>
            <TabsTrigger value="manage">Manage Evidence</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-6">
            <div className="max-w-2xl">
              <EvidenceUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          </TabsContent>
          
          <TabsContent value="manage" className="mt-6">
            <EvidenceList key={refreshKey} />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}