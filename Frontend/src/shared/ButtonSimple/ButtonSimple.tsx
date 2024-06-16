import { ButtonHTMLAttributes } from "react";
import styles from "./ButtonSimple.module.scss";
import classnames from "classnames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  visualType?: "blue" | "common";
  className?: string;
}

const ButtonSimple = ({
  className = "",
  children,
  visualType = "blue",
  disabled,
  ...rest
}: ButtonProps) => {
  const buttonClass = classnames({
    [styles.button]: true,
    [styles[visualType]]: true,
    [className]: true,
    [styles.disabled]: disabled,
  });

  return (
    <button className={buttonClass} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default ButtonSimple;
