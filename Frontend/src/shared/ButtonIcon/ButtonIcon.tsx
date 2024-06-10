/// <reference types="vite-plugin-svgr/client" />
import styles from "./ButtonIcon.module.scss";
import { ButtonHTMLAttributes } from "react";
import { ButtonIconSize, ButtonIconTypes } from "./types";
import classnames from "classnames";
import Edit from "../../assets/images/icons/edit-button.svg?react";
import Delete from "../../assets/images/icons/delete-button.svg?react";
import URL from "../../assets/images/icons/url-button.svg?react";
import Cancel from "../../assets/images/icons/x.svg?react";
import Back from "../../assets/images/icons/chevron-left.svg?react";
import { Tooltip } from "react-tooltip";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  icon: ButtonIconTypes;
  size?: ButtonIconSize;
}

const ButtonIcon = ({
  className = "",
  size = ButtonIconSize.NORMAL,
  icon,
  disabled,
  ...rest
}: ButtonProps) => {
  const buttonClass = classnames({
    [styles.button]: true,
    [styles.disabled]: disabled,
    [styles[size]]: true,
    [className]: true,
  });

  const iconImage = {
    [ButtonIconTypes.DELETE]: <Delete />,
    [ButtonIconTypes.EDIT]: <Edit />,
    [ButtonIconTypes.URL]: <URL />,
    [ButtonIconTypes.CANCEL]: <Cancel />,
    [ButtonIconTypes.BACK]: <Back />,
  };

  return (
    <>
      <button
        className={buttonClass}
        disabled={disabled}
        data-tooltip-id={disabled ? "my-tooltip" : ""}
        data-tooltip-content="Вы не можете редактировать и удалять дефолтные источники"
        {...rest}
      >
        {iconImage[icon]}
      </button>
      {disabled && <Tooltip id="my-tooltip" />}
    </>
  );
};

export default ButtonIcon;
