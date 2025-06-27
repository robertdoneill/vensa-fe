import * as React from "react"
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  IconArrowLeft,
  IconFile,
  IconUser,
  IconCalendar,
  IconFiles,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconActivity,
  IconFileText,
  IconTarget,
  IconReportAnalytics,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react"

import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkpaperExportButton } from "@/components/workpaper-export-button"
import { toast } from "sonner"

import { workpapersApi, type Workpaper } from "@/lib/api/workpapers"

// Extended interface for the detail page
interface WorkpaperWithDetails extends Workpaper {
  evidenceCount: number
  createdBy: string
  description?: string
  criteria?: string
  objective?: string
  controlTest?: string
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

export const Route = createFileRoute('/workpapers/$id')({
  component: WorkpaperDetailPage,
  loader: async ({ params }) => {
    const workpaper = await workpapersApi.getWorkpaper(parseInt(params.id))
    
    // Transform to include additional fields for UI
    const workpaperWithDetails: WorkpaperWithDetails = {
      ...workpaper,
      evidenceCount: 0, // TODO: Get actual evidence count
      createdBy: workpaper.organization.name,
      description: workpaper.description || '',
      criteria: '',
      objective: '',
      controlTest: '',
      aiFindings: [],
      comments: '',
      auditTrail: [
        {
          action: 'created workpaper',
          user: workpaper.organization.name,
          date: new Date(workpaper.created_at).toLocaleDateString()
        }
      ]
    }
    
    return { workpaper: workpaperWithDetails }
  }
})

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "finalized":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <IconCheck className="h-3 w-3 mr-1" />
          Finalized
        </Badge>
      )
    case "in_review":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <IconClock className="h-3 w-3 mr-1" />
          In Review
        </Badge>
      )
    case "draft":
      return (
        <Badge variant="secondary">
          <IconFileText className="h-3 w-3 mr-1" />
          Draft
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getFindingStatusIcon = (status: string) => {
  switch (status) {
    case "Complete":
      return <IconCheck className="h-4 w-4 text-green-600" />
    case "In Progress":
      return <IconClock className="h-4 w-4 text-blue-600" />
    case "Exception":
      return <IconAlertCircle className="h-4 w-4 text-red-600" />
    case "Pending":
      return <IconClock className="h-4 w-4 text-gray-400" />
    default:
      return <IconClock className="h-4 w-4 text-gray-400" />
  }
}

const getFindingStatusBadge = (status: string) => {
  switch (status) {
    case "Complete":
      return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Complete</Badge>
    case "In Progress":
      return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
    case "Exception":
      return <Badge variant="destructive">Exception</Badge>
    case "Pending":
      return <Badge variant="secondary">Pending</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function WorkpaperDetailPage() {
  const navigate = useNavigate()
  const { workpaper } = Route.useLoaderData()

  const handleEditWorkpaper = () => {
    navigate({ to: `/workpapers/${workpaper.id}/edit` })
  }

  const handleViewReport = () => {
    navigate({ to: `/workpapers/reports/${workpaper.id}` })
  }

  const handleBackToList = () => {
    navigate({ to: '/workpapers' })
  }

  return (
    <PageLayout title={`Workpaper: ${workpaper.title}`}>
      <PageHeader
        description={`Workpaper ID: ${workpaper.id}`}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleBackToList}>
              <IconArrowLeft className="h-4 w-4 mr-2" />
              Back to Workpapers
            </Button>
            <WorkpaperExportButton 
              workpaperId={workpaper.id}
              workpaperTitle={workpaper.title}
            />
            <Button variant="outline" onClick={handleViewReport}>
              <IconReportAnalytics className="h-4 w-4 mr-2" />
              View Report
            </Button>
            <Button onClick={handleEditWorkpaper}>
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Workpaper
            </Button>
          </div>
        }
      />

      <div className="px-4 lg:px-6 pb-8">
        <div className="space-y-6 max-w-6xl mx-auto">
          {/* Overview Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconFile className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-xl">{workpaper.title}</CardTitle>
                    <CardDescription>Workpaper Details</CardDescription>
                  </div>
                </div>
                {getStatusBadge(workpaper.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <IconFile className="h-4 w-4" />
                    <span>Control Test</span>
                  </div>
                  <div className="font-medium">{workpaper.controlTest || 'No control test linked'}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <IconUser className="h-4 w-4" />
                    <span>Created By</span>
                  </div>
                  <div className="font-medium">{workpaper.createdBy}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <IconCalendar className="h-4 w-4" />
                    <span>Period</span>
                  </div>
                  <div className="font-medium">
                    {new Date(workpaper.period_start).toLocaleDateString()} - {new Date(workpaper.period_end).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <IconFiles className="h-4 w-4" />
                    <span>Evidence Files</span>
                  </div>
                  <div className="font-medium">{workpaper.evidenceCount}</div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <IconCalendar className="h-4 w-4" />
                    <span>Created Date</span>
                  </div>
                  <div className="font-medium">{new Date(workpaper.created_at).toLocaleDateString()}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <IconCalendar className="h-4 w-4" />
                    <span>Last Modified</span>
                  </div>
                  <div className="font-medium">{new Date(workpaper.updated_at).toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="overview" className="w-full">
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="findings">AI Findings</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="audit-trail">Audit Trail</TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  <TabsContent value="overview" className="space-y-4 mt-0">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center space-x-2">
                          <IconFileText className="h-4 w-4" />
                          <span>Description</span>
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {workpaper.description || 'No description available'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center space-x-2">
                          <IconTarget className="h-4 w-4" />
                          <span>Objective</span>
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {workpaper.objective || 'No objective specified'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Criteria</h4>
                        <p className="text-sm text-muted-foreground">
                          {workpaper.criteria || 'No criteria specified'}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="findings" className="space-y-4 mt-0">
                    <div className="space-y-3">
                      {workpaper.aiFindings && workpaper.aiFindings.length > 0 ? (
                        workpaper.aiFindings.map((finding, index) => (
                          <Card key={index} className="border-l-4 border-l-primary/20">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  {getFindingStatusIcon(finding.status)}
                                  <h5 className="font-medium">{finding.step}</h5>
                                </div>
                                {getFindingStatusBadge(finding.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">{finding.outcome}</p>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <IconAlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No AI findings available for this workpaper</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="comments" className="space-y-4 mt-0">
                    <div className="space-y-3">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm">
                            {workpaper.comments || 'No comments available for this workpaper'}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="audit-trail" className="space-y-4 mt-0">
                    <div className="space-y-3">
                      {workpaper.auditTrail && workpaper.auditTrail.length > 0 ? (
                        workpaper.auditTrail.map((entry, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                            <IconActivity className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1 space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">{entry.user}</span>
                                <span className="text-muted-foreground"> {entry.action}</span>
                              </p>
                              <p className="text-xs text-muted-foreground">{entry.date}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <IconActivity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No audit trail available for this workpaper</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}