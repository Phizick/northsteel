import styles from "./Dashboard.module.scss";
import Navigation from "../../../components/Navigation/Navigation.tsx";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LayoutWrapper from "../LayoutWrapper/LayoutWrapper.tsx";
import { useEffect } from "react";
import { useStores } from "../../../stores/root-store-context.ts";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { userStore } = useStores();

  console.log(userStore);

  useEffect(() => {
    // if (!userStore.user?.isOnboarded) {
    //     navigate('/onboarding')
    // } else if (location.pathname === '/') {
    //     navigate('/reports');
    // }
    if (location.pathname === "/") {
      navigate("/reports");
    }
  }, []);

  return (
    <main className={styles.page}>
      <LayoutWrapper layout="navigation">
        <Navigation />
      </LayoutWrapper>
      <LayoutWrapper layout="main">
        <Outlet />
      </LayoutWrapper>
    </main>
  );
};

export default DashboardPage;
