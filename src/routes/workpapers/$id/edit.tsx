import * as React from "react"
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react"

import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { workpapersApi } from "@/lib/api/workpapers"

export const Route = createFileRoute('/workpapers/$id/edit')({
  component: EditWorkpaperPage,
  loader: async ({ params }) => {
    const workpaper = await workpapersApi.getWorkpaper(parseInt(params.id))
    return { workpaper }
  }
})

function EditWorkpaperPage() {
  const navigate = useNavigate()
  const { workpaper } = Route.useLoaderData()
  
  const [formData, setFormData] = React.useState({
    title: workpaper.title,
    description: '',
    period_start: workpaper.period_start,
    period_end: workpaper.period_end,
    status: workpaper.status
  })
  
  const [isSaving, setIsSaving] = React.useState(false)

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      await workpapersApi.updateWorkpaper(workpaper.id, {
        title: formData.title,
        period_start: formData.period_start,
        period_end: formData.period_end,
        status: formData.status
      })

      toast.success(`Workpaper "${formData.title}" updated successfully`)
      
      // Navigate back to workpapers list
      navigate({ to: '/workpapers' })
    } catch (error) {
      console.error('Failed to update workpaper:', error)
      toast.error('Failed to update workpaper', {
        description: 'Please try again or contact support.'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: '/workpapers' })
  }

  return (
    <PageLayout title={`Edit Workpaper`}>
      <PageHeader
        description={`Edit workpaper: ${workpaper.title}`}
        actions={
          <Button variant="outline" onClick={handleCancel}>
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Back to Workpapers
          </Button>
        }
      />

      <div className="px-4 lg:px-6 pb-8">
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update the core details of this workpaper</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Workpaper Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Enter workpaper title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Enter workpaper description (optional)"
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="period-start">
                    Period Start <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="period-start"
                    type="date"
                    value={formData.period_start}
                    onChange={(e) => updateFormData('period_start', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period-end">
                    Period End <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="period-end"
                    type="date"
                    value={formData.period_end}
                    onChange={(e) => updateFormData('period_end', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="finalized">Finalized</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Workpaper Details */}
          <Card>
            <CardHeader>
              <CardTitle>Workpaper Details</CardTitle>
              <CardDescription>Additional information about this workpaper</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Workpaper ID</Label>
                  <Input value={workpaper.id} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Organization</Label>
                  <Input value={workpaper.organization.name} disabled />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Created Date</Label>
                  <Input value={new Date(workpaper.created_at).toLocaleDateString()} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Last Modified</Label>
                  <Input value={new Date(workpaper.updated_at).toLocaleDateString()} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <IconDeviceFloppy className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}