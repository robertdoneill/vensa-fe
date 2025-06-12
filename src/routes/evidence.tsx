import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from "@/components/app-layout"

export const Route = createFileRoute('/evidence')({
  component: Evidence,
})

function Evidence() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Evidence</h2>
        </div>
        {/* Evidence content will go here */}
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground">Evidence management coming soon...</p>
        </div>
      </div>
    </AppLayout>
  )
}