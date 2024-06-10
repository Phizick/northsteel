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
  ...rest
}: ButtonProps) => {
  const buttonClass = classnames({
    [styles.button]: true,
    [styles[visualType]]: true,
    [className]: true,
  });

  return (
    <button className={buttonClass} {...rest}>
      {children}
    </button>
  );
};

export default ButtonSimple;
