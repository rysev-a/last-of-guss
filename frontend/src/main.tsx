import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";

import App from "./App.tsx";

import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import GamePage from "@/pages/GamePage.tsx";
import Layout from "@/components/layout.tsx";
import api from "@/core/api.ts";
import { loadAccount } from "@/core/store.ts";
import { toast } from "sonner";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    loader: async () => {
      api.account().then((response) => {
        loadAccount(response.data);
        toast.success("load account success");
      });
    },
    children: [
      {
        index: true,
        path: "/",
        element: <App />,
      },
      { path: "game", Component: GamePage },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
);
