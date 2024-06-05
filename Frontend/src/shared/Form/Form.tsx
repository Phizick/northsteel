import { FC, FormHTMLAttributes } from "react";
import styles from "./Form.module.scss";


interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
    errorRequestMessage?: string | null;
}

const Form: FC<FormProps> = (props) => {
    const {
        errorRequestMessage = null,
        children,
        ...rest
    } = props;

    return (
        <form className={styles.form} {...rest}>
            {children}
            <p className={styles.error}>{errorRequestMessage || ""}</p>
        </form>
    );
};

export default Form;
