import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "../../../pages/Login";
import { DashboardPage } from "../../../pages/Dashboard";
import Reports from "../../../components/Reports/Reports.tsx";
import Templates from "../../../components/Templates/Templates.tsx";
import { OnboardingPage } from "../../../pages/Onboarding";
import ProtectedRoute from "../../../components/ProtectedRoute/ProtectedRoute.tsx";
import { observer } from "mobx-react-lite";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <ProtectedRoute onlyForAuth={false}>
        <LoginPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute onlyForAuth>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute onlyForAuth>
        <DashboardPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "templates",
        element: <Templates />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default observer(AppRouter);
