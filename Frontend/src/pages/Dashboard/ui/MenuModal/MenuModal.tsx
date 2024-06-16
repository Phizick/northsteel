import styles from "./MenuModal.module.scss";
import Navigation from "../Navigation/Navigation.tsx";
import Button from "../../../../shared/Button/Button.tsx";
import { observer } from "mobx-react-lite";
import LogoutIcon from "../../../../assets/images/icons/logout.svg?react";
import { useStores } from "../../../../stores/root-store-context.ts";
import ButtonIcon from "../../../../shared/ButtonIcon/ButtonIcon.tsx";
import { ButtonIconTypes } from "../../../../shared/ButtonIcon/types";

interface MenuModalProps {
  onClose: () => void;
}

const MenuModal = ({ onClose }: MenuModalProps) => {
  const { userStore } = useStores();

  return (
    <div className={styles.menu}>
      <div>
        <div className={styles.header}>
          <ButtonIcon icon={ButtonIconTypes.CANCEL} onClick={onClose} />
        </div>
        <Navigation additionalAction={onClose} />
      </div>
      <div className={styles.buttonsWrapper}>
        <Button
          onClick={userStore.logout}
          className={styles.logout}
          type="button"
          color="transparent"
        >
          Выйти <LogoutIcon />
        </Button>
      </div>
    </div>
  );
};

export default observer(MenuModal);
