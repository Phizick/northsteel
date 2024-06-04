import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {LoginPage} from "../../../pages/Login";
import {DashboardPage} from "../../../pages/Dashboard";
import Reports from "../../../components/Reports/Reports.tsx";
import Templates from "../../../components/Templates/Templates.tsx";


const router = createBrowserRouter(
    [
        {
            path: '/login',
            element: <LoginPage/>
        },
        {
            path: '/',
            element: <DashboardPage/>,
            children: [
                {
                    path: "reports",
                    element: <Reports/>
                },
                {
                    path: "templates",
                    element: <Templates/>
                }
            ]
        }
    ]
);

const AppRouter = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;