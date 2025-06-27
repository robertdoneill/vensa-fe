import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { controlsApi } from "@/lib/api/controls"
import { exceptionsApi } from "@/lib/api/exceptions"

interface ActivityData {
  date: string
  completed: number
  exceptions: number
  remediated: number
}

interface ChartAreaInteractiveProps {
  data?: ActivityData[]
}

export function ChartAreaInteractive({ data: propData }: ChartAreaInteractiveProps) {
  const [chartData, setChartData] = React.useState<ActivityData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setIsLoading(true)
        
        // If prop data is provided, use it (for backward compatibility)
        if (propData && propData.length > 0) {
          setChartData(propData)
          setIsLoading(false)
          return
        }

        // Otherwise, fetch real data and generate activity timeline
        const [controls, exceptions] = await Promise.all([
          controlsApi.getControlTests(),
          exceptionsApi.getExceptionsWithCounts()
        ])

        // Generate last 30 days of activity data
        const activityData: ActivityData[] = []
        const today = new Date()
        
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          
          // Filter controls and exceptions created on this date
          const controlsOnDate = controls.filter(c => 
            new Date(c.created_at).toDateString() === date.toDateString()
          ).length
          
          const exceptionsOnDate = exceptions.filter(e => 
            new Date(e.created_at).toDateString() === date.toDateString()
          ).length
          
          const remediatedOnDate = exceptions.filter(e => 
            e.status === 'resolved' && 
            new Date(e.updated_at).toDateString() === date.toDateString()
          ).length

          activityData.push({
            date: dateStr,
            completed: controlsOnDate,
            exceptions: exceptionsOnDate,
            remediated: remediatedOnDate
          })
        }

        setChartData(activityData)
      } catch (error) {
        console.error('Failed to fetch activity data:', error)
        // Show empty state on error
        setChartData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivityData()
  }, [propData])

  const generateSampleData = (): ActivityData[] => {
    const data: ActivityData[] = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toISOString().split('T')[0],
        completed: Math.floor(Math.random() * 5),
        exceptions: Math.floor(Math.random() * 3),
        remediated: Math.floor(Math.random() * 2)
      })
    }
    
    return data
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Date
              </span>
              <span className="font-bold text-muted-foreground">
                {formatDate(label)}
              </span>
            </div>
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex flex-col">
                <span className="text-[0.70rem] uppercase text-muted-foreground">
                  {entry.dataKey === 'completed' ? 'Completed' : 
                   entry.dataKey === 'exceptions' ? 'Exceptions' : 'Remediated'}
                </span>
                <span className="font-bold" style={{ color: entry.color }}>
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Control Test Activity</CardTitle>
          <CardDescription>
            Daily activity across all audit areas
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading activity data...</p>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No activity data available</p>
              <p className="text-sm text-muted-foreground">Create control tests to see activity</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="exceptions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="remediated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                className="text-xs fill-muted-foreground"
                interval="preserveStartEnd"
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="1"
                stroke="hsl(var(--primary))"
                fill="url(#completed)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="exceptions"
                stackId="1"
                stroke="hsl(var(--destructive))"
                fill="url(#exceptions)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="remediated"
                stackId="1"
                stroke="hsl(142 76% 36%)"
                fill="url(#remediated)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}