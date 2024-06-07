import { ButtonHTMLAttributes } from "react";
import styles from "./ButtonSimple.module.scss";
import classnames from "classnames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const ButtonSimple = ({ className = "", children, ...rest }: ButtonProps) => {
  const buttonClass = classnames({
    [styles.button]: true,
    [className]: true,
  });

  return (
    <button className={buttonClass} {...rest}>
      {children}
    </button>
  );
};

export default ButtonSimple;
