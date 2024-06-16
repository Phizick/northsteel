import styles from "./NewReport.module.scss";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { MarketReportRequest } from "../../api/models/MarketReport.ts";
import Tabs, { Tab } from "../../shared/Tabs/Tabs.tsx";
import NewMarketReport from "./NewMarketReport/NewMarketReport.tsx";
import dayjs from "dayjs";
import ButtonIcon from "../../shared/ButtonIcon/ButtonIcon.tsx";
import { ButtonIconTypes } from "../../shared/ButtonIcon/types";
import ProgressLine from "../../shared/ProgressLine/ProgressLine.tsx";
import {
  initialCompetitorReportRequest,
  initialMarketReportRequest,
} from "../../utils/variables.ts";
import { CompetitorReportRequest } from "../../api/models/CompetitorReport.ts";
import NewCompetitorReport from "./NewCompetitorReport/NewCompetitorReport.tsx";

enum FormVariant {
  MARKET_REVIEW = "market review",
  COMPETITOR_ANALYSIS = "competitor analysis",
}

const newReportTabs: Tab[] = [
  { value: FormVariant.MARKET_REVIEW, title: "Обзор рынка" },
  { value: FormVariant.COMPETITOR_ANALYSIS, title: "Анализ конкурента" },
];

interface INewMarketReportContext {
  marketReportRequest: MarketReportRequest;
  setMarketReportRequest: (request: MarketReportRequest) => void;
  competitorReportRequest: CompetitorReportRequest;
  setCompetitorReportRequest: (request: CompetitorReportRequest) => void;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  closeModal: () => void;
}

export const NewMarketReportContext = createContext<INewMarketReportContext>({
  marketReportRequest: initialMarketReportRequest,
  setMarketReportRequest: () => {},
  competitorReportRequest: initialCompetitorReportRequest,
  setCompetitorReportRequest: () => {},
  step: 1,
  setStep: () => {},
  closeModal: () => {},
});

export const LOCALSTORAGE_NEW_REPORT_TAB = "newReportTab";
export const LOCALSTORAGE_MARKET_DRAFT = "marketDraft";
export const LOCALSTORAGE_COMPETITOR_DRAFT = "competitorDraft";

interface NewReportProps {
  onClose: () => void;
}

const NewReport = ({ onClose }: NewReportProps) => {
  const [marketReportRequest, setMarketReportRequest] =
    useState<MarketReportRequest>(() => {
      const storageValue = localStorage.getItem(LOCALSTORAGE_MARKET_DRAFT);
      if (storageValue) {
        const value: MarketReportRequest = JSON.parse(storageValue);
        value.datesOfReview.from = dayjs(value.datesOfReview.from);
        value.datesOfReview.to = dayjs(value.datesOfReview.to);
        return value;
      }
      return initialMarketReportRequest;
    });

  const [competitorReportRequest, setCompetitorReportRequest] =
    useState<CompetitorReportRequest>(() => {
      const storageValue = localStorage.getItem(LOCALSTORAGE_COMPETITOR_DRAFT);
      if (storageValue) {
        return JSON.parse(storageValue);
      }
      return initialCompetitorReportRequest;
    });

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

  const handleTabClick = (tab: Tab) => {
    setStep(1);
    localStorage.setItem(LOCALSTORAGE_NEW_REPORT_TAB, JSON.stringify(tab));
  };

  const getForm = () => {
    if (activeTab.value === FormVariant.MARKET_REVIEW) {
      return <NewMarketReport />;
    }
    if (activeTab.value === FormVariant.COMPETITOR_ANALYSIS) {
      return <NewCompetitorReport />;
    }
  };

  const getTitle = () => {
    if (activeTab.value === FormVariant.MARKET_REVIEW) {
      return marketReportRequest.title;
    }
    if (activeTab.value === FormVariant.COMPETITOR_ANALYSIS) {
      return competitorReportRequest.title;
    }
  };

  const handleMarketRequestChange = (request: MarketReportRequest) => {
    setMarketReportRequest(request);
    localStorage.setItem(LOCALSTORAGE_MARKET_DRAFT, JSON.stringify(request));
  };

  const handleCompetitorRequestChange = (request: CompetitorReportRequest) => {
    setCompetitorReportRequest(request);
    localStorage.setItem(
      LOCALSTORAGE_COMPETITOR_DRAFT,
      JSON.stringify(request),
    );
  };

  const contextValue = useMemo(
    () => ({
      marketReportRequest,
      setMarketReportRequest: handleMarketRequestChange,
      competitorReportRequest,
      setCompetitorReportRequest: handleCompetitorRequestChange,
      setStep,
      step,
      closeModal: onClose,
    }),
    [
      marketReportRequest,
      setMarketReportRequest,
      setStep,
      step,
      competitorReportRequest,
      setCompetitorReportRequest,
      onClose,
    ],
  );

  return (
    <NewMarketReportContext.Provider value={contextValue}>
      <div className={styles.newReport}>
        <header className={styles.header}>
          <ButtonIcon icon={ButtonIconTypes.CANCEL} onClick={onClose} />
          {totalSteps > 1 && (
            <ProgressLine totalSteps={totalSteps} curStep={step} />
          )}
          {step > 1 && totalSteps > 1 && (
            <ButtonIcon
              className={styles.backButton}
              icon={ButtonIconTypes.BACK}
              onClick={() => setStep(step - 1)}
            />
          )}
        </header>
        <h2 className={styles.title}>{getTitle()}</h2>
        {step <= 1 ? (
          <Tabs
            list={newReportTabs}
            active={activeTab}
            setActive={setActiveTab}
            visualType="shadow"
            additionalAction={handleTabClick}
          />
        ) : (
          <h2 className={styles.subtitle}>Содержание отчета</h2>
        )}

        {getForm()}
      </div>
    </NewMarketReportContext.Provider>
  );
};

export default NewReport;
