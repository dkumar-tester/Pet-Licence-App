import React from "react";
import {
  Router,
  RouterProvider,
  createRouteConfig,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./routes/Layout";
import { ApplyPage } from "./routes/ApplyPage";
import { AdminApplicationsPage } from "./routes/AdminApplicationsPage";
import { AdminDashboardPage } from "./routes/AdminDashboardPage";
import { SuccessPage } from "./routes/SuccessPage";
import { VerifyLicencePage } from "./routes/VerifyLicencePage";

const rootRoute = createRouteConfig({
  component: Layout,
});

const indexRoute = rootRoute.createRoute({
  path: "/",
  component: () => <div className="p-8">Welcome to the Pet Licence Portal.</div>,
});

const applyRoute = rootRoute.createRoute({
  path: "/apply",
  component: ApplyPage,
});

const adminApplicationsRoute = rootRoute.createRoute({
  path: "/admin/applications",
  component: AdminApplicationsPage,
});

const adminDashboardRoute = rootRoute.createRoute({
  path: "/admin/dashboard",
  component: AdminDashboardPage,
});

const successRoute = rootRoute.createRoute({
  path: "/success/$applicationId",
  component: SuccessPage,
});

const verifyLicenceRoute = rootRoute.createRoute({
  path: "/verify-licence/$licenceNumber",
  component: VerifyLicencePage,
});

const routeConfig = rootRoute.addChildren([
  indexRoute,
  applyRoute,
  adminApplicationsRoute,
  adminDashboardRoute,
  successRoute,
  verifyLicenceRoute,
]);

export const router: Router = createRouter({ routeConfig });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

