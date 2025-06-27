import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayout } from "@/components/app-layout"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { AuditDataTable } from "@/components/audit-data-table"
import { SectionCards } from "@/components/section-cards"
import { QuickActions } from "@/components/quick-actions"
import { ApiTestCard } from "@/components/api-test-card"
import { AuthStatus } from "@/components/auth/auth-status"
import { ApiDebug } from "@/components/debug/api-debug"
import { authService } from '@/lib/api/auth'

// import auditData from "@/data/audit-data.json"

// Real audit data from existing site
const auditData = {
  metrics: {
    activeControlTests: 45,
    testsInProgress: 12,
    openExceptions: 3,
    evidencePending: 7,
    complianceScore: 97
  },
  recentTests: [
    {
      id: "UAR-2024-Q4-001",
      controlName: "User Access Review Q4",
      type: "UAR",
      status: "In Progress",
      exceptions: 2,
      assignedTo: "Jane Smith",
      lastUpdated: "2024-01-15",
      progress: 65
    },
    {
      id: "3WM-2024-001",
      controlName: "Three-Way Match Controls",
      type: "3WM",
      status: "Complete",
      exceptions: 0,
      assignedTo: "Mike Johnson",
      lastUpdated: "2024-01-14",
      progress: 100
    },
    {
      id: "ITGC-2024-002",
      controlName: "Database Access Controls",
      type: "ITGC",
      status: "Draft",
      exceptions: 1,
      assignedTo: "Sarah Lee",
      lastUpdated: "2024-01-13",
      progress: 25
    },
    {
      id: "SOD-2024-003",
      controlName: "Segregation of Duties Review",
      type: "SOD",
      status: "In Progress",
      exceptions: 4,
      assignedTo: "David Chen",
      lastUpdated: "2024-01-12",
      progress: 80
    },
    {
      id: "EUC-2024-005",
      controlName: "End User Computing Controls",
      type: "EUC",
      status: "Complete",
      exceptions: 0,
      assignedTo: "Lisa Wong",
      lastUpdated: "2024-01-11",
      progress: 100
    }
  ],
  activityTimeline: [
    { date: "2024-01-01", completed: 2, exceptions: 0, remediated: 1 },
    { date: "2024-01-02", completed: 1, exceptions: 1, remediated: 0 },
    { date: "2024-01-03", completed: 3, exceptions: 0, remediated: 2 },
    { date: "2024-01-04", completed: 0, exceptions: 2, remediated: 1 },
    { date: "2024-01-05", completed: 4, exceptions: 1, remediated: 3 },
    { date: "2024-01-06", completed: 2, exceptions: 0, remediated: 0 },
    { date: "2024-01-07", completed: 1, exceptions: 3, remediated: 1 },
    { date: "2024-01-08", completed: 5, exceptions: 0, remediated: 4 },
    { date: "2024-01-09", completed: 1, exceptions: 2, remediated: 2 },
    { date: "2024-01-10", completed: 3, exceptions: 1, remediated: 1 },
    { date: "2024-01-11", completed: 2, exceptions: 0, remediated: 3 },
    { date: "2024-01-12", completed: 4, exceptions: 2, remediated: 0 },
    { date: "2024-01-13", completed: 1, exceptions: 1, remediated: 2 },
    { date: "2024-01-14", completed: 3, exceptions: 0, remediated: 1 },
    { date: "2024-01-15", completed: 2, exceptions: 1, remediated: 2 }
  ]
}

type AuditTest = {
  id: string
  controlName: string
  type: string
  status: "Draft" | "In Progress" | "Complete"
  exceptions: number
  assignedTo: string
  lastUpdated: string
  progress: number
}

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    // Redirect to login if not authenticated
    if (!authService.isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: Dashboard,
})

function Dashboard() {
  return (
    <AppLayout>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <QuickActions />
          <div className="px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ApiTestCard />
            <AuthStatus />
            <ApiDebug />
          </div>
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <AuditDataTable />
        </div>
      </div>
    </AppLayout>
  )
}