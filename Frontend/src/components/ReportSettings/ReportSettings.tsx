import styles from "./ReportSettings.module.scss";
import { MarketReportRequest } from "../../api/models/MarketReport.ts";
import MarketReportSettings from "./MarketReportSettings/MarketReportSettings.tsx";
import { Dispatch, SetStateAction, useState } from "react";
import ButtonSimple from "../../shared/ButtonSimple/ButtonSimple.tsx";
import Button from "../../shared/Button/Button.tsx";
import { EditStatus } from "../Settings/Settings.tsx";
import { observer } from "mobx-react-lite";
import { useStores } from "../../stores/root-store-context.ts";
import { useNavigate } from "react-router-dom";
import { CompetitorReportRequest } from "../../api/models/CompetitorReport.ts";
import dayjs from "dayjs";
import ButtonIcon from "../../shared/ButtonIcon/ButtonIcon.tsx";
import { ButtonIconTypes } from "../../shared/ButtonIcon/types";

export interface ReportSettingsProps {
  report: MarketReportRequest;
  onConfirm: Dispatch<
    SetStateAction<MarketReportRequest | CompetitorReportRequest | null>
  >;
  height?: "long" | "short";
  isCreateButton?: boolean;
  currentState: MarketReportRequest | CompetitorReportRequest;
  setCurrentState: Dispatch<
    SetStateAction<MarketReportRequest | CompetitorReportRequest>
  >;
  onClose: () => void;
}

const ReportSettings = ({
  report,
  onConfirm,
  height = "long",
  isCreateButton = false,
  currentState,
  setCurrentState,
  onClose,
}: ReportSettingsProps) => {
  const [dateFromError, setDateFromError] = useState<boolean>(false);
  const [dateToError, setDateToError] = useState<boolean>(false);
  const [editStatus, setEditStatus] = useState<EditStatus | null>(null);

  const { userStore, reportsStore } = useStores();

  const navigate = useNavigate();

  const isButtonActive = () => {
    if (
      report.type === "market" &&
      !currentState.title &&
      // @ts-ignore
      !currentState.market &&
      // @ts-ignore
      !currentState.datesOfReview.from &&
      // @ts-ignore
      !currentState.datesOfReview.to &&
      dateFromError &&
      dateToError
    ) {
      return false;
    }

    if (editStatus) {
      return false;
    }

    if (JSON.stringify(currentState) === JSON.stringify(report)) {
      return false;
    }

    return true;
  };

  const cancelChanges = () => {
    const convertedFromDate =
      typeof report.datesOfReview.from === "string"
        ? dayjs(report?.datesOfReview.from)
        : report.datesOfReview.from;
    const convertedToDate =
      typeof report.datesOfReview.to === "string"
        ? dayjs(report?.datesOfReview.to)
        : report.datesOfReview.to;

    setCurrentState({
      ...report,
      datesOfReview: {
        ...report.datesOfReview,
        from: convertedFromDate,
        to: convertedToDate,
      },
    });
  };

  const handleCreate = async () => {
    reportsStore.createReport(userStore.user?.user_id as string, currentState);
    navigate("/waiting");
  };

  return (
    <div className={styles.reportSettings}>
      <div className={styles.wrapper}>
        <div className={styles.topButtonsContainer}>
          <ButtonIcon icon={ButtonIconTypes.CANCEL} onClick={onClose} />
          {isCreateButton && (
            <Button className={styles.createButton} onClick={handleCreate}>
              Создать отчет по шаблону
            </Button>
          )}
        </div>
        <MarketReportSettings
          currentState={currentState as MarketReportRequest}
          setCurrentState={
            setCurrentState as Dispatch<SetStateAction<MarketReportRequest>>
          }
          setDateFromError={setDateFromError}
          setDateToError={setDateToError}
          editStatus={editStatus}
          setEditStatus={setEditStatus}
          height={height}
        />
      </div>
      <div className={styles.buttonsContainer}>
        <ButtonSimple visualType="common" onClick={cancelChanges}>
          Отменить изменения
        </ButtonSimple>
        <Button
          className={styles.button}
          onClick={() => onConfirm(currentState)}
          disabled={!isButtonActive()}
        >
          Сохранить изменения
        </Button>
      </div>
    </div>
  );
};

export default observer(ReportSettings);
