import styles from "./OnboardingSettings.module.scss";
import { observer } from "mobx-react-lite";
import Settings from "../../../../components/Settings/Settings.tsx";

const OnboardingSettings = () => {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Первичная настройка</h1>
        <p className={styles.subtitle}>
          Для продолжения необходимо настроить аккаунт
        </p>
        <Settings />
      </div>
    </main>
  );
};

export default observer(OnboardingSettings);
