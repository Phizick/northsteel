/// <reference types="vite-plugin-svgr/client" />
import styles from "./StepTwo.module.scss";
import { useContext, useState } from "react";
import {
  LOCALSTORAGE_MARKET_DRAFT,
  NewMarketReportContext,
} from "../../NewReport.tsx";
import Button from "../../../../shared/Button/Button.tsx";
import ButtonSimple from "../../../../shared/ButtonSimple/ButtonSimple.tsx";
import { initialMarketReportRequest } from "../../../../utils/variables.ts";
import { EditStatus } from "../../../Settings/Settings.tsx";
import StepTwoBlocks from "./StepTwoBlocks/StepTwoBlocks.tsx";
import { useResize } from "../../../../hooks/useResize.tsx";
import { createReport } from "../../../../api/reports.ts";

const StepTwo = () => {
  const { marketReportRequest, setMarketReportRequest, closeModal, setStep } =
    useContext(NewMarketReportContext);

  const [editStatus, setEditStatus] = useState<EditStatus | null>(null);

  const { isMobileScreen } = useResize();

  const clear = () => {
    setMarketReportRequest(initialMarketReportRequest);
    localStorage.removeItem(LOCALSTORAGE_MARKET_DRAFT);
    setStep(1);
  };

  const handleSubmit = async () => {
    console.log(JSON.stringify(marketReportRequest));
    console.log(marketReportRequest);
    closeModal();
    await createReport(marketReportRequest);
  };

  return (
    <div className={styles.step}>
      <StepTwoBlocks
        request={marketReportRequest}
        setMarketReportRequest={setMarketReportRequest}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
      />
      <div className={styles.stepFooter}>
        {!isMobileScreen && (
          <ButtonSimple visualType="common" onClick={clear}>
            Очистить черновик
          </ButtonSimple>
        )}
        <Button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={!marketReportRequest.blocks.length || !!editStatus}
        >
          Создать отчет
        </Button>

        {isMobileScreen && (
          <Button
            color="transparent"
            onClick={clear}
            className={styles.submitButton}
          >
            Очистить черновик
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepTwo;
