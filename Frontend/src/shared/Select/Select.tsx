import styles from "./Select.module.scss";
import { FC } from "react";
import ReactSelect, { ActionMeta, MultiValue } from "react-select";

export interface Option {
  id?: string;
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  title: string;
  placeholder: string;
  selectedOptions: Option[];
  setSelectedOptions:
    | ((newValue: MultiValue<Option>, actionMeta: ActionMeta<Option>) => void)
    | undefined;
}

const Select: FC<SelectProps> = ({
  options,
  title,
  placeholder,
  selectedOptions,
  setSelectedOptions,
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <ReactSelect
        value={selectedOptions}
        onChange={setSelectedOptions}
        options={options}
        classNames={{
          menuList: () => styles.menuList,
        }}
        placeholder={placeholder}
        isMulti
        styles={{
          container: (base) => ({
            ...base,
            width: "100%",
          }),
          control: (base) => ({
            ...base,
            borderRadius: "30px",
            ":hover": {
              borderColor: "#0E3C81",
            },
          }),
          multiValue: (base) => ({
            ...base,
            borderRadius: "30px",
            background: "transparent",
            border: "1px solid #E3E5E8",
            fontSize: "14px",
          }),
        }}
      />
    </div>
  );
};

export default Select;
