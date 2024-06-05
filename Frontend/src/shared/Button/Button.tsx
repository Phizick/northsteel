import { ButtonHTMLAttributes, FC } from "react";
import classnames from "classnames";
import styles from "./Button.module.scss";
import Spinner from "../Spinner/Spinner.tsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    isLoading?: boolean;
    disabled?: boolean;
}

const Button: FC<ButtonProps> = (props) => {
    const { className = "", children, isLoading = false, disabled = false, ...rest } = props;

    const buttonClass = classnames({
        [className]: true,
        [styles.button]: true,
        [styles.disabled]: disabled,
    });

    return (
        <button
            type="button"
            className={buttonClass}
            disabled={disabled}
            {...rest}
        >
            {isLoading ? <Spinner /> : children}
        </button>
    );
};

export default Button;
