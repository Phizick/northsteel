import { useContext } from "react";
import StepOne from "./StepOne/StepOne.tsx";
import { NewMarketReportContext } from "../NewReport.tsx";
import StepTwo from "./StepTwo/StepTwo.tsx";

const NewMarketReport = () => {
  const { step } = useContext(NewMarketReportContext);

  if (step === 1) {
    return <StepOne />;
  }

  if (step === 2) {
    return <StepTwo />;
  }
};

export default NewMarketReport;
