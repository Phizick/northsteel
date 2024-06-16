import styles from "./NotFoundPage.module.scss";
import Button from "../../../shared/Button/Button.tsx";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <p className={styles.message}>Страницы с таким адресом не существует</p>
      <Button className={styles.button} onClick={() => navigate("/")}>
        Вернуться на главную
      </Button>
    </div>
  );
};

export default NotFoundPage;
