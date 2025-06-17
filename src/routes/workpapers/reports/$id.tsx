import * as React from "react"
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Printer,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  FileText,
  Eye,
  Link,
  Bot,
  History,
  Loader2,
} from "lucide-react"

import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// Types aligned with backend
interface ControlTest {
  id: string
  name: string
  objective: string
  frequency: string
  owner: string
  criteria: string
  testType: "UAR" | "3WM" | "CM" | "Custom"
}

interface Evidence {
  id: string
  fileName: string
  fileType: string
  uploadedBy: string
  uploadedAt: string
  size: string
  status: "uploaded" | "parsed" | "error"
  parsedEvidence?: ParsedEvidence
}

interface ParsedEvidence {
  id: string
  evidenceId: string
  extractedTables: any[]
  extractedText: string
  metadata: Record<string, any>
}

interface TickTie {
  id: string
  evidenceId: string
  sectionReference: string
  controlAssertion: string
  annotation: string
}

interface WorkpaperSection {
  id: string
  step: number
  testPerformed: string
  resultSummary: string
  outcome: "Pass" | "Fail" | "Exception" | "Not Performed"
  linkedEvidence: Evidence[]
  tickTies: TickTie[]
  reviewerNotes: string
  aiAnalysis?: AIJobResult
}

interface AIJobResult {
  id: string
  status: "pending" | "processing" | "completed" | "failed"
  input: string
  output: string
  confidence: number
  timestamp: string
}

interface Exception {
  id: string
  controlTestId: string
  workpaperId: string
  description: string
  status: "Open" | "In Progress" | "Resolved"
  assignedTo: string
  resolutionNotes: string
  remediation?: {
    id: string
    action: string
    dueDate: string
    completedDate?: string
  }
}

interface WorkpaperExport {
  id: string
  format: "PDF" | "Excel"
  exportedAt: string
  exportedBy: string
  hash: string
}

interface Workpaper {
  id: string
  title: string
  controlTestId: string
  controlTest: ControlTest
  period: {
    start: string
    end: string
  }
  status: "draft" | "review" | "finalized"
  createdBy: string
  reviewer: string
  sections: WorkpaperSection[]
  exceptions: Exception[]
  exports: WorkpaperExport[]
  auditLog: AuditLogEntry[]
}

interface AuditLogEntry {
  id: string
  action: string
  user: string
  timestamp: string
  details: string
}

// Mock data aligned with backend structure
const mockWorkpaper: Workpaper = {
  id: "WP-2024-UAR-001",
  title: "Q4 2024 User Access Review Workpaper",
  controlTestId: "CT-UAR-2024-Q4",
  controlTest: {
    id: "CT-UAR-2024-Q4",
    name: "Quarterly User Access Review",
    objective: "Ensure appropriate access rights and segregation of duties across all financial systems",
    frequency: "Quarterly",
    owner: "Jane Smith",
    criteria: "All users must have appropriate access based on job responsibilities with proper segregation of duties",
    testType: "UAR",
  },
  period: {
    start: "2024-10-01",
    end: "2024-12-31",
  },
  status: "review",
  createdBy: "Jane Smith, Senior Auditor",
  reviewer: "Mike Johnson, Audit Manager",
  sections: [
    {
      id: "WS-001",
      step: 1,
      testPerformed: "Obtained complete user access listing from all financial systems and compared against authorized user list maintained by HR department.",
      resultSummary: "Reviewed 1,247 user accounts across 15 systems. Identified 3 users with access that requires management review due to recent role changes.",
      outcome: "Exception",
      linkedEvidence: [
        {
          id: "EV-001",
          fileName: "User_Access_Report_Q4.xlsx",
          fileType: "application/vnd.ms-excel",
          uploadedBy: "Jane Smith",
          uploadedAt: "2024-12-10T14:30:00Z",
          size: "2.4 MB",
          status: "parsed",
          parsedEvidence: {
            id: "PE-001",
            evidenceId: "EV-001",
            extractedTables: [
              {
                headers: ["User ID", "Name", "Department", "Access Level", "Last Login"],
                rows: [
                  ["U001", "John Smith", "Finance", "Standard", "2024-12-14"],
                  ["U002", "Jane Doe", "IT", "Admin", "2024-12-15"],
                  ["U003", "Bob Johnson", "HR", "Standard", "2024-12-13"],
                ],
              },
            ],
            extractedText: "",
            metadata: { rowCount: 1247, sheetCount: 3 },
          },
        },
        {
          id: "EV-002",
          fileName: "HR_Authorization_Matrix.pdf",
          fileType: "application/pdf",
          uploadedBy: "Jane Smith",
          uploadedAt: "2024-12-10T14:35:00Z",
          size: "1.8 MB",
          status: "parsed",
        },
      ],
      tickTies: [
        {
          id: "TT-001",
          evidenceId: "EV-001",
          sectionReference: "Row 45-47",
          controlAssertion: "Users with role changes require re-authorization",
          annotation: "These 3 users changed departments but access not updated",
        },
      ],
      reviewerNotes: "Follow-up required with HR for role change documentation.",
      aiAnalysis: {
        id: "AI-001",
        status: "completed",
        input: "Analyze user access report for segregation of duties violations",
        output: "Identified 3 users with potential SOD conflicts based on department changes without corresponding access updates",
        confidence: 0.92,
        timestamp: "2024-12-14T10:30:00Z",
      },
    },
  ],
  exceptions: [
    {
      id: "EXC-001",
      controlTestId: "CT-UAR-2024-Q4",
      workpaperId: "WP-2024-UAR-001",
      description: "Three users with access requiring management review due to role changes",
      status: "In Progress",
      assignedTo: "HR Manager",
      resolutionNotes: "HR reviewing role changes and will update access by Dec 20, 2024",
      remediation: {
        id: "REM-001",
        action: "Update user access to match current roles",
        dueDate: "2024-12-20",
      },
    },
  ],
  exports: [
    {
      id: "EXP-001",
      format: "PDF",
      exportedAt: "2024-12-14T15:00:00Z",
      exportedBy: "Jane Smith",
      hash: "a1b2c3d4e5f6",
    },
  ],
  auditLog: [
    {
      id: "LOG-001",
      action: "Created workpaper",
      user: "Jane Smith",
      timestamp: "2024-12-10T09:00:00Z",
      details: "Initial workpaper creation",
    },
    {
      id: "LOG-002",
      action: "Uploaded evidence",
      user: "Jane Smith",
      timestamp: "2024-12-10T14:30:00Z",
      details: "Uploaded 5 evidence files",
    },
    {
      id: "LOG-003",
      action: "AI analysis completed",
      user: "System",
      timestamp: "2024-12-14T10:30:00Z",
      details: "Automated analysis of user access patterns",
    },
  ],
}

