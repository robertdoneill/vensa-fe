import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from "@/components/app-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamManagement } from "@/components/team-management"

export const Route = createFileRoute('/settings/')({
  component: Settings,
})

function Settings() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>
        
        <Tabs defaultValue="team" className="space-y-4">
          <TabsList>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="team" className="space-y-4">
            <TeamManagement />
          </TabsContent>
          
          <TabsContent value="organization" className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">Organization settings coming soon...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">Notification settings coming soon...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">Security settings coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}