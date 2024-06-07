import { ButtonHTMLAttributes, FC } from "react";
import classnames from "classnames";
import styles from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button: FC<ButtonProps> = (props) => {
  const { className = "", children, ...rest } = props;

  const buttonClass = classnames({
    [className]: true,
    [styles.button]: true,
  });

  return (
    <button type="button" className={buttonClass} {...rest}>
      {children}
    </button>
  );
};

export default Button;
