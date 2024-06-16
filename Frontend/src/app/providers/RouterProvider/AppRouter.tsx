import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import YourReports from "../../../pages/YourReports/YourReports.tsx";
import Templates from "../../../pages/Templates/Templates.tsx";
import ProtectedRoute from "../../../components/ProtectedRoute/ProtectedRoute.tsx";
import LoginPage from "../../../pages/Login/ui/LoginPage.tsx";
import OnboardingPage from "../../../pages/Onboarding/ui/OnboardingPage.tsx";
import DashboardPage from "../../../pages/Dashboard/ui/DashboardPage.tsx";
import CompanyReports from "../../../pages/CompanyReports/CompanyReports.tsx";
import SettingsPage from "../../../pages/SettingsPage/SettingsPage.tsx";
import ReportView from "../../../components/Report/ReportView.tsx";
import { NotFoundPage } from "../../../pages/NotFoundPage";
import { WaitingPage } from "../../../pages/WaitingPage";
import { ErrorPage } from "../../../pages/ErrorPage";
import { FAQPage } from "../../../pages/FAQ";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Outlet />} errorElement={<ErrorPage />}>
      <Route element={<ProtectedRoute onlyForAuth={false} />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute onlyForAuth />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>
      <Route element={<ProtectedRoute onlyForAuth />}>
        <Route path="/" element={<DashboardPage />}>
          <Route path="/your-reports" element={<YourReports />} />
          <Route path="/company-reports" element={<CompanyReports />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/your-reports/:id" element={<ReportView />} />
          <Route path="/company-reports/:id" element={<ReportView />} />
          <Route path="/waiting" element={<WaitingPage />} />
        </Route>
      </Route>
      <Route path="/*" element={<NotFoundPage />} />
    </Route>,
  ),
);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
