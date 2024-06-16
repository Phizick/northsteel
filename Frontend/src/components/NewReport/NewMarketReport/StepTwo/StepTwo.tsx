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
import { useStores } from "../../../../stores/root-store-context.ts";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const StepTwo = () => {
  const { marketReportRequest, setMarketReportRequest, closeModal, setStep } =
    useContext(NewMarketReportContext);

  const [editStatus, setEditStatus] = useState<EditStatus | null>(null);

  const { userStore, reportsStore } = useStores();

  const { isMobileScreen } = useResize();

  const navigate = useNavigate();

  const clear = () => {
    setMarketReportRequest(initialMarketReportRequest);
    localStorage.removeItem(LOCALSTORAGE_MARKET_DRAFT);
    setStep(1);
  };

  const handleSubmit = async () => {
    reportsStore.createReport(
      userStore.user?.user_id as string,
      marketReportRequest,
    );
    closeModal();
    navigate("/waiting");
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

export default observer(StepTwo);
