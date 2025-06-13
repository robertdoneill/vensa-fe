import {
  IconTarget,
  IconX,
  IconCalendar,
  IconUser,
  IconCheck,
  IconAlertTriangle,
  IconClock,
  IconMessageCircle,
  IconFiles,
  IconPlayerPlay,
  IconHistory,
  IconFileText,
} from "@tabler/icons-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"

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

interface ControlDetailDrawerProps {
  control: Control | null
  isOpen: boolean
  onClose: () => void
}

const getTestTypeIcon = (testType: string) => {
  switch (testType) {
    case "sox":
      return <IconTarget className="h-6 w-6 text-red-600" />
    case "uar":
      return <IconCheck className="h-6 w-6 text-blue-600" />
    case "3wm":
      return <IconFiles className="h-6 w-6 text-green-600" />
    case "change_mgmt":
      return <IconClock className="h-6 w-6 text-purple-600" />
    case "custom":
      return <IconTarget className="h-6 w-6 text-orange-600" />
    default:
      return <IconTarget className="h-6 w-6 text-gray-600" />
  }
}

const getTestTypeLabel = (testType: string) => {
  const labels: Record<string, string> = {
    sox: "SOX",
    uar: "User Access Review",
    "3wm": "Three-Way Match",
    change_mgmt: "Change Management",
    custom: "Custom Control",
  }
  return labels[testType] || testType
}

const getFrequencyBadge = (frequency: string) => {
  const colors: Record<string, string> = {
    daily: "bg-purple-100 text-purple-800",
    weekly: "bg-blue-100 text-blue-800",
    monthly: "bg-cyan-100 text-cyan-800",
    quarterly: "bg-green-100 text-green-800",
    annually: "bg-orange-100 text-orange-800",
  }
  
  return (
    <Badge variant="secondary" className={colors[frequency] || "bg-gray-100 text-gray-800"}>
      <IconCalendar className="h-3 w-3 mr-1" />
      {frequency}
    </Badge>
  )
}

const getResultBadge = (status: string) => {
  switch (status) {
    case "pass":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <IconCheck className="h-3 w-3 mr-1" />
          Pass
        </Badge>
      )
    case "fail":
      return (
        <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100">
          <IconX className="h-3 w-3 mr-1" />
          Fail
        </Badge>
      )
    case "exception":
      return (
        <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <IconAlertTriangle className="h-3 w-3 mr-1" />
          Exception
        </Badge>
      )
    default:
      return <Badge variant="secondary">Not Tested</Badge>
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          Active
        </Badge>
      )
    case "draft":
      return <Badge variant="secondary">Draft</Badge>
    case "inactive":
      return (
        <Badge variant="outline" className="text-gray-500">
          Inactive
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function ControlDetailDrawer({ control, isOpen, onClose }: ControlDetailDrawerProps) {
  if (!control) return null

  const createdDate = new Date(control.createdAt)
  const updatedDate = new Date(control.updatedAt)

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center space-x-3">
              {getTestTypeIcon(control.testType)}
              <span className="truncate">{control.name}</span>
            </DrawerTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <IconX className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-6 overflow-y-auto">
          {/* Control Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Control Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <IconTarget className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Type:</span>
                  <span className="text-sm">{getTestTypeLabel(control.testType)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <IconCalendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Frequency:</span>
                  {getFrequencyBadge(control.frequency)}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  {getStatusBadge(control.status)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <IconUser className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Owner:</span>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">
                        {control.owner.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <div>{control.owner.name}</div>
                      <div className="text-muted-foreground">{control.owner.email}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <IconCalendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Created:</span>
                  <span className="text-sm">
                    {createdDate.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <IconCalendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Updated:</span>
                  <span className="text-sm">
                    {updatedDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Objective */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <IconTarget className="h-5 w-5" />
              <span>Objective</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {control.objective}
            </p>
          </div>

          <Separator />

          {/* Success Criteria */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <IconFileText className="h-5 w-5" />
              <span>Success Criteria</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {control.criteria}
            </p>
          </div>

          <Separator />

          {/* Last Test Result */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <IconHistory className="h-5 w-5" />
              <span>Last Test Result</span>
            </h3>
            {control.lastResult ? (
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Result:</span>
                    {getResultBadge(control.lastResult.status)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(control.lastResult.testDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <IconUser className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tested by:</span>
                  <span className="text-sm">{control.lastResult.tester.name}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">This control has never been tested.</p>
            )}
          </div>

          <Separator />

          {/* Engagement Metrics */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Engagement</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <IconMessageCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">{control.commentCount}</div>
                  <div className="text-sm text-muted-foreground">Comments</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <IconFiles className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">{control.evidenceCount}</div>
                  <div className="text-sm text-muted-foreground">Evidence Files</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <Separator />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline">
              <IconHistory className="h-4 w-4 mr-2" />
              View History
            </Button>
            <Button>
              <IconPlayerPlay className="h-4 w-4 mr-2" />
              Run Test
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}