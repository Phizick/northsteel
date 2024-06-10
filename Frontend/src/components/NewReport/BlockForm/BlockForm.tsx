/// <reference types="vite-plugin-svgr/client" />
import styles from "./BlockForm.module.scss";
import { v4 as uuidv4 } from "uuid";
import Input from "../../../shared/Input/Input.tsx";
import Select, { Option } from "../../../shared/Select/Select.tsx";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { NewMarketReportContext } from "../NewReport.tsx";
import { SingleValue } from "react-select";
import { Data } from "../../../api/models/MarketReport.ts";
import Badge from "../../../shared/Badge/Badge.tsx";
import Cross from "../../../assets/images/icons/x.svg?react";
import ButtonSimple from "../../../shared/ButtonSimple/ButtonSimple.tsx";
import { EditStatus } from "../../../pages/Onboarding/ui/OnboardingSettings/OnboardingSettings.tsx";

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

const splitOptions: Option[] = [
  {
    value: "false",
    label: "В целом по рынку/нише",
  },
  {
    value: "true",
    label: "Разделить по критерию:",
  },
];

const datesOptions: Option[] = [
  {
    value: "current",
    label: "На сегодняшнюю дату",
  },
  {
    value: "custom",
    label: "Указанный на первом шаге период",
  },
];

const defaultBlock: Data = {
  id: "newId",
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
  setEditStatus: Dispatch<SetStateAction<EditStatus | null>>;
  setKeyToEdit: Dispatch<SetStateAction<string | null>>;
}

const BlockForm = ({
  initialBlock,
  setEditStatus,
  setKeyToEdit,
}: BlockFormProps) => {
  const { marketReportRequest, setMarketReportRequest } = useContext(
    NewMarketReportContext,
  );
  const [block, setBlock] = useState<Data>(
    initialBlock ? initialBlock : { ...defaultBlock, id: uuidv4() },
  );

  const [newIndicator, setNewIndicator] = useState("");

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

  const setSelectedSplit = (option: SingleValue<Option>): void => {
    setBlock({ ...block, split: option?.value === "true" });
  };

  const handleAddIndicator = (e: React.FormEvent) => {
    e.preventDefault();
    if (block.indicators.includes(newIndicator)) {
      return;
    }
    setBlock({ ...block, indicators: [...block.indicators, newIndicator] });
    setNewIndicator("");
  };

  const handleDeleteIndicator = (index: number) => {
    block.indicators.splice(index, 1);
    setBlock({ ...block, indicators: [...block.indicators] });
  };

  const isValid = () => {
    if (!block.title || !block.indicators.length) {
      return false;
    }

    if (block.split && !block.by) {
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!initialBlock) {
      setMarketReportRequest({
        ...marketReportRequest,
        blocks: [...marketReportRequest.blocks, block],
      });
    } else {
      let editedIndex = marketReportRequest.blocks.findIndex(
        (requestBlock) => requestBlock.id === initialBlock.id,
      );
      marketReportRequest.blocks.splice(editedIndex, 1, block);
      setMarketReportRequest({
        ...marketReportRequest,
        blocks: [...marketReportRequest.blocks],
      });
      setKeyToEdit(null);
    }
    setEditStatus(null);
  };

  const handleCancel = () => {
    setEditStatus(null);
    setKeyToEdit(null);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  return (
    <div className={styles.form} ref={scrollRef}>
      <Input
        placeholder="Введите название блока"
        visualType="narrow"
        noErrorHandling
        hasError={!block.title}
        value={block.title}
        onChange={(e) => setBlock({ ...block, title: e.currentTarget.value })}
      />
      <Select
        options={splitOptions}
        placeholder="Укажите глубину отчета"
        selectedOption={getSelected(
          block.split ? "true" : "false",
          splitOptions,
        )}
        setSelectedOption={setSelectedSplit}
        title="Глубина отчета"
      />
      {block.split && (
        <Input
          placeholder="Введите название критерия"
          visualType="narrow"
          noErrorHandling
          hasError={!block.by}
          value={block.by}
          onChange={(e) => setBlock({ ...block, by: e.currentTarget.value })}
        />
      )}
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
      <div className={styles.indicatorsWrapper}>
        <form onSubmit={handleAddIndicator}>
          <Input
            placeholder="Введите название индикатора"
            visualType="narrow"
            noErrorHandling
            hasError={!block.indicators.length && !newIndicator}
            value={newIndicator}
            onChange={(e) => setNewIndicator(e.target.value)}
          />
        </form>
        <ul className={styles.indicatorsList}>
          {block.indicators.map((indicator, index) => (
            <li key={index}>
              <Badge visualType="common">
                {indicator}{" "}
                <Cross
                  className={styles.crossIcon}
                  onClick={() => handleDeleteIndicator(index)}
                />
              </Badge>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.buttonsWrapper}>
        <ButtonSimple disabled={!isValid()} onClick={handleSubmit}>
          {!initialBlock ? "Добавить блок" : "Сохранить изменения"}
        </ButtonSimple>
        <ButtonSimple visualType="common" onClick={handleCancel}>
          Отмена
        </ButtonSimple>
      </div>
    </div>
  );
};

export default BlockForm;
