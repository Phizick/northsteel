import styles from "./WaitingPage.module.scss";
import { LinearProgress } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../stores/root-store-context.ts";
import { useNavigate } from "react-router-dom";

const WaitingPage = () => {
  const { reportsStore } = useStores();

  const navigate = useNavigate();

  if (!reportsStore.isReportCreating) {
    if (reportsStore.createdReportId) {
      navigate(`/your-reports/${reportsStore.createdReportId}`);
    } else {
      navigate("/your-reports");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Обработка запроса...</h2>
        <p>
          Генерация может занимать до 30 секунд. Пожалуйста, дождитесь окончания
          загрузки.
        </p>
        <LinearProgress />
      </div>
    </div>
  );
};

export default observer(WaitingPage);
