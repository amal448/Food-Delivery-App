import { Calendar, Home, Inbox, Search, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

const items = [
  {
    title: "Dashboard",
    url: "/seller",
    icon: Home,
  },
  {
    title: "My shop",
    url: "shops",
    icon: Inbox,
  },
  {
    title: "Orders",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]



export function AppSidebar({ onClose }) {
  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full bg-white ">
        <div className="flex items-center justify-between p-4 lg:hidden border-b">
          <h2 className="font-semibold text-lg">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-center py-4 border-b">
          <svg width="49" height="40" viewBox="0 0 49 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M37.3947 40C43.8275 39.8689 49 34.6073 49 28.1389C49 24.9931 47.7512 21.9762 45.5282 19.7518L25.7895 0V12.2771C25.7895 14.3303 26.6046 16.2995 28.0556 17.7514L32.6795 22.3784L32.6921 22.3907L40.4452 30.149C40.697 30.4009 40.697 30.8094 40.4452 31.0613C40.1935 31.3133 39.7852 31.3133 39.5335 31.0613L36.861 28.3871H12.139L9.46655 31.0613C9.21476 31.3133 8.80654 31.3133 8.55476 31.0613C8.30297 30.8094 8.30297 30.4009 8.55475 30.149L16.3079 22.3907L16.3205 22.3784L20.9444 17.7514C22.3954 16.2995 23.2105 14.3303 23.2105 12.2771V0L3.47175 19.7518C1.24882 21.9762 0 24.9931 0 28.1389C0 34.6073 5.17252 39.8689 11.6053 40H37.3947Z" fill="#FF0A0A"></path>
          </svg>
        </div>

        <SidebarGroup className="flex-1 py-6">
          <SidebarGroupLabel className="px-6 text-xs uppercase tracking-wider text-muted-foreground/70 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className="flex items-center uppercase gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 hover:shadow-sm group"
                    >
                      <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