export const Route = createFileRoute('/workpapers/reports/$id')({
  component: WorkpaperReport,
})

function WorkpaperReport() {
  const navigate = useNavigate()
  const { id } = Route.useParams()
  const [workpaper] = React.useState<Workpaper>(mockWorkpaper)
  const [isExporting, setIsExporting] = React.useState(false)
  const [previewModal, setPreviewModal] = React.useState<{
    isOpen: boolean
    evidence: Evidence | null
  }>({ isOpen: false, evidence: null })
  const [activeTab, setActiveTab] = React.useState("overview")
  const [isRunningAI, setIsRunningAI] = React.useState(false)

  React.useEffect(() => {
    // In real implementation, fetch workpaper by id
    console.log("Fetching workpaper with id:", id)
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      // API call to /api/workpapers/{id}/export/
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success("PDF export started", {
        description: "Your file will be ready for download shortly.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportExcel = async () => {
    setIsExporting(true)
    try {
      // API call to /api/workpapers/{id}/export/
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success("Excel export started", {
        description: "Your file will be ready for download shortly.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const openPreviewModal = (evidence: Evidence) => {
    setPreviewModal({ isOpen: true, evidence })
  }

  const closePreviewModal = () => {
    setPreviewModal({ isOpen: false, evidence: null })
  }

  const runAIAnalysis = async () => {
    setIsRunningAI(true)
    try {
      // API call to trigger AI analysis
      await new Promise((resolve) => setTimeout(resolve, 3000))
      toast.success("AI analysis started", {
        description: "Results will be available shortly.",
      })
    } finally {
      setIsRunningAI(false)
    }
  }

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case "Pass":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Fail":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "Exception":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "Pass":
        return "bg-green-100 text-green-800 border-green-200"
      case "Fail":
        return "bg-red-100 text-red-800 border-red-200"
      case "Exception":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const renderEvidencePreview = () => {
    const evidence = previewModal.evidence
    if (!evidence) return null

    return (
      <div className="space-y-4">
        {/* Evidence Metadata */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Status:</span>
            <Badge variant={evidence.status === "parsed" ? "default" : "secondary"}>
              {evidence.status}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Uploaded by:</span>
            <span>{evidence.uploadedBy}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Size:</span>
            <span>{evidence.size}</span>
          </div>
        </div>

        {/* Parsed Content */}
        {evidence.parsedEvidence && (
          <div className="space-y-4">
            <h4 className="font-medium">Extracted Data</h4>
            {evidence.parsedEvidence.extractedTables.map((table, idx) => (
              <div key={idx} className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      {table.headers.map((header: string, i: number) => (
                        <th key={i} className="border border-gray-300 p-2 text-left">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row: string[], i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        {row.map((cell, j) => (
                          <td key={j} className="border border-gray-300 p-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Tick & Tie Section */}
        <div className="space-y-2">
          <h4 className="font-medium">Tick & Tie Annotations</h4>
          <Button variant="outline" size="sm" className="w-full">
            <Link className="h-4 w-4 mr-2" />
            Add Tick & Tie Reference
          </Button>
        </div>
      </div>
    )
  }

  return (
    <PageLayout title={workpaper.title}>
      {/* Header Controls */}
      <div className="print:hidden bg-background border-b pb-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate({ to: '/workpapers' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workpapers
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleExportPDF} disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel} disabled={isExporting}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{workpaper.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>ID: {workpaper.id}</span>
                <span>•</span>
                <span>Period: {new Date(workpaper.period.start).toLocaleDateString()} - {new Date(workpaper.period.end).toLocaleDateString()}</span>
                <span>•</span>
                <Badge variant={workpaper.status === "finalized" ? "default" : "secondary"}>
                  {workpaper.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Control Test Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Control Test Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium mb-1">Control Test</p>
                  <p className="text-sm text-muted-foreground">{workpaper.controlTest.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Type</p>
                  <Badge variant="outline">{workpaper.controlTest.testType}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Owner</p>
                  <p className="text-sm text-muted-foreground">{workpaper.controlTest.owner}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Frequency</p>
                  <p className="text-sm text-muted-foreground">{workpaper.controlTest.frequency}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <p className="text-sm font-medium mb-1">Objective</p>
                <p className="text-sm text-muted-foreground">{workpaper.controlTest.objective}</p>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium mb-1">Criteria</p>
                <p className="text-sm text-muted-foreground">{workpaper.controlTest.criteria}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="testing">Test Results</TabsTrigger>
            <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
            <TabsTrigger value="history">Audit Trail</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold">{workpaper.sections.length}</p>
                    <p className="text-sm text-muted-foreground">Test Steps</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold">
                      {workpaper.sections.reduce((acc, s) => acc + s.linkedEvidence.length, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Evidence Files</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold">{workpaper.exceptions.length}</p>
                    <p className="text-sm text-muted-foreground">Exceptions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent AI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workpaper.sections.map((section) => 
                  section.aiAnalysis && (
                    <Alert key={section.id} className="mb-3">
                      <Bot className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium mb-1">Step {section.step}</p>
                            <p className="text-sm">{section.aiAnalysis.output}</p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {Math.round(section.aiAnalysis.confidence * 100)}% confidence
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Results Tab */}
          <TabsContent value="testing" className="space-y-4">
            {workpaper.sections.map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Step {section.step}
                      <Badge className={`ml-2 ${getOutcomeColor(section.outcome)}`}>
                        {getOutcomeIcon(section.outcome)}
                        {section.outcome}
                      </Badge>
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runAIAnalysis()}
                      disabled={isRunningAI}
                    >
                      {isRunningAI ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Bot className="h-4 w-4 mr-2" />
                      )}
                      Run AI Analysis
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Test Performed</p>
                    <p className="text-sm text-muted-foreground">{section.testPerformed}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Result Summary</p>
                    <p className="text-sm text-muted-foreground">{section.resultSummary}</p>
                  </div>
                  
                  {/* Evidence Section */}
                  <div>
                    <p className="text-sm font-medium mb-2">Linked Evidence</p>
                    <div className="space-y-2">
                      {section.linkedEvidence.map((evidence) => (
                        <div
                          key={evidence.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">{evidence.fileName}</p>
                              <p className="text-xs text-muted-foreground">
                                {evidence.size} • {evidence.uploadedBy}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {evidence.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openPreviewModal(evidence)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tick & Tie References */}
                  {section.tickTies.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Tick & Tie References</p>
                      <div className="space-y-2">
                        {section.tickTies.map((tickTie) => (
                          <div key={tickTie.id} className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Link className="h-4 w-4 text-blue-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-blue-900">
                                  {tickTie.sectionReference}
                                </p>
                                <p className="text-sm text-blue-700">{tickTie.controlAssertion}</p>
                                <p className="text-xs text-blue-600 mt-1">{tickTie.annotation}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reviewer Notes */}
                  <div>
                    <p className="text-sm font-medium mb-1">Reviewer Notes</p>
                    <Textarea
                      value={section.reviewerNotes}
                      placeholder="Add reviewer notes..."
                      className="min-h-[80px]"
                      readOnly
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Exceptions Tab */}
          <TabsContent value="exceptions" className="space-y-4">
            {workpaper.exceptions.map((exception) => (
              <Card key={exception.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Exception {exception.id}
                      <Badge
                        className={`ml-2 ${
                          exception.status === "Resolved"
                            ? "bg-green-100 text-green-800"
                            : exception.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {exception.status}
                      </Badge>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-muted-foreground">{exception.description}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium mb-1">Assigned To</p>
                      <p className="text-sm text-muted-foreground">{exception.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Control Test</p>
                      <p className="text-sm text-muted-foreground">{workpaper.controlTest.name}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Resolution Notes</p>
                    <p className="text-sm text-muted-foreground">{exception.resolutionNotes}</p>
                  </div>
                  {exception.remediation && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-1">Remediation Plan</p>
                      <p className="text-sm text-muted-foreground">{exception.remediation.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {new Date(exception.remediation.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workpaper.auditLog.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <History className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.user}</p>
                        {log.details && (
                          <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Evidence Preview Modal */}
      <Dialog open={previewModal.isOpen} onOpenChange={closePreviewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{previewModal.evidence?.fileName}</span>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="p-4">{renderEvidencePreview()}</div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </PageLayout>
  )
}