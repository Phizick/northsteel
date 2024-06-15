import styles from "./ConfirmModal.module.scss";
import { ReactNode } from "react";
import Modal from "../../shared/Modal/Modal.tsx";
import ButtonSimple from "../../shared/ButtonSimple/ButtonSimple.tsx";
import Button from "../../shared/Button/Button.tsx";

interface ModalProps {
  closeModal: () => void;
  children: ReactNode;
  onConfirm: () => void;
  confirmText: string;
  isButtonDisabled?: boolean;
}

const ConfirmModal = ({
  closeModal,
  children,
  onConfirm,
  confirmText,
  isButtonDisabled = false,
}: ModalProps) => {
  return (
    <Modal closeModal={closeModal}>
      <div className={styles.modal}>
        {children}
        <div className={styles.buttonsContainer}>
          <ButtonSimple onClick={closeModal} visualType="common">
            Отмена
          </ButtonSimple>
          <Button
            onClick={onConfirm}
            className={styles.button}
            disabled={isButtonDisabled}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
