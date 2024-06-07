import { FC, FormHTMLAttributes } from "react";
import styles from "./Form.module.scss";
import classnames from "classnames";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  errorRequestMessage?: string | null;
  className?: string;
}

const Form: FC<FormProps> = (props) => {
  const {
    errorRequestMessage = null,
    children,
    className = "",
    ...rest
  } = props;

  const formClass = classnames({
    [styles.form]: true,
    [className]: true,
  });

  return (
    <form className={formClass} {...rest}>
      {children}
      <p className={styles.error}>{errorRequestMessage || ""}</p>
    </form>
  );
};

export default Form;
