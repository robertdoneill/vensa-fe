import * as React from "react"
import {
  IconX,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconUser,
  IconCalendar,
  IconFile,
  IconMessage,
  IconActivity,
  IconFileText,
  IconBulb,
} from "@tabler/icons-react"

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
import { Textarea } from "@/components/ui/textarea"

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

interface ExceptionDetailDrawerProps {
  exception: Exception | null
  isOpen: boolean
  onClose: () => void
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "High":
      return <IconAlertCircle className="h-5 w-5 text-red-600" />
    case "Medium":
      return <IconAlertTriangle className="h-5 w-5 text-yellow-600" />
    case "Low":
      return <IconInfoCircle className="h-5 w-5 text-blue-600" />
    default:
      return <IconInfoCircle className="h-5 w-5 text-gray-600" />
  }
}

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "High":
      return <Badge variant="destructive">High Severity</Badge>
    case "Medium":
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Severity</Badge>
    case "Low":
      return <Badge variant="secondary">Low Severity</Badge>
    default:
      return <Badge variant="secondary">{severity}</Badge>
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Open":
      return <Badge variant="outline" className="text-gray-600 border-gray-300">Open</Badge>
    case "In Progress":
      return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
    case "Resolved":
      return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>
    case "Escalated":
      return <Badge variant="default" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Escalated</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getFileTypeBadge = (type: string) => {
  const colors: Record<string, string> = {
    'PDF': 'bg-red-100 text-red-800',
    'Excel': 'bg-green-100 text-green-800',
  }
  return (
    <Badge variant="outline" className={`${colors[type] || 'bg-gray-100 text-gray-800'} border-0 text-xs`}>
      {type}
    </Badge>
  )
}

export function ExceptionDetailDrawer({ exception, isOpen, onClose }: ExceptionDetailDrawerProps) {
  const [newComment, setNewComment] = React.useState("")

  if (!exception) return null

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center space-x-3">
              {getSeverityIcon(exception.severity)}
              <div>
                <div className="text-lg font-semibold">{exception.summary}</div>
                <div className="text-sm text-muted-foreground">{exception.id}</div>
              </div>
            </DrawerTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <IconX className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <ScrollArea className="h-[calc(85vh-5rem)]">
          <div className="px-4 pb-6 space-y-6">
            {/* Exception Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <IconFile className="h-4 w-4" />
                  <span>Control Test</span>
                </div>
                <div className="font-medium">{exception.controlTest}</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <IconUser className="h-4 w-4" />
                  <span>Assigned To</span>
                </div>
                <div className="font-medium">{exception.assignedTo}</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <IconCalendar className="h-4 w-4" />
                  <span>Date Identified</span>
                </div>
                <div className="font-medium">{exception.dateIdentified}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {getStatusBadge(exception.status)}
              {getSeverityBadge(exception.severity)}
            </div>

            <Separator />

            {/* Tabs Section */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="audit-trail">Audit Trail</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center space-x-2">
                      <IconFileText className="h-4 w-4" />
                      <span>Description</span>
                    </h4>
                    <p className="text-sm text-muted-foreground">{exception.description}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center space-x-2">
                      <IconBulb className="h-4 w-4" />
                      <span>Root Cause</span>
                    </h4>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm">{exception.rootCause}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="evidence" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Linked Evidence ({exception.linkedEvidence.length})</h4>
                  <div className="space-y-2">
                    {exception.linkedEvidence.map((evidence, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <IconFile className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{evidence.name}</span>
                          {getFileTypeBadge(evidence.type)}
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {exception.comments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <IconMessage className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{comment.user}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                      {comment.id !== exception.comments[exception.comments.length - 1].id && <Separator />}
                    </div>
                  ))}
                  
                  <div className="space-y-2 pt-4">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex justify-end">
                      <Button size="sm" disabled={!newComment.trim()}>
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="audit-trail" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {exception.auditTrail.map((entry, index) => (
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
            <div className="flex justify-between">
              <div className="flex space-x-2">
                {exception.status === "Open" && (
                  <Button variant="outline" size="sm">
                    Start Work
                  </Button>
                )}
                {exception.status === "In Progress" && (
                  <>
                    <Button variant="outline" size="sm">
                      Mark Resolved
                    </Button>
                    <Button variant="outline" size="sm">
                      Escalate
                    </Button>
                  </>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}