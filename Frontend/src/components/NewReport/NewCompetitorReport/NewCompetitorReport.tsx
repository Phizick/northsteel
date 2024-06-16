import styles from "./NewCompetitorReport.module.scss";
import Button from "../../../shared/Button/Button.tsx";
import Input from "../../../shared/Input/Input.tsx";
import Checkbox from "../../../shared/Checkbox/Checkbox.tsx";
import Select from "../../../shared/Select/Select.tsx";
import {
  autoupdateOptions,
  initialCompetitorReportRequest,
} from "../../../utils/variables.ts";
import { useContext } from "react";
import {
  LOCALSTORAGE_COMPETITOR_DRAFT,
  NewMarketReportContext,
} from "../NewReport.tsx";
import { SingleValue } from "react-select";
import { Option } from "../../../shared/MultiSelect/MultiSelect.tsx";
import ButtonSimple from "../../../shared/ButtonSimple/ButtonSimple.tsx";
import { useResize } from "../../../hooks/useResize.tsx";
import { useStores } from "../../../stores/root-store-context.ts";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const NewCompetitorReport = () => {
  const { competitorReportRequest, setCompetitorReportRequest, closeModal } =
    useContext(NewMarketReportContext);

  const { isMobileScreen } = useResize();

  const { reportsStore, userStore } = useStores();

  const navigate = useNavigate();

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
    setCompetitorReportRequest({
      ...competitorReportRequest,
      autoupdate: Number(option?.value),
    });
  };

  const isValid = () =>
    competitorReportRequest.title && competitorReportRequest.competitorName;

  const clear = () => {
    setCompetitorReportRequest(initialCompetitorReportRequest);
    localStorage.removeItem(LOCALSTORAGE_COMPETITOR_DRAFT);
  };

  const handleSubmit = () => {
    reportsStore.createReport(
      userStore.user?.user_id as string,
      competitorReportRequest,
    );
    closeModal();
    navigate("/waiting");
  };

  return (
    <div className={styles.report}>
      <div>
        <p className={styles.title}>Информация об отчете</p>
        <div className={styles.form}>
          <Input
            placeholder="Введите название отчета"
            visualType="narrow"
            noErrorHandling
            value={competitorReportRequest.title}
            hasError={!competitorReportRequest.title}
            onChange={(e) =>
              setCompetitorReportRequest({
                ...competitorReportRequest,
                title: e.currentTarget.value,
              })
            }
          />
          <Input
            placeholder="Введите полное название компании"
            visualType="narrow"
            noErrorHandling
            value={competitorReportRequest.competitorName}
            hasError={!competitorReportRequest.competitorName}
            onChange={(e) =>
              setCompetitorReportRequest({
                ...competitorReportRequest,
                competitorName: e.currentTarget.value,
              })
            }
          />
        </div>
        <div className={styles.autoUpdate}>
          <Checkbox
            label="Автоматически обновлять отчет"
            checked={!!competitorReportRequest.autoupdate}
            onChange={() =>
              setCompetitorReportRequest({
                ...competitorReportRequest,
                autoupdate: Number(!competitorReportRequest.autoupdate),
              })
            }
          />
          {competitorReportRequest.autoupdate ? (
            <Select
              options={autoupdateOptions}
              placeholder=""
              selectedOption={getAutoUpdateBy(
                String(competitorReportRequest?.autoupdate),
              )}
              setSelectedOption={setAutoupdateBy}
            />
          ) : null}
        </div>
      </div>

      <div className={styles.stepFooter}>
        {!isMobileScreen && (
          <>
            <ButtonSimple visualType="common" onClick={clear}>
              Очистить черновик
            </ButtonSimple>
            <Button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!isValid()}
            >
              Создать отчет
            </Button>
          </>
        )}
        {isMobileScreen && (
          <>
            <Button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!isValid()}
            >
              Создать отчет
            </Button>
            <Button
              color="transparent"
              onClick={clear}
              className={styles.submitButton}
            >
              Очистить черновик
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default observer(NewCompetitorReport);
