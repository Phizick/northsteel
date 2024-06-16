import styles from "./ConfirmModal.module.scss";
import { ReactNode } from "react";
import Modal from "../../shared/Modal/Modal.tsx";
import ButtonSimple from "../../shared/ButtonSimple/ButtonSimple.tsx";
import Button from "../../shared/Button/Button.tsx";
import { useResize } from "../../hooks/useResize.tsx";
import { SwipeableDrawer } from "@mui/material";

interface ModalProps {
  isModalOpen?: boolean;
  closeModal: () => void;
  children: ReactNode;
  onConfirm: () => void;
  confirmText: string;
  isButtonDisabled?: boolean;
}

const ConfirmModal = ({
  isModalOpen = false,
  closeModal,
  children,
  onConfirm,
  confirmText,
  isButtonDisabled = false,
}: ModalProps) => {
  const { isMobileScreen } = useResize();

  return (
    <>
      {!isMobileScreen ? (
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
      ) : (
        <SwipeableDrawer
          anchor="top"
          open={isModalOpen}
          onClose={closeModal}
          onOpen={closeModal}
        >
          <div className={styles.modal}>
            {children}
            <div className={styles.buttonsContainer}>
              <Button
                onClick={closeModal}
                className={styles.button}
                color="transparent"
              >
                Отмена
              </Button>
              <Button
                onClick={onConfirm}
                className={styles.button}
                disabled={isButtonDisabled}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </SwipeableDrawer>
      )}
    </>
  );
};

export default ConfirmModal;
