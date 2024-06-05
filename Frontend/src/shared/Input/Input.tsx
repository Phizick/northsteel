import { forwardRef, InputHTMLAttributes } from "react";
import classnames from "classnames";
import styles from "./Input.module.scss";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
    errorMessage?: string;
    noErrorHandling?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputFieldProps>((props, ref) => {
    const {
        hasError,
        errorMessage,
        noErrorHandling = false,
        disabled,
        children,
        ...rest
    } = props;

    const inputClassName = classnames({
        [styles.input]: true,
        [styles.inputError]: hasError,
        [styles.noErrorHandling]: noErrorHandling,
        [styles.disabled]: disabled,
    });

    return (
        <div className={styles.inputWrapper}>
            <input className={inputClassName} ref={ref} {...rest} />
            {children}
            {errorMessage && (
                <div className={styles.errorMessage}>{errorMessage}</div>
            )}
        </div>
    );
});

export default Input;