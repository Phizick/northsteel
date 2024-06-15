import styles from "./ReportSettings.module.scss";
import { MarketReportRequest } from "../../api/models/MarketReport.ts";
import MarketReportSettings from "./MarketReportSettings/MarketReportSettings.tsx";
import { Dispatch, SetStateAction, useState } from "react";
import ButtonSimple from "../../shared/ButtonSimple/ButtonSimple.tsx";
import Button from "../../shared/Button/Button.tsx";
import { EditStatus } from "../Settings/Settings.tsx";

export interface ReportSettingsProps {
  report: MarketReportRequest;
  onConfirm: Dispatch<SetStateAction<MarketReportRequest | null>>;
}

const ReportSettings = ({ report, onConfirm }: ReportSettingsProps) => {
  const [currentState, setCurrentState] = useState<MarketReportRequest>(report);
  const [dateFromError, setDateFromError] = useState<boolean>(false);
  const [dateToError, setDateToError] = useState<boolean>(false);
  const [editStatus, setEditStatus] = useState<EditStatus | null>(null);

  const isButtonActive = () => {
    if (
      !currentState.title &&
      !currentState.market &&
      !currentState.datesOfReview.from &&
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
    setCurrentState(report);
  };

  return (
    <div className={styles.reportSettings}>
      <MarketReportSettings
        currentState={currentState}
        setCurrentState={setCurrentState}
        setDateFromError={setDateFromError}
        setDateToError={setDateToError}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
      />
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

export default ReportSettings;
