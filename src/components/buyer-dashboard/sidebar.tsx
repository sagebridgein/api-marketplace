"use client";
import { Home, Key } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";

// Menu items.

export function BuyerDashboardSidebar() {
  const router = useRouter();
  const items = {
    subscriptions: [
      {
        title: "Subscriptions",
        url: "/dashboard",
        icon: Home,
      },
    ],
    keys: [
      {
        title: "OAuth keys",
        pathChange: () => router.replace("production"),
        icon: Key,
      },
    ],
  };
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <SidebarGroupLabel>
            <a  href="/marketplace" className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Nlpbay</a>
          </SidebarGroupLabel>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {pathname.includes("generate-oauth-keys")
                ? items.keys.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="cursor-pointer">
                        <p onClick={() => item.pathChange()}>
                          <item.icon />
                          <span>{item.title}</span>
                        </p>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                : items.subscriptions.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
