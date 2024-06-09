import styles from "./Modal.module.scss";
import { useEffect, FC, ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import classnames from "classnames";
import ModalOverlay from "./ModalOverlay/ModalOverlay.tsx";

const modalsContainer = document.querySelector("#modals") as HTMLElement;

export enum ModalFor {
  POPUP = "popup",
  PROFILE = "profile",
}

interface ModalProps {
  closeModal: () => void;
  children: ReactNode;
  forType?: ModalFor;
  isCloseButton?: boolean;
}

const Modal: FC<ModalProps> = ({
  closeModal,
  forType = ModalFor.POPUP,
  children,
}) => {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const handleEscKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscKeydown);

    return () => {
      document.removeEventListener("keydown", handleEscKeydown);
    };
  }, []);

  async function handleClose() {
    setClosing(true);
    await new Promise((res) => setTimeout(res, 200));
    closeModal();
  }

  const modalClass = classnames({
    portal: true,
    [styles.modal]: true,
    [styles[forType]]: true,
    [styles.closeProfile]: forType === ModalFor.PROFILE && closing,
  });

  return createPortal(
    <>
      <div className={modalClass}>{children}</div>
      <ModalOverlay onClick={handleClose} />
    </>,
    modalsContainer,
  );
};

export default Modal;
