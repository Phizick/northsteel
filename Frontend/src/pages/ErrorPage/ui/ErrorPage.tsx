import styles from "./ErrorPage.module.scss";
import Button from "../../../shared/Button/Button.tsx";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <p className={styles.message}>Произошла непредвиденная ошибка</p>
      <p className={styles.message}>
        Попробуйте обновить страницу или вернуться на главную
      </p>
      <div className={styles.buttonsContainer}>
        <Button
          className={styles.button}
          onClick={() => window.location.reload()}
        >
          Обновить страницу
        </Button>
        <Button className={styles.button} onClick={() => navigate("/")}>
          Вернуться на главную
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
