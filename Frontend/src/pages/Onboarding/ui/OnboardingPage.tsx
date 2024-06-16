import styles from "./OnboardingPage.module.scss";
import { useEffect } from "react";
import { useStores } from "../../../stores/root-store-context.ts";
import { useNavigate } from "react-router-dom";
import OnboardingHeader from "./OnboardingHeader/OnboardingHeader.tsx";
import OnboardingSettings from "./OnboardingSettings/OnboardingSettings.tsx";
import { observer } from "mobx-react-lite";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { userStore } = useStores();

  useEffect(() => {
    if (userStore.user?.verification) {
      navigate("/");
    }
  }, [userStore.user?.verification]);

  return (
    <div className={styles.page}>
      <OnboardingHeader />
      <OnboardingSettings />
    </div>
  );
};

export default observer(OnboardingPage);
