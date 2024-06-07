/// <reference types="vite-plugin-svgr/client" />
import styles from "./Source.module.scss";
import { TrustedSource } from "../../api/models/User.ts";
import URL from "../../assets/images/icons/url-button.svg?react";
import Edit from "../../assets/images/icons/edit-button.svg?react";
import ButtonIcon from "../../shared/ButtonIcon/ButtonIcon.tsx";
import { ButtonIconTypes } from "../../shared/ButtonIcon/types";
import { useResize } from "../../hooks/useResize.tsx";
import Button from "../../shared/Button/Button.tsx";

export interface SourceProps {
  source: TrustedSource;
  onEditClick: (keyToEdit: number) => void;
  onDeleteClick: (url: string) => void;
  keyToEdit: number;
}

const Source = ({
  source,
  onDeleteClick,
  onEditClick,
  keyToEdit,
}: SourceProps) => {
  const { isMobileScreen } = useResize();

  return (
    <div className={styles.source}>
      <div className={styles.info}>
        <h4 className={styles.title}>{source.title}</h4>
        <a className={styles.link} href={source.url} target="_blank">
          <span>{source.url}</span>
          <URL />
        </a>
      </div>
      <div className={styles.buttons}>
        {!isMobileScreen ? (
          <ButtonIcon
            icon={ButtonIconTypes.EDIT}
            onClick={() => onEditClick(keyToEdit)}
            disabled={source.isDefault}
          />
        ) : (
          <Button
            onClick={() => onEditClick(keyToEdit)}
            disabled={source.isDefault}
            color="transparent"
            className={styles.button}
          >
            <Edit /> Редактировать
          </Button>
        )}

        <ButtonIcon
          icon={ButtonIconTypes.DELETE}
          onClick={() => onDeleteClick(source.url)}
          disabled={source.isDefault}
        />
      </div>
    </div>
  );
};

export default Source;
