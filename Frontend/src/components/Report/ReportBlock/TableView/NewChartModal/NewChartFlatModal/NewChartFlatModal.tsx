import Select, { Option } from "../../../../../../shared/Select/Select.tsx";
import { MultiValue, SingleValue } from "react-select";
import { ChartOptions, ChartType } from "../../ReportChart/types";
import styles from "../NewChartModal.module.scss";
import Input from "../../../../../../shared/Input/Input.tsx";
import { TableResponse } from "../../../../../../api/models/MarketReport.ts";
import { Dispatch, SetStateAction } from "react";
import MultiSelect from "../../../../../../shared/MultiSelect/MultiSelect.tsx";

interface NewChartModalProps {
  block: TableResponse;
  options: ChartOptions;
  setOptions: Dispatch<SetStateAction<ChartOptions>>;
}

const chartTypeOptions: Option[] = [
  { value: ChartType.BAR, label: "Столбчатая диаграмма" },
  { value: ChartType.LINE, label: "Линейная диаграмма" },
  { value: ChartType.AREA, label: "Диограмма с областями" },
];

const NewChartFlatModal = ({
  block,
  options,
  setOptions,
}: NewChartModalProps) => {
  const gOptions: Option[] = !block.columnsKeysOrder
    ? Object.keys(block.data[0]).map((key) => ({
        value: key,
        label: key,
      }))
    : block.columnsKeysOrder.map((key) => ({
        value: key,
        label: key,
      }));

  const getSelected = (value: string, options: Option[]): Option | null => {
    if (value) {
      return options.find((option) => option.value === value) as Option;
    }

    return null;
  };

  const getMultiSelected = (selectOptions: Option[]): Option[] => {
    return selectOptions.filter((option) =>
      options.multiIndicator.includes(option.value),
    );
  };

  const setMultiSelected = (selectOptions: MultiValue<Option>): void => {
    setOptions({
      ...options,
      multiIndicator: selectOptions.map((option) => option.value),
    });
  };

  const setSelectedType = (option: SingleValue<Option>): void => {
    setOptions({
      ...options,
      type: option?.value as ChartType,
    });
  };

  const setSelectedGroup = (option: SingleValue<Option>): void => {
    setOptions({
      ...options,
      by: option?.value as string,
    });
  };

  return (
    <div className={styles.modal}>
      <Input
        title="Название"
        placeholder="Введите название графика"
        noErrorHandling
        value={options.title}
        onChange={(e) => setOptions({ ...options, title: e.target.value })}
      />
      <Select
        options={chartTypeOptions}
        placeholder="Выберите тип графика"
        selectedOption={getSelected(options.type, chartTypeOptions)}
        setSelectedOption={setSelectedType}
      />
      <Select
        options={gOptions}
        placeholder="Выберите группировку"
        selectedOption={getSelected(options.by, gOptions)}
        setSelectedOption={setSelectedGroup}
      />
      <MultiSelect
        options={gOptions}
        placeholder="Выберите показатели"
        selectedOptions={getMultiSelected(gOptions)}
        setSelectedOptions={setMultiSelected}
      />
      <Input
        placeholder="Укажите высоту в пикселях"
        noErrorHandling
        value={options.height}
        type="number"
        onChange={(e) => setOptions({ ...options, height: +e.target.value })}
      />
      <Input
        placeholder="Укажите ширину в пикселях"
        noErrorHandling
        value={options.width}
        type="number"
        onChange={(e) => setOptions({ ...options, width: +e.target.value })}
      />
    </div>
  );
};
export default NewChartFlatModal;
