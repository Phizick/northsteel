import styles from "./NewReport.module.scss";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { MarketReport } from "../../api/models/MarketReport.ts";
import Tabs, { Tab } from "../../shared/Tabs/Tabs.tsx";
import NewMarketReport from "./NewMarketReport/NewMarketReport.tsx";
import dayjs from "dayjs";
import ButtonIcon from "../../shared/ButtonIcon/ButtonIcon.tsx";
import { ButtonIconTypes } from "../../shared/ButtonIcon/types";
import ProgressLine from "../../shared/ProgressLine/ProgressLine.tsx";

export const initialMarketReportRequest: MarketReport = {
  title: "Новый отчет",
  market: "",
  marketNiche: "",
  autoupdate: 0,
  blocks: [],
  splitByDates: false,
  datesOfReview: {
    by: "month",
    from: dayjs(),
    to: dayjs(),
  },
};

enum FormVariant {
  MARKET_REVIEW = "market review",
  COMPETITOR_ANALYSIS = "competitor analysis",
}

const newReportTabs: Tab[] = [
  { value: FormVariant.MARKET_REVIEW, title: "Обзор рынка" },
  { value: FormVariant.COMPETITOR_ANALYSIS, title: "Анализ конкурента" },
];

interface INewMarketReportContext {
  marketReportRequest: MarketReport;
  setMarketReportRequest: (request: MarketReport) => void;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

export const NewMarketReportContext = createContext<INewMarketReportContext>({
  marketReportRequest: initialMarketReportRequest,
  setMarketReportRequest: () => {},
  step: 1,
  setStep: () => {},
});

export const LOCALSTORAGE_NEW_REPORT_TAB = "newReportTab";
export const LOCALSTORAGE_MARKET_DRAFT = "marketDraft";

interface NewReportProps {
  onClose: () => void;
}

const NewReport = ({ onClose }: NewReportProps) => {
  const [marketReportRequest, setMarketReportRequest] = useState<MarketReport>(
    () => {
      const storageValue = localStorage.getItem(LOCALSTORAGE_MARKET_DRAFT);
      if (storageValue) {
        const value: MarketReport = JSON.parse(storageValue);
        value.datesOfReview.from = dayjs(value.datesOfReview.from);
        value.datesOfReview.to = dayjs(value.datesOfReview.to);
        return value;
      }
      return initialMarketReportRequest;
    },
  );

  const [step, setStep] = useState<number>(1);

  let totalSteps = 1;

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const storageValue = localStorage.getItem(LOCALSTORAGE_NEW_REPORT_TAB);
    if (storageValue) {
      return JSON.parse(storageValue);
    }
    return newReportTabs[0];
  });

  if (activeTab.value === FormVariant.MARKET_REVIEW) {
    totalSteps = 2;
  }

  const handleTabStorage = (tab: Tab) => {
    localStorage.setItem(LOCALSTORAGE_NEW_REPORT_TAB, JSON.stringify(tab));
  };

  const getForm = () => {
    if (activeTab.value === FormVariant.MARKET_REVIEW) {
      return <NewMarketReport />;
    }
  };

  const handleRequestChange = (request: MarketReport) => {
    setMarketReportRequest(request);
    localStorage.setItem(LOCALSTORAGE_MARKET_DRAFT, JSON.stringify(request));
  };

  const contextValue = useMemo(
    () => ({
      marketReportRequest,
      setMarketReportRequest: handleRequestChange,
      setStep,
      step,
    }),
    [marketReportRequest, setMarketReportRequest, setStep, step],
  );

  return (
    <NewMarketReportContext.Provider value={contextValue}>
      <div className={styles.newReport}>
        <header className={styles.header}>
          <ButtonIcon icon={ButtonIconTypes.CANCEL} onClick={onClose} />
          {totalSteps > 1 && (
            <ProgressLine totalSteps={totalSteps} curStep={step} />
          )}
        </header>
        <h2 className={styles.title}>{marketReportRequest.title}</h2>
        <Tabs
          list={newReportTabs}
          active={activeTab}
          setActive={setActiveTab}
          visualType="shadow"
          additionalAction={handleTabStorage}
        />
        {getForm()}
      </div>
    </NewMarketReportContext.Provider>
  );
};

export default NewReport;
