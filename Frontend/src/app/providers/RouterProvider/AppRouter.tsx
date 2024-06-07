import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Reports from "../../../components/Reports/Reports.tsx";
import Templates from "../../../components/Templates/Templates.tsx";
import ProtectedRoute from "../../../components/ProtectedRoute/ProtectedRoute.tsx";
import LoginPage from "../../../pages/Login/ui/LoginPage.tsx";
import OnboardingPage from "../../../pages/Onboarding/ui/OnboardingPage.tsx";
import DashboardPage from "../../../pages/Dashboard/ui/DashboardPage.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<ProtectedRoute onlyForAuth={false} />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute onlyForAuth />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>
      <Route element={<ProtectedRoute onlyForAuth />}>
        <Route path="/" element={<DashboardPage />}>
          <Route path="/reports" element={<Reports />} />
          <Route path="/templates" element={<Templates />} />
        </Route>
      </Route>
    </>,
  ),
);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
