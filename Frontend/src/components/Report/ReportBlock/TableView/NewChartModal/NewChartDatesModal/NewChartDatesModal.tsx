import { TableResponse } from "../../../../../../api/models/MarketReport.ts";
import { ChartOptions, ChartType } from "../../ReportChart/types";
import { Dispatch, SetStateAction } from "react";
import Select, { Option } from "../../../../../../shared/Select/Select.tsx";
import { SingleValue } from "react-select";
import styles from "../NewChartModal.module.scss";
import Input from "../../../../../../shared/Input/Input.tsx";

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

const NewChartDatesModal = ({
  block,
  options,
  setOptions,
}: NewChartModalProps) => {
  const indicatorOptions: Option[] = block.indicators.map((indicator) => ({
    value: indicator,
    label: indicator,
  }));

  const gOptions: Option[] = [
    {
      value: block.by as string,
      label: block.by as string,
    },
    {
      value: "Период",
      label: "Период",
    },
  ];

  const getSelected = (value: string, options: Option[]): Option | null => {
    if (value) {
      return options.find((option) => option.value === value) as Option;
    }

    return null;
  };

  const setSelectedType = (option: SingleValue<Option>): void => {
    setOptions({
      ...options,
      type: option?.value as ChartType,
    });
  };

  const setSelectedIndicator = (option: SingleValue<Option>): void => {
    setOptions({
      ...options,
      indicator: option?.value as string,
    });
  };

  const setSelectedGroup = (option: SingleValue<Option>): void => {
    setOptions({
      ...options,
      by: option?.value as string,
    });
  };

  const setSelectedPoints = (option: SingleValue<Option>): void => {
    setOptions({
      ...options,
      points: option?.value as string,
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
        options={indicatorOptions}
        placeholder="Выберите показатель"
        selectedOption={getSelected(options.indicator, indicatorOptions)}
        setSelectedOption={setSelectedIndicator}
      />
      <Select
        options={gOptions}
        placeholder="Выберите группировку"
        selectedOption={getSelected(options.by, gOptions)}
        setSelectedOption={setSelectedGroup}
      />
      <Select
        options={gOptions}
        placeholder="Выберите разбивку"
        selectedOption={getSelected(options.points, gOptions)}
        setSelectedOption={setSelectedPoints}
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

export default NewChartDatesModal;
