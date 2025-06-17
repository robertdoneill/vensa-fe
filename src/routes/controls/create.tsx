import * as React from "react"
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { IconSparkles } from "@tabler/icons-react"

import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// Mock data for users - in real app, this would come from API
const users = [
  { id: "USR-001", name: "Jane Smith", email: "jane.smith@company.com" },
  { id: "USR-002", name: "Mike Johnson", email: "mike.johnson@company.com" },
  { id: "USR-003", name: "Sarah Davis", email: "sarah.davis@company.com" },
  { id: "USR-004", name: "Alex Chen", email: "alex.chen@company.com" },
  { id: "USR-005", name: "John Doe", email: "john.doe@company.com" },
]

interface FormData {
  name: string
  testType: string
  objective: string
  description: string
  frequency: string
  ownerId: string
  criteria: string
  successConditions: string
}

export const Route = createFileRoute('/controls/create')({
  component: CreateControlTestPage,
})

function CreateControlTestPage() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    testType: "",
    objective: "",
    description: "",
    frequency: "",
    ownerId: "",
    criteria: "",
    successConditions: "",
  })
  
  const [runAiTest, setRunAiTest] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (isDraft = false) => {
    setIsSubmitting(true)
    
    try {
      // Validate required fields
      if (!isDraft && (!formData.name || !formData.testType || !formData.objective || !formData.ownerId || !formData.frequency)) {
        toast.error("Please fill in all required fields")
        setIsSubmitting(false)
        return
      }

      // Simulate API call - in real app, this would POST to backend
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success(
        isDraft ? "Draft saved successfully" : "Control test created successfully",
        {
          description: `"${formData.name}" has been ${isDraft ? 'saved as draft' : 'created'}.`,
        }
      )

      // If run AI test is checked, show additional notification
      if (runAiTest && !isDraft) {
        setTimeout(() => {
          toast.info("AI test initiated", {
            description: "The control test is being executed...",
          })
        }, 1500)
      }

      // Navigate back to controls list
      navigate({ to: '/controls' })
    } catch (error) {
      toast.error("Failed to create control test", {
        description: "Please try again or contact support.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: '/controls' })
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <PageLayout title="Create Control Test">
      <PageHeader
        description="Define a new control test for compliance monitoring"
      />

      <div className="px-4 lg:px-6 pb-8">
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Section 1: Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core details about the control test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Control Test Name <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., SOX-404-Revenue Recognition"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-type">
                    Test Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.testType}
                    onValueChange={(value) => updateFormData('testType', value)}
                  >
                    <SelectTrigger id="test-type">
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uar">UAR (User Access Review)</SelectItem>
                      <SelectItem value="3wm">3-Way Match</SelectItem>
                      <SelectItem value="change_mgmt">Change Management</SelectItem>
                      <SelectItem value="sox">SOX Control</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="frequency">
                    Test Frequency <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => updateFormData('frequency', value)}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="How often to run" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner">
                    Control Owner <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.ownerId}
                    onValueChange={(value) => updateFormData('ownerId', value)}
                  >
                    <SelectTrigger id="owner">
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective">
                  Control Objective <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="objective"
                  placeholder="What is this control trying to achieve? (e.g., Ensure revenue is recognized in accordance with ASC 606)"
                  className="min-h-[80px] resize-none"
                  value={formData.objective}
                  onChange={(e) => updateFormData('objective', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about the control test (optional)"
                  className="min-h-[80px] resize-none"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Test Criteria */}
          <Card>
            <CardHeader>
              <CardTitle>Test Criteria</CardTitle>
              <CardDescription>Define what constitutes a successful test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="criteria">
                  Test Criteria <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="criteria"
                  placeholder="What specific criteria must be met? (e.g., All revenue transactions over $10K must have proper documentation)"
                  className="min-h-[100px] resize-none"
                  value={formData.criteria}
                  onChange={(e) => updateFormData('criteria', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="success-conditions">Success Conditions</Label>
                <Textarea
                  id="success-conditions"
                  placeholder="Define specific success metrics (e.g., 100% of samples must have approval documentation)"
                  className="min-h-[100px] resize-none"
                  value={formData.successConditions}
                  onChange={(e) => updateFormData('successConditions', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: AI Options */}
          <Card>
            <CardHeader>
              <CardTitle>AI Options</CardTitle>
              <CardDescription>Configure AI analysis for this control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="run-ai" 
                  checked={runAiTest}
                  onCheckedChange={(checked) => setRunAiTest(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="run-ai"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Run initial test after creation
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    AI will perform an initial test run once the control is created. You can upload evidence after creation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
            >
              {runAiTest ? (
                <>
                  <IconSparkles className="h-4 w-4 mr-2" />
                  Create & Run Test
                </>
              ) : (
                'Create Control Test'
              )}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}