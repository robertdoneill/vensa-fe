import { IconFileText, IconUpload, IconFileExport, IconAlertTriangle } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function QuickActions() {
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
        <Button variant="outline" className="h-auto flex-col gap-2 p-4">
          <IconFileText className="size-6" />
          <span className="text-sm">New Control Test</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 p-4">
          <IconUpload className="size-6" />
          <span className="text-sm">Upload Evidence</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 p-4">
          <IconFileExport className="size-6" />
          <span className="text-sm">Generate Workpaper</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 p-4">
          <IconAlertTriangle className="size-6" />
          <span className="text-sm">View Exceptions</span>
        </Button>
        </div>
      </Card>
    </div>
  )
}