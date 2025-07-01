import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";

import App from "./App.tsx";

import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import GameListPage from "@/pages/GameListPage.tsx";
import Layout from "@/components/layout.tsx";
import GameCreatePage from "@/pages/GameCreatePage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/core/queryClient";
import GameDetailPage from "@/pages/GameDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        path: "/",
        element: <App />,
      },
      { path: "games", Component: GameListPage },
      { path: "games/new", Component: GameCreatePage },
      { path: "games/:id", Component: GameDetailPage },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
    <Toaster />
  </StrictMode>,
);
