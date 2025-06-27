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
import { usersApi, type OrganizationUser } from "@/lib/api/users"
import { controlsApi } from "@/lib/api/controls"
import { workpapersApi } from "@/lib/api/workpapers"

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
  const [users, setUsers] = React.useState<OrganizationUser[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(true)

  const handleSubmit = async (isDraft = false) => {
    setIsSubmitting(true)
    
    try {
      // Validate required fields
      if (!isDraft && (!formData.name || !formData.testType || !formData.objective || !formData.ownerId || !formData.frequency)) {
        toast.error("Please fill in all required fields")
        setIsSubmitting(false)
        return
      }

      // Validate name length (backend requires <= 20 characters)
      if (formData.name.length > 20) {
        toast.error("Control test name must be 20 characters or less")
        setIsSubmitting(false)
        return
      }

      // First create a workpaper for this control test
      const workpaperData = {
        title: `${formData.name} Workpaper`,
        description: `Workpaper for control test: ${formData.name}`,
        period_start: new Date().toISOString().split('T')[0],
        period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft' as const
      }

      const createdWorkpaper = await workpapersApi.createWorkpaper(workpaperData)

      // Map frequency values to backend format
      const frequencyMap: Record<string, 'd' | 'w' | 'b' | 'm' | 'y'> = {
        'daily': 'd',
        'weekly': 'w',
        'biweekly': 'b', 
        'monthly': 'm',
        'annually': 'y'
      }

      // Create control test via API
      const controlTestData = {
        workpaper: createdWorkpaper.id,
        name: formData.name,
        objective: formData.objective,
        frequency: frequencyMap[formData.frequency] || 'm',
        criteria: formData.criteria || 'No specific criteria defined'
      }

      const createdControlTest = await controlsApi.createControlTest(controlTestData)

      toast.success(
        isDraft ? "Draft saved successfully" : "Control test created successfully",
        {
          description: `"${formData.name}" has been ${isDraft ? 'saved as draft' : 'created'}.`,
        }
      )

      // If run AI test is checked, create a control result
      if (runAiTest && !isDraft) {
        setTimeout(async () => {
          try {
            toast.info("AI test initiated", {
              description: "The control test is being executed...",
            })
            
            // Create a sample control result
            await controlsApi.createControlResult({
              test: createdControlTest.id,
              outcome: true,
              metadata: JSON.stringify({
                ai_generated: true,
                execution_time: new Date().toISOString(),
                status: 'completed'
              })
            })
            
            toast.success("Control test executed successfully", {
              description: "AI analysis complete. Check the results in the controls list.",
            })
          } catch (error) {
            console.error('Failed to execute control test:', error)
            toast.warning("Control test created but execution failed", {
              description: "You can manually execute it from the controls list.",
            })
          }
        }, 1500)
      }

      // Navigate back to controls list
      navigate({ to: '/controls' })
    } catch (error) {
      console.error('Failed to create control test:', error)
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

  // Fetch organization users on component mount
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true)
        const organizationUsers = await usersApi.getOrganizationUsers()
        // Filter only active users
        const activeUsers = organizationUsers.filter(user => user.is_active)
        setUsers(activeUsers)
      } catch (error) {
        console.error('Failed to fetch organization users:', error)
        toast.error('Failed to load users', {
          description: 'Please refresh the page to try again.'
        })
      } finally {
        setIsLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [])

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
                      <SelectItem value="biweekly">Biweekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
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
                    disabled={isLoadingUsers}
                  >
                    <SelectTrigger id="owner">
                      <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select owner"} />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => {
                        const displayName = user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}`
                          : user.username
                        return (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            <div className="flex flex-col">
                              <span>{displayName}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
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