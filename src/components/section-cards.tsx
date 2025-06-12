import { IconAlertTriangle, IconCircleCheck, IconClock, IconFileText } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AuditMetrics {
  activeControlTests: number
  testsInProgress: number
  openExceptions: number
  evidencePending: number
  complianceScore: number
}

interface SectionCardsProps {
  metrics: AuditMetrics
}

export function SectionCards({ metrics }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Control Tests</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.activeControlTests}
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
            Currently being tested <IconFileText className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Across all audit areas
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tests In Progress</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.testsInProgress}
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
            Work in progress <IconClock className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Require attention
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Open Exceptions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.openExceptions}
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
            Need immediate attention <IconAlertTriangle className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Critical findings to resolve
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Compliance Score</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.complianceScore}%
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
            Strong compliance posture <IconCircleCheck className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Above target threshold
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}