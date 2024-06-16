/// <reference types="vite-plugin-svgr/client" />
import styles from "./Dashboard.module.scss";
import Navigation from "./Navigation/Navigation.tsx";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LayoutWrapper from "./LayoutWrapper/LayoutWrapper.tsx";
import { useEffect, useState } from "react";
import { useStores } from "../../../stores/root-store-context.ts";
import { observer } from "mobx-react-lite";
import Logo from "../../../shared/Logo/Logo.tsx";
import Avatar from "../../../shared/Avatar/Avatar.tsx";
import Button from "../../../shared/Button/Button.tsx";
import LogoutIcon from "../../../assets/images/icons/logout.svg?react";
import { useResize } from "../../../hooks/useResize.tsx";
import ButtonIcon from "../../../shared/ButtonIcon/ButtonIcon.tsx";
import { ButtonIconTypes } from "../../../shared/ButtonIcon/types";
import MenuModal from "./MenuModal/MenuModal.tsx";
import { SwipeableDrawer } from "@mui/material";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { userStore } = useStores();
  const { isMobileScreen } = useResize();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!userStore.user?.verification) {
      navigate("/onboarding");
    } else if (location.pathname === "/") {
      navigate("/your-reports");
    }
  }, []);

  return (
    <main className={styles.page}>
      {!isMobileScreen && (
        <LayoutWrapper layout="logo">
          <Logo type="main" />
        </LayoutWrapper>
      )}
      <LayoutWrapper layout="header">
        {isMobileScreen && (
          <ButtonIcon
            icon={ButtonIconTypes.MENU}
            onClick={() => setIsMenuOpen(true)}
          ></ButtonIcon>
        )}
        <Avatar />
      </LayoutWrapper>
      {!isMobileScreen && (
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
      )}
      <LayoutWrapper layout="screens">
        <Outlet />
      </LayoutWrapper>
      {isMobileScreen && (
        <SwipeableDrawer
          anchor="top"
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onOpen={() => setIsMenuOpen(true)}
        >
          <MenuModal onClose={() => setIsMenuOpen(false)} />
        </SwipeableDrawer>
      )}
    </main>
  );
};

export default observer(DashboardPage);
