import { AppLayout } from "@/components/app-layout"

interface PageLayoutProps {
  title: string
  children: React.ReactNode
}

export function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <AppLayout title={title}>
      <div className="@container/main flex flex-1 flex-col">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {children}
        </div>
      </div>
    </AppLayout>
  )
}