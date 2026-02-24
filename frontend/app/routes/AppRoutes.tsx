import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import { ApplyPage } from "./ApplyPage";
import { AdminApplicationsPage } from "./AdminApplicationsPage";
import { AdminDashboardPage } from "./AdminDashboardPage";
import { AdminApplicationDetailPage } from "./AdminApplicationDetailPage";
import { SuccessPage } from "./SuccessPage";
import { VerifyLicencePage } from "./VerifyLicencePage";

const HomePage: React.FC = () => (
  <div className="p-8">
    <h1 className="mb-2 text-2xl font-semibold tracking-tight">
      Pet Licence Portal
    </h1>
    <p className="max-w-xl text-sm text-slate-300">
      Start a new application to register your pet, or sign in to the admin
      area to review and approve submissions.
    </p>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="apply" element={<ApplyPage />} />
        <Route path="admin/applications" element={<AdminApplicationsPage />} />
        <Route
          path="admin/applications/:id"
          element={<AdminApplicationDetailPage />}
        />
        <Route path="admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="success/:applicationId" element={<SuccessPage />} />
        <Route
          path="verify-licence/:licenceNumber"
          element={<VerifyLicencePage />}
        />
      </Route>
    </Routes>
  );
};

