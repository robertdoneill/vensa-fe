import {
  IconX,
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
} from "@tabler/icons-react"
import { useNavigate } from '@tanstack/react-router'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

interface WorkpaperDetailDrawerProps {
  workpaper: Workpaper | null
  isOpen: boolean
  onClose: () => void
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Finalized":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          Finalized
        </Badge>
      )
    case "In Review":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          In Review
        </Badge>
      )
    case "Draft":
      return <Badge variant="secondary">Draft</Badge>
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

export function WorkpaperDetailDrawer({ workpaper, isOpen, onClose }: WorkpaperDetailDrawerProps) {
  const navigate = useNavigate()
  
  if (!workpaper) return null

  const handleViewReport = () => {
    navigate({ to: `/workpapers/reports/${workpaper.id}` })
    onClose()
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center space-x-3">
              <IconFile className="h-6 w-6 text-muted-foreground" />
              <div>
                <div className="text-lg font-semibold">{workpaper.title}</div>
                <div className="text-sm text-muted-foreground">{workpaper.id}</div>
              </div>
            </DrawerTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <IconX className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <ScrollArea className="h-[calc(85vh-5rem)]">
          <div className="px-4 pb-6 space-y-6">
            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <IconFile className="h-4 w-4" />
                  <span>Control Test</span>
                </div>
                <div className="font-medium">{workpaper.controlTest}</div>
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
                  <span>Last Modified</span>
                </div>
                <div className="font-medium">{workpaper.lastModified}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {getStatusBadge(workpaper.status)}
              <div className="flex items-center space-x-2">
                <IconFiles className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{workpaper.evidenceCount} Evidence Files</span>
              </div>
            </div>

            <Separator />

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="findings">AI Findings</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="audit-trail">Audit Trail</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center space-x-2">
                      <IconFileText className="h-4 w-4" />
                      <span>Description</span>
                    </h4>
                    <p className="text-sm text-muted-foreground">{workpaper.description}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center space-x-2">
                      <IconTarget className="h-4 w-4" />
                      <span>Objective</span>
                    </h4>
                    <p className="text-sm text-muted-foreground">{workpaper.objective}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Criteria</h4>
                    <p className="text-sm text-muted-foreground">{workpaper.criteria}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="findings" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {workpaper.aiFindings.map((finding, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getFindingStatusIcon(finding.status)}
                          <h5 className="font-medium">{finding.step}</h5>
                        </div>
                        {getFindingStatusBadge(finding.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{finding.outcome}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm">{workpaper.comments}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="audit-trail" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {workpaper.auditTrail.map((entry, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <IconActivity className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">{entry.user}</span>
                          <span className="text-muted-foreground"> {entry.action}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{entry.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <Separator />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="outline">
                Export
              </Button>
              <Button variant="outline" onClick={handleViewReport}>
                <IconReportAnalytics className="h-4 w-4 mr-2" />
                View Report
              </Button>
              <Button>
                Edit Workpaper
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}