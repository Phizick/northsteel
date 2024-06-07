import styles from "./Checkbox.module.scss";
import { FC, InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox: FC<CheckboxProps> = ({ label, ...rest }) => {
  return (
    <label className={styles.label}>
      {" "}
      <input type="checkbox" {...rest} />
      {label}
    </label>
  );
};

export default Checkbox;
