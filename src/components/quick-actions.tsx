import { IconFileText, IconUpload, IconFileExport, IconAlertTriangle } from "@tabler/icons-react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function QuickActions() {
  const navigate = useNavigate()

  const handleNewControlTest = () => {
    navigate({ to: '/controls' })
    toast.info("Navigate to Controls page to create a new control test")
  }

  const handleUploadEvidence = () => {
    navigate({ to: '/evidence' })
    toast.info("Navigate to Evidence page to upload files")
  }

  const handleGenerateWorkpaper = () => {
    navigate({ to: '/workpapers' })
    toast.info("Navigate to Workpapers page to generate new workpaper")
  }

  const handleViewExceptions = () => {
    navigate({ to: '/exceptions' })
    toast.info("Navigate to Exceptions page to view and manage exceptions")
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common audit tasks and workflows
          </CardDescription>
        </CardHeader>
        <div className="grid grid-cols-2 gap-4 px-6 pb-6 md:grid-cols-4">
          <Button 
            variant="outline" 
            className="h-auto flex-col gap-2 p-4 hover:bg-accent"
            onClick={handleNewControlTest}
          >
            <IconFileText className="size-6" />
            <span className="text-sm">New Control Test</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col gap-2 p-4 hover:bg-accent"
            onClick={handleUploadEvidence}
          >
            <IconUpload className="size-6" />
            <span className="text-sm">Upload Evidence</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col gap-2 p-4 hover:bg-accent"
            onClick={handleGenerateWorkpaper}
          >
            <IconFileExport className="size-6" />
            <span className="text-sm">Generate Workpaper</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col gap-2 p-4 hover:bg-accent"
            onClick={handleViewExceptions}
          >
            <IconAlertTriangle className="size-6" />
            <span className="text-sm">View Exceptions</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}