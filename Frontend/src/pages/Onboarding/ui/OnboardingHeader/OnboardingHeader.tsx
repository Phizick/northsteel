/// <reference types="vite-plugin-svgr/client" />
import styles from "./OnboardingHeader.module.scss";
import Logo from "../../../../shared/Logo/Logo.tsx";
import Button from "../../../../shared/Button/Button.tsx";
import LeftIcon from "../../../../assets/images/icons/chevron-left.svg?react";
import Avatar from "../../../../shared/Avatar/Avatar.tsx";
import { useResize } from "../../../../hooks/useResize.tsx";
import classnames from "classnames";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../../stores/root-store-context.ts";

const OnboardingHeader = () => {
  const { isMobileScreen } = useResize();

  const { userStore } = useStores();

  const buttonClass = classnames({
    [styles.button]: !isMobileScreen,
    [styles.buttonMobile]: isMobileScreen,
  });

  return (
    <header className={styles.header}>
      <Button
        onClick={userStore.logout}
        className={buttonClass}
        color="transparent"
      >
        <LeftIcon />
        {!isMobileScreen && "Выйти"}
      </Button>
      {!isMobileScreen ? (
        <Logo type="main" className={styles.logo} />
      ) : (
        <Logo type="mobile" className={styles.logo} />
      )}
      {!isMobileScreen && <Avatar className={styles.avatar} />}
    </header>
  );
};

export default observer(OnboardingHeader);
