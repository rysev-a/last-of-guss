import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";

import App from "./App.tsx";

import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";

const router = createBrowserRouter([
  {
    index: true,
    path: "/",
    element: <App />,
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
