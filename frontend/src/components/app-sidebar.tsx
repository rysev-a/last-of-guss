import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  AudioWaveform,
  Calendar,
  ChevronDown,
  Command,
  GalleryVerticalEnd,
  Home,
  Inbox,
  Search,
  Settings,
} from "lucide-react";
import { data, Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { NavUser } from "@/components/nav-user.tsx";
import { NavLogo } from "./nav-logo";

const items = [
  {
    title: "Login",
    url: "/login",
    icon: Home,
  },
  {
    title: "SignUp",
    url: "/signup",
    icon: Inbox,
  },

];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <NavLogo />
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel>Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            email: "user@mail.com",
            name: "example",
            avatar: "image.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
