import styles from "./DeleteModal.module.scss";

const DeleteModal = () => {
  return (
    <div className={styles.modal}>
      <h3 className={styles.title}>Подтверждение действия</h3>
      <p className={styles.subtitle}>Вы уверены, что хотите удалить отчет?</p>
    </div>
  );
};

export default DeleteModal;
