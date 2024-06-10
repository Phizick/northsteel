import styles from "./BlockForm.module.scss";
import { v4 as uuidv4 } from "uuid";
import Input from "../../../shared/Input/Input.tsx";
import Select, { Option } from "../../../shared/Select/Select.tsx";
import { useContext, useState } from "react";
import { NewMarketReportContext } from "../NewReport.tsx";
import { SingleValue } from "react-select";
import { Data } from "../../../api/models/MarketReport.ts";

const formatOptions: Option[] = [
  {
    value: "table",
    label: "Таблица",
  },
  {
    value: "text",
    label: "Текст",
  },
];

const datesOptions: Option[] = [
  {
    value: "current",
    label: "На сегодняшнюю дату",
  },
  {
    value: "custom",
    label: "В указанный в шаге 1 период",
  },
];

const defaultBlock: Data = {
  id: uuidv4(),
  isDefault: false,
  type: "table",
  title: "",
  split: false,
  by: "",
  indicators: [],
  dates: "current",
};

interface BlockFormProps {
  initialBlock?: Data;
}

const BlockForm = ({ initialBlock }: BlockFormProps) => {
  const { marketReportRequest, setMarketReportRequest } = useContext(
    NewMarketReportContext,
  );
  const [block, setBlock] = useState<Data>(
    initialBlock ? initialBlock : defaultBlock,
  );

  const getSelected = (value: string, options: Option[]): Option | null => {
    if (value) {
      return {
        value,
        label: options.find((option) => option.value === value)
          ?.label as string,
      };
    }

    return null;
  };

  const setSelectedFormat = (option: SingleValue<Option>): void => {
    setBlock({ ...block, type: option?.value as "table" | "text" });
  };

  const setSelectedDates = (option: SingleValue<Option>): void => {
    setBlock({ ...block, dates: option?.value as "current" | "custom" });
  };

  return (
    <div className={styles.form}>
      <Input placeholder="Название блока" visualType="narrow" noErrorHandling />
      <Select
        options={formatOptions}
        placeholder="Укажите формат отображения"
        selectedOption={getSelected(block.type, formatOptions)}
        setSelectedOption={setSelectedFormat}
        title="Формат отображения"
      />
      <Select
        options={datesOptions}
        placeholder="Укажите период отчета"
        selectedOption={getSelected(block.dates, datesOptions)}
        setSelectedOption={setSelectedDates}
        title="Период отчета"
      />
    </div>
  );
};

export default BlockForm;
