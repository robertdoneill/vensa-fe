import { IconAlertTriangle, IconCircleCheck, IconClock, IconFileText } from "@tabler/icons-react"
import { useNavigate } from "@tanstack/react-router"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { controlsApi } from "@/lib/api/controls"
import { workpapersApi } from "@/lib/api/workpapers"
import { exceptionsApi } from "@/lib/api/exceptions"

interface AuditMetrics {
  activeControlTests: number
  testsInProgress: number
  openExceptions: number
  evidencePending: number
  complianceScore: number
}

export function SectionCards() {
  const navigate = useNavigate()
  const [metrics, setMetrics] = React.useState<AuditMetrics>({
    activeControlTests: 0,
    testsInProgress: 0,
    openExceptions: 0,
    evidencePending: 0,
    complianceScore: 0
  })
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true)
        
        // Fetch data from APIs in parallel
        const [controls, workpapers, exceptions] = await Promise.all([
          controlsApi.getControlTests(),
          workpapersApi.getWorkpapers(),
          exceptionsApi.getExceptionsWithCounts()
        ])

        // Calculate metrics from real data
        const activeControlTests = controls.length
        const testsInProgress = workpapers.filter(w => w.status === 'draft' || w.status === 'in_review').length
        const openExceptions = exceptions.filter(e => e.status === 'open' || e.status === 'in_progress').length
        
        // Calculate compliance score based on exceptions vs controls
        const complianceScore = activeControlTests > 0 
          ? Math.round(((activeControlTests - openExceptions) / activeControlTests) * 100)
          : 0

        setMetrics({
          activeControlTests,
          testsInProgress,
          openExceptions,
          evidencePending: 0, // TODO: Add when evidence API is connected
          complianceScore: Math.max(complianceScore, 0)
        })
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
        // Keep default values on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const handleCardClick = (route: string) => {
    navigate({ to: route })
  }
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card 
        className="@container/card cursor-pointer transition-all hover:shadow-md"
        onClick={() => handleCardClick('/controls')}
      >
        <CardHeader>
          <CardDescription>Active Control Tests</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? '...' : metrics.activeControlTests}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconFileText className="size-3" />
              Controls
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {metrics.activeControlTests > 0 ? "Currently being tested" : "No active tests"} <IconFileText className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {metrics.activeControlTests > 0 ? "Across all audit areas" : "Create control tests to get started"}
          </div>
        </CardFooter>
      </Card>
      
      <Card 
        className="@container/card cursor-pointer transition-all hover:shadow-md"
        onClick={() => handleCardClick('/workpapers')}
      >
        <CardHeader>
          <CardDescription>Tests In Progress</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? '...' : metrics.testsInProgress}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClock className="size-3" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {metrics.testsInProgress > 0 ? "Work in progress" : "No tests in progress"} <IconClock className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {metrics.testsInProgress > 0 ? "Require attention" : "All tests are completed or in draft"}
          </div>
        </CardFooter>
      </Card>
      
      <Card 
        className="@container/card cursor-pointer transition-all hover:shadow-md"
        onClick={() => handleCardClick('/exceptions')}
      >
        <CardHeader>
          <CardDescription>Open Exceptions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? '...' : metrics.openExceptions}
          </CardTitle>
          <CardAction>
            <Badge variant="destructive">
              <IconAlertTriangle className="size-3" />
              High Priority
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {metrics.openExceptions > 0 ? "Need immediate attention" : "No open exceptions"} <IconAlertTriangle className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {metrics.openExceptions > 0 ? "Critical findings to resolve" : "All exceptions resolved"}
          </div>
        </CardFooter>
      </Card>
      
      <Card 
        className="@container/card cursor-pointer transition-all hover:shadow-md"
        onClick={() => handleCardClick('/dashboard')}
      >
        <CardHeader>
          <CardDescription>Compliance Score</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? '...' : `${metrics.complianceScore}%`}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCircleCheck className="size-3" />
              Excellent
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {metrics.complianceScore >= 90 ? "Strong compliance posture" : 
             metrics.complianceScore >= 70 ? "Good compliance" :
             metrics.complianceScore > 0 ? "Needs improvement" : "No data available"} <IconCircleCheck className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {metrics.complianceScore >= 90 ? "Above target threshold" :
             metrics.complianceScore >= 70 ? "Meeting basic requirements" :
             metrics.complianceScore > 0 ? "Action required" : "Create tests to calculate score"}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}