/// <reference types="vite-plugin-svgr/client" />
import styles from "./Dashboard.module.scss";
import Navigation from "./Navigation/Navigation.tsx";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LayoutWrapper from "./LayoutWrapper/LayoutWrapper.tsx";
import { useEffect } from "react";
import { useStores } from "../../../stores/root-store-context.ts";
import { observer } from "mobx-react-lite";
import Logo from "../../../shared/Logo/Logo.tsx";
import Avatar from "../../../shared/Avatar/Avatar.tsx";
import Button from "../../../shared/Button/Button.tsx";
import LogoutIcon from "../../../assets/images/icons/logout.svg?react";
import { getReport } from "../../../api/getReport.ts";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { userStore } = useStores();

  useEffect(() => {
    if (!userStore.user?.verification) {
      navigate("/onboarding");
    } else if (location.pathname === "/") {
      navigate("/your-reports");
    }
  }, []);

  useEffect(() => {
    (async () => {
      const report = await getReport(1);
      console.log(report);
    })();
  }, []);

  return (
    <main className={styles.page}>
      <LayoutWrapper layout="logo">
        <Logo type="main" />
      </LayoutWrapper>
      <LayoutWrapper layout="header">
        <Avatar />
      </LayoutWrapper>
      <LayoutWrapper layout="navigation">
        <Navigation />
        <Button
          onClick={userStore.logout}
          className={styles.logout}
          type="button"
          color="transparent"
        >
          Выйти <LogoutIcon />
        </Button>
      </LayoutWrapper>
      <LayoutWrapper layout="screens">
        <Outlet />
      </LayoutWrapper>
    </main>
  );
};

export default observer(DashboardPage);
