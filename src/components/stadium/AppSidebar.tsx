import { Activity, DoorOpen, Utensils, Bell, Map, LayoutDashboard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { id: "overview", title: "Overview", icon: LayoutDashboard },
  { id: "zones", title: "Live Zones", icon: Activity },
  { id: "gates", title: "Gate Routing", icon: DoorOpen },
  { id: "food", title: "Food & Beverage", icon: Utensils },
  { id: "navigation", title: "Navigation", icon: Map },
  { id: "alerts", title: "Alerts", icon: Bell },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex items-center gap-2 px-4 py-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground font-bold">
            S
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-bold leading-none">StadiumIQ</p>
            <p className="text-[10px] text-muted-foreground">Smart Stadium Platform</p>
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <a href={`#${item.id}`} className="hover:bg-sidebar-accent">
                      <item.icon className="h-4 w-4" />
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
