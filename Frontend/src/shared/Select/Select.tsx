import styles from "./Select.module.scss";
import { Dispatch, FC, SetStateAction } from "react";
import ReactSelect, { SingleValue } from "react-select";

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  title?: string;
  placeholder: string;
  selectedOption: Option | null;
  setSelectedOption:
    | ((value: SingleValue<Option>) => void)
    | Dispatch<SetStateAction<Option | null>>;
}

const Select: FC<SelectProps> = ({
  options,
  title,
  placeholder,
  selectedOption,
  setSelectedOption,
}) => {
  return (
    <div className={styles.wrapper}>
      {title && <span className={styles.title}>{title}</span>}
      <ReactSelect
        value={selectedOption}
        onChange={setSelectedOption}
        options={options}
        placeholder={placeholder}
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "30px",
            ":hover": {
              borderColor: "#0E3C81",
            },
          }),
          container: (base) => ({
            ...base,
            borderRadius: "30px",
            height: "40px",
            ":hover": {
              borderColor: "#0E3C81",
            },
          }),
        }}
      />
    </div>
  );
};

export default Select;
