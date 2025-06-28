import * as React from "react"
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { 
  IconChevronDown,
  IconChevronUp,
  IconPlus,
  IconTrash,
  IconSparkles,
  IconFileText
} from "@tabler/icons-react"

import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"


// Types aligned with backend
interface WorkpaperSection {
  id: string
  sectionType: 'summary' | 'test_step' | 'conclusion' | 'exception'
  title: string
  content: string
  orderIndex: number
  testPerformed?: string
  resultSummary?: string
  outcome?: 'pass' | 'fail' | 'exception' | 'not_performed'
  isExpanded?: boolean
}


export const Route = createFileRoute('/workpapers/generate')({
  component: GenerateWorkpaperPage,
})

function GenerateWorkpaperPage() {
  const navigate = useNavigate()
  
  // Workpaper metadata
  const [title, setTitle] = React.useState("")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [selectedControlTests, setSelectedControlTests] = React.useState<string[]>([])
  const [reviewerId, setReviewerId] = React.useState("")
  const [status, setStatus] = React.useState<'draft' | 'in_review' | 'finalized'>('draft')
  const [users] = React.useState<any[]>([])
  const [isLoading] = React.useState(false)
  const [controlTests] = React.useState<any[]>([])
  
  // Workpaper sections
  const [sections, setSections] = React.useState<WorkpaperSection[]>([])
  
  const [reviewerNotes, setReviewerNotes] = React.useState("")
  const [exportFormat, setExportFormat] = React.useState("PDF")

  const toggleSectionExpansion = (sectionId: string) => {
    setSections(sections =>
      sections.map(section => 
        section.id === sectionId 
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    )
  }

  const updateSection = (sectionId: string, updates: Partial<WorkpaperSection>) => {
    setSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? { ...section, ...updates }
          : section
      )
    )
  }

  const addNewSection = (type: WorkpaperSection['sectionType']) => {
    const newSection: WorkpaperSection = {
      id: Date.now().toString(),
      sectionType: type,
      title: type === 'test_step' ? "New Test Step" : "New Section",
      content: "",
      orderIndex: sections.length,
      isExpanded: true,
      ...(type === 'test_step' && {
        testPerformed: "",
        resultSummary: "",
        outcome: "not_performed"
      })
    }
    setSections([...sections, newSection])
  }

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId))
  }

  const generateAISummary = async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (section?.testPerformed) {
      updateSection(sectionId, {
        resultSummary: "AI analysis indicates control is operating effectively with minor exceptions requiring follow-up."
      })
      toast.success("AI summary generated", {
        description: "Result summary has been updated with AI analysis.",
      })
    }
  }

  const handleSubmit = async (asDraft = false) => {
    try {
      if (!title || !startDate || !endDate) {
        toast.error("Please fill in all required fields")
        return
      }

      // In real implementation, would create workpaper via API
      console.log("Creating workpaper:", {
        title,
        periodStart: startDate,
        periodEnd: endDate,
        status: asDraft ? 'draft' : status,
        reviewerId: reviewerId,
        controlTestIds: selectedControlTests,
        sections: sections.map(({ isExpanded, ...section }) => section),
        reviewerNotes,
        exportFormat
      })

      toast.success(`Workpaper "${title}" created successfully`, {
        description: asDraft ? "Saved as draft" : "Ready for review",
      })

      navigate({ to: '/workpapers' })
    } catch (error) {
      toast.error("Failed to create workpaper", {
        description: "Please try again or contact support.",
      })
    }
  }

  const getOutcomeColor = (outcome?: string) => {
    switch (outcome) {
      case "pass":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "fail":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "exception":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "not_performed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }


  return (
    <PageLayout title="Generate Workpaper">
      <PageHeader
        description="Create comprehensive audit documentation from control test results"
      />

      <div className="px-4 lg:px-6 pb-8">
        <div className="space-y-6 max-w-6xl mx-auto">
          {/* Section 1: Workpaper Information */}
          <Card>
            <CardHeader>
              <CardTitle>Workpaper Information</CardTitle>
              <CardDescription>Basic details about this workpaper</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Workpaper Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Q4 2024 User Access Review Workpaper"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start-date">
                    Period Start <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">
                    Period End <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="reviewer">Reviewer</Label>
                  <Select value={reviewerId} onValueChange={setReviewerId}>
                    <SelectTrigger id="reviewer">
                      <SelectValue placeholder="Select reviewer" />
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
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
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
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Link Control Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Link Control Tests</CardTitle>
              <CardDescription>
                Select control tests to include in this workpaper
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading control tests...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {controlTests.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={selectedControlTests.includes(test.id.toString())}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedControlTests([...selectedControlTests, test.id.toString()])
                          } else {
                            setSelectedControlTests(
                              selectedControlTests.filter(id => id !== test.id.toString())
                            )
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{test.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {test.test_type?.toUpperCase() || 'CONTROL'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Owner: {test.owner?.name || 'Unassigned'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {test.objective || 'No objective specified'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Workpaper Sections */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Workpaper Sections</CardTitle>
                  <CardDescription>
                    Document findings and test results
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => addNewSection('test_step')}
                    variant="outline"
                    size="sm"
                  >
                    <IconPlus className="h-4 w-4 mr-2" />
                    Add Test Step
                  </Button>
                  <Button
                    onClick={() => addNewSection('summary')}
                    variant="outline"
                    size="sm"
                  >
                    <IconPlus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((section, index) => (
                  <Card key={section.id} className="border-l-4 border-l-primary/20">
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleSectionExpansion(section.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {section.sectionType.replace('_', ' ')}
                              </Badge>
                              {section.outcome && (
                                <Badge
                                  variant="outline"
                                  className={getOutcomeColor(section.outcome)}
                                >
                                  {section.outcome}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSection(section.id)
                            }}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                          {section.isExpanded ? (
                            <IconChevronUp className="h-4 w-4" />
                          ) : (
                            <IconChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    {section.isExpanded && (
                      <CardContent className="pt-0 space-y-4">
                        <div className="space-y-2">
                          <Label>Section Title</Label>
                          <Input
                            value={section.title}
                            onChange={(e) =>
                              updateSection(section.id, { title: e.target.value })
                            }
                          />
                        </div>

                        {section.sectionType === 'test_step' ? (
                          <>
                            <div className="space-y-2">
                              <Label>Test Performed</Label>
                              <Textarea
                                value={section.testPerformed || ''}
                                onChange={(e) =>
                                  updateSection(section.id, {
                                    testPerformed: e.target.value
                                  })
                                }
                                className="min-h-[80px] resize-none"
                                placeholder="Describe the test procedures performed..."
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label>Result Summary</Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => generateAISummary(section.id)}
                                  className="text-xs"
                                >
                                  <IconSparkles className="h-3 w-3 mr-1" />
                                  Generate with AI
                                </Button>
                              </div>
                              <Textarea
                                value={section.resultSummary || ''}
                                onChange={(e) =>
                                  updateSection(section.id, {
                                    resultSummary: e.target.value
                                  })
                                }
                                className="min-h-[80px] resize-none"
                                placeholder="Summarize the test results and findings..."
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Outcome</Label>
                              <Select
                                value={section.outcome}
                                onValueChange={(value) =>
                                  updateSection(section.id, {
                                    outcome: value as WorkpaperSection['outcome']
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pass">Pass</SelectItem>
                                  <SelectItem value="fail">Fail</SelectItem>
                                  <SelectItem value="exception">Exception</SelectItem>
                                  <SelectItem value="not_performed">
                                    Not Performed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea
                              value={section.content}
                              onChange={(e) =>
                                updateSection(section.id, { content: e.target.value })
                              }
                              className="min-h-[120px] resize-none"
                              placeholder="Enter section content..."
                            />
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
            </CardContent>
          </Card>

          {/* Section 4: Reviewer Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Reviewer Notes</CardTitle>
              <CardDescription>
                Add general comments about this workpaper
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="Add any additional comments, observations, or recommendations..."
                className="min-h-[120px] resize-none"
              />
            </CardContent>
          </Card>

          {/* Section 5: Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>
                Choose export format for the completed workpaper
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="export-format">Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger id="export-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF Document</SelectItem>
                    <SelectItem value="Excel">Excel Workbook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate({ to: '/workpapers' })}
            >
              Cancel
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSubmit(true)}
            >
              Save as Draft
            </Button>
            <Button onClick={() => handleSubmit(false)}>
              <IconFileText className="h-4 w-4 mr-2" />
              Create Workpaper
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}