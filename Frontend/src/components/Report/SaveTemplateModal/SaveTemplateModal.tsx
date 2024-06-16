import styles from "./SaveTemplateModal.module.scss";
import { Dispatch, SetStateAction } from "react";
import Input from "../../../shared/Input/Input.tsx";

interface SaveTemplateModalProps {
  newTemplateTitle: string;
  setNewTemplateTitle: Dispatch<SetStateAction<string>>;
}

const SaveTemplateModal = ({
  setNewTemplateTitle,
  newTemplateTitle,
}: SaveTemplateModalProps) => {
  return (
    <div className={styles.modal}>
      <h3 className={styles.title}>Сохранить отчет как шаблон</h3>
      <p className={styles.subtitle}>
        Сохраните отчет в качестве шаблона и создавайте другие отчеты на основе
        сохраненного
      </p>
      <Input
        placeholder="Введите название шаблона"
        noErrorHandling
        value={newTemplateTitle}
        onChange={(e) => setNewTemplateTitle(e.target.value)}
        hasError={!newTemplateTitle}
      />
    </div>
  );
};

export default SaveTemplateModal;
