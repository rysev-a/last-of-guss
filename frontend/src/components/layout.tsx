import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet, useNavigate } from "react-router";

import SidebarBreadcrumbs from "@/components/sidebar-breadcrumbs.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useStore } from "@tanstack/react-store";
import { accountStore, loadAccount, loadGameSettings } from "@/core/store.ts";
import api from "@/core/api.ts";
import { toast } from "sonner";
import { useEffect } from "react";

export default function Layout() {
  const account = useStore(accountStore, (state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    if (!account.isAuth) {
      api
        .account()
        .then((response) => {
          loadAccount(response.data);
          toast.success("Load account success", {
            description: "Login in system complete, start play!",
          });
        })
        .then(() => {
          api.getGameSettings().then((response) => {
            loadGameSettings(response.data);
          });
        })
        .catch(() => {
          toast.error("user not loaded");
          navigate("/login");
        });
    }
  }, [account.isAuth]);

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <SidebarBreadcrumbs />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
