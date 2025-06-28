"use client"

import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  IconCamera,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconMap,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/lib/auth/auth-context"

const getNavigationData = () => ({
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      hotkey: ["G", "D"],
    },
    {
      title: "Workpapers",
      url: "/workpapers",
      icon: IconFileDescription,
      hotkey: ["G", "W"],
    },
    {
      title: "Evidence",
      url: "/evidence",
      icon: IconFolder,
      hotkey: ["G", "E"],
    },
    {
      title: "Controls",
      url: "/controls",
      icon: IconListDetails,
      hotkey: ["G", "C"],
    },
    {
      title: "Exceptions",
      url: "/exceptions",
      icon: IconReport,
      hotkey: ["G", "X"],
    },
    {
      title: "CUEC Mapping",
      url: "/cuec-mapping",
      icon: IconMap,
      hotkey: ["G", "M"],
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Audit Documents",
      url: "/audit-documents",
      icon: IconFileDescription,
    },
    {
      name: "Control Library",
      url: "/control-library",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "/reports",
      icon: IconReport,
    },
    {
      name: "AI Assistant",
      url: "/ai-assistant",
      icon: IconFileAi,
    },
  ],
})

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isAuthenticated } = useAuth()
  
  // Get user data from JWT token or use fallback
  const userData = React.useMemo(() => {
    if (isAuthenticated && user) {
      return {
        name: user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name}` 
          : user.username,
        email: user.email,
        avatar: "/avatars/default.jpg", // You can add avatar logic later
      }
    }
    
    // Fallback for when not authenticated
    return {
      name: "Guest User",
      email: "guest@vensa.ai",
      avatar: "/avatars/default.jpg",
    }
  }, [user, isAuthenticated])

  const data = getNavigationData()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Vensa</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}