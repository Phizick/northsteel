import styles from "./StepOne.module.scss";
import { useContext, useState } from "react";
import {
  LOCALSTORAGE_MARKET_DRAFT,
  NewMarketReportContext,
} from "../../NewReport.tsx";
import { initialMarketReportRequest } from "../../../../utils/variables.ts";
import Button from "../../../../shared/Button/Button.tsx";
import ButtonSimple from "../../../../shared/ButtonSimple/ButtonSimple.tsx";
import StepOneForms from "./StepOneForms/StepOneForms.tsx";
import { useResize } from "../../../../hooks/useResize.tsx";

const StepOne = () => {
  const { marketReportRequest, setMarketReportRequest, step, setStep } =
    useContext(NewMarketReportContext);

  const [dateFromError, setDateFromError] = useState<boolean>(false);
  const [dateToError, setDateToError] = useState<boolean>(false);

  const { isMobileScreen } = useResize();

  const checkIsValid = () => {
    const isValid =
      marketReportRequest.title &&
      marketReportRequest.market &&
      marketReportRequest.datesOfReview.from &&
      marketReportRequest.datesOfReview.to &&
      !dateFromError &&
      !dateToError;

    return isValid;
  };

  const clear = () => {
    setMarketReportRequest(initialMarketReportRequest);
    localStorage.removeItem(LOCALSTORAGE_MARKET_DRAFT);
  };

  return (
    <div className={styles.step}>
      <StepOneForms
        setDateFromError={setDateFromError}
        setDateToError={setDateToError}
        reportRequest={marketReportRequest}
        setReportRequest={setMarketReportRequest}
      />
      <div className={styles.stepFooter}>
        {!isMobileScreen && (
          <ButtonSimple visualType="common" onClick={clear}>
            Очистить черновик
          </ButtonSimple>
        )}
        <Button
          className={styles.submitButton}
          disabled={!checkIsValid()}
          onClick={() => setStep(step + 1)}
        >
          Продолжить
        </Button>
        {isMobileScreen && (
          <Button
            className={styles.submitButton}
            onClick={clear}
            color="transparent"
          >
            Очистить черновик
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepOne;
