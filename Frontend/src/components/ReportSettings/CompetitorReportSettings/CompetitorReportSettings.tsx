import { Dispatch, SetStateAction } from "react";
import { CompetitorReportRequest } from "../../../api/models/CompetitorReport.ts";
import styles from "./CompetitorReportSettings.module.scss";
import Input from "../../../shared/Input/Input.tsx";
import Checkbox from "../../../shared/Checkbox/Checkbox.tsx";
import Select from "../../../shared/Select/Select.tsx";
import { autoupdateOptions } from "../../../utils/variables.ts";
import { Option } from "../../../shared/MultiSelect/MultiSelect.tsx";
import { SingleValue } from "react-select";

interface SettingsProps {
  currentState: CompetitorReportRequest;
  setCurrentState: Dispatch<SetStateAction<CompetitorReportRequest>>;
}

const CompetitorReportSettings = ({
  currentState,
  setCurrentState,
}: SettingsProps) => {
  const getAutoUpdateBy = (value: string): Option | null => {
    if (value) {
      return {
        value,
        label: autoupdateOptions.find((option) => option.value == value)
          ?.label as string,
      };
    }

    return null;
  };

  const setAutoupdateBy = (option: SingleValue<Option>): void => {
    setCurrentState({
      ...currentState,
      autoupdate: Number(option?.value),
    });
  };

  return (
    <div className={styles.settings}>
      <p className={styles.title}>Информация об отчете</p>
      <div className={styles.form}>
        <Input
          placeholder="Введите название отчета"
          visualType="narrow"
          noErrorHandling
          value={currentState.title}
          hasError={!currentState.title}
          onChange={(e) =>
            setCurrentState({
              ...currentState,
              title: e.currentTarget.value,
            })
          }
        />
        <Input
          placeholder="Введите полное название компании"
          visualType="narrow"
          noErrorHandling
          value={currentState.competitorName}
          hasError={!currentState.competitorName}
          onChange={(e) =>
            setCurrentState({
              ...currentState,
              competitorName: e.currentTarget.value,
            })
          }
        />
      </div>
      <div className={styles.autoUpdate}>
        <Checkbox
          label="Автоматически обновлять отчет"
          checked={!!currentState.autoupdate}
          onChange={() =>
            setCurrentState({
              ...currentState,
              autoupdate: Number(!currentState.autoupdate),
            })
          }
        />
        {currentState.autoupdate ? (
          <Select
            options={autoupdateOptions}
            placeholder=""
            selectedOption={getAutoUpdateBy(String(currentState?.autoupdate))}
            setSelectedOption={setAutoupdateBy}
          />
        ) : null}
      </div>
    </div>
  );
};

export default CompetitorReportSettings;
