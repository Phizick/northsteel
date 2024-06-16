/// <reference types="vite-plugin-svgr/client" />
import styles from "./ReportView.module.scss";
import {
  MarketReport,
  MarketReportRequest,
  TableResponse,
  TextResponse,
} from "../../api/models/MarketReport.ts";
import ReportBlock from "./ReportBlock/ReportBlock.tsx";
import LeftIcon from "../../assets/images/icons/chevron-left.svg?react";
import SettingsIcon from "../../assets/images/icons/settings.svg?react";
import SaveIcon from "../../assets/images/icons/save.svg?react";
import RefreshIcon from "../../assets/images/icons/refresh.svg?react";
import DownloadIcon from "../../assets/images/icons/download.svg?react";
import DeleteIcon from "../../assets/images/icons/delete.svg?react";
import Button from "../../shared/Button/Button.tsx";
import ButtonSimple from "../../shared/ButtonSimple/ButtonSimple.tsx";
import getMonthForm from "../../utils/getMonthForm.ts";
import { Margin, usePDF } from "react-to-pdf";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useStores } from "../../stores/root-store-context.ts";
import { observer } from "mobx-react-lite";
import Spinner from "../../shared/Spinner/Spinner.tsx";
import ConfirmModal from "../ConfirmModal/ConfirmModal.tsx";
import SaveTemplateModal from "./SaveTemplateModal/SaveTemplateModal.tsx";
import { ITemplate } from "../TemplateCards/TemplateCard/TemplateCard.tsx";
import dayjs from "dayjs";
import ReportSettings from "../ReportSettings/ReportSettings.tsx";
import { useResize } from "../../hooks/useResize.tsx";
import DeleteModal from "./DeleteModal/DeleteModal.tsx";
import { SwipeableDrawer } from "@mui/material";
import { CompetitorReportRequest } from "../../api/models/CompetitorReport.ts";

export interface IReportContext {
  currentReport: MarketReport | null;
  setCurrentReport: Dispatch<SetStateAction<MarketReport | null>>;
  handleBlockChange: (blockId: string, newData: TableResponse) => void;
}

const defaultContext = {
  currentReport: null,
  setCurrentReport: () => {},
  handleBlockChange: () => {},
};

export const ReportContext = createContext<IReportContext>(defaultContext);

export const LOCAL_STORAGE_INIT_REPORT = "initialReport";

const ReportView = () => {
  const { userStore, reportsStore, templatesStore } = useStores();

  const { id } = useParams();

  const { isMobileScreen } = useResize();

  const [currentReport, setCurrentReport] = useState<MarketReport | null>(null);
  const [reportSettings, setReportSettings] = useState<
    MarketReportRequest | CompetitorReportRequest | null
  >(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [currentState, setCurrentState] = useState<
    MarketReportRequest | CompetitorReportRequest | null
  >(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (userStore.user) {
        const report = await reportsStore.getReport(id as string);

        if (report) {
          setCurrentReport(report);

          if (report.type === "market") {
            const convertedFromDate = dayjs(report?.datesOfReview.from);
            const convertedToDate = dayjs(report?.datesOfReview.to);

            setReportSettings({
              ...report,
              datesOfReview: {
                ...report.datesOfReview,
                from: convertedFromDate,
                to: convertedToDate,
              },
            });
            setCurrentState({
              ...report,
              datesOfReview: {
                ...report.datesOfReview,
                from: convertedFromDate,
                to: convertedToDate,
              },
            });
          } else {
            setReportSettings(report as CompetitorReportRequest);
            setCurrentState(report as CompetitorReportRequest);
          }

          localStorage.setItem(
            LOCAL_STORAGE_INIT_REPORT,
            JSON.stringify(report),
          );
        }
      }
    })();
  }, [userStore.isReady]);

  const { toPDF, targetRef } = usePDF({
    filename: `${currentReport?.title || "Новый отчет"}.pdf`,
    page: { margin: Margin.SMALL },
  });

  const isUserReport = () => {
    return userStore.user?.user_id == currentReport?.owner_id;
  };

  const handleBlockChange = (blockId: string, newData: TableResponse) => {
    const index = currentReport?.blocks.findIndex(
      (block) => block.id === blockId,
    );
    currentReport?.blocks.splice(index || 0, 1, newData);

    setCurrentReport(structuredClone(currentReport));
  };

  const contextValue: IReportContext = useMemo(
    () => ({
      currentReport: currentReport,
      setCurrentReport: setCurrentReport,
      handleBlockChange: handleBlockChange,
    }),
    [currentReport, setCurrentReport, handleBlockChange],
  );

  const parentPathname = location.pathname.split("/").slice(0, -1).join("/");

  if (reportsStore.isLoading) {
    return <Spinner />;
  }

  if (!currentReport) {
    return <div>Отчета с данным id не обнаружено</div>;
  }

  const getPeriod = () => {
    return `Период отчета с
              ${
                currentReport.datesOfReview.by === "month"
                  ? getMonthForm(
                      new Date(currentReport.datesOfReview.from as string),
                      "genitive",
                    )
                  : ""
              } ${new Date(currentReport.datesOfReview.from as string).getFullYear()} по ${
                currentReport.datesOfReview.by === "month"
                  ? getMonthForm(
                      new Date(currentReport.datesOfReview.to as string),
                      "nominative",
                    )
                  : ""
              } ${new Date(currentReport.datesOfReview.to as string).getFullYear()}
              `;
  };

  const handleRecreateReport = async () => {
    reportsStore.recreateReport(currentReport.id as string, currentReport);
    navigate("/waiting");
  };

  const handleSaveTemplate = async () => {
    const createTemplateBody = () => {
      const blocks = currentReport.blocks.map((block) => ({
        ...block,
        charts: [],
        data: [],
        groups: [],
        periods: [],
      }));

      return { ...currentReport, blocks };
    };

    const newTemplate: ITemplate = {
      title: newTemplateTitle,
      // @ts-ignore
      body: createTemplateBody(),
      template_id: "",
    };

    await templatesStore.createTemplate(
      newTemplate,
      userStore.user?.user_id as string,
    );

    setIsTemplateModalOpen(false);
    setNewTemplateTitle("");
  };

  const handleDeleteReport = async () => {
    const success = await reportsStore.deleteReport(
      currentReport.id as string,
      userStore.user?.user_id as string,
    );

    if (success) {
      navigate("/your-reports");
    }
  };

  return (
    <ReportContext.Provider value={contextValue}>
      <div className={styles.reportView}>
        <ButtonSimple
          className={styles.backButton}
          color="transparent"
          visualType="common"
          onClick={() => navigate(parentPathname)}
        >
          <LeftIcon /> К списку отчетов
        </ButtonSimple>
        {currentReport && (
          <>
            <div className={styles.reportWrapper}>
              <div className={styles.report} ref={targetRef}>
                <div className={styles.header}>
                  <h1>{currentReport.title}</h1>
                  {currentReport.splitByDates && (
                    <p className={styles.subtitle}>{getPeriod()}</p>
                  )}
                </div>
                <div
                  className={styles.headerButtons}
                  data-html2canvas-ignore="true"
                >
                  <div className={styles.headerButtons_left}>
                    {isUserReport() && (
                      <Button
                        className={styles.button}
                        color="transparent"
                        onClick={() => setIsSettingsModalOpen(true)}
                      >
                        <SettingsIcon /> Настройка отчета
                      </Button>
                    )}
                    {!isMobileScreen && currentReport.type === "market" && (
                      <Button
                        className={styles.button}
                        color="grey"
                        onClick={() => setIsTemplateModalOpen(true)}
                      >
                        <SaveIcon /> Сохранить как шаблон
                      </Button>
                    )}
                  </div>
                  <div className={styles.headerButtons_right}>
                    {isMobileScreen && currentReport.type === "market" && (
                      <Button
                        className={styles.button}
                        color="grey"
                        onClick={() => setIsTemplateModalOpen(true)}
                      >
                        <SaveIcon /> Сохранить как шаблон
                      </Button>
                    )}
                    {isUserReport() && (
                      <ButtonSimple
                        visualType="common"
                        onClick={() => setIsDeleteModalOpen(true)}
                      >
                        {!isMobileScreen && "Удалить"} <DeleteIcon />
                      </ButtonSimple>
                    )}
                  </div>
                </div>
                <ul className={styles.list}>
                  {currentReport.blocks.map((block) => (
                    <li key={block.id}>
                      <ReportBlock
                        block={block as TableResponse | TextResponse}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.bottomIsland}>
              {isUserReport() && (
                <Button
                  className={styles.button}
                  color="transparent"
                  onClick={() => handleRecreateReport()}
                >
                  <RefreshIcon />{" "}
                  {!isMobileScreen
                    ? "Сгенерировать заново"
                    : "Перегенерировать"}
                </Button>
              )}
              <Button
                onClick={() => toPDF()}
                className={styles.button}
                color="blue"
              >
                <DownloadIcon />{" "}
                {!isMobileScreen ? "Экспортировать в PDF" : "Экспорт"}
              </Button>
            </div>
          </>
        )}
      </div>
      {isTemplateModalOpen && (
        <ConfirmModal
          isModalOpen={isTemplateModalOpen}
          closeModal={() => {
            setIsTemplateModalOpen(false);
            setNewTemplateTitle("");
          }}
          onConfirm={handleSaveTemplate}
          confirmText="Сохранить как шаблон"
          isButtonDisabled={!newTemplateTitle}
        >
          <SaveTemplateModal
            newTemplateTitle={newTemplateTitle}
            setNewTemplateTitle={setNewTemplateTitle}
          />
        </ConfirmModal>
      )}
      <SwipeableDrawer
        anchor="right"
        open={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onOpen={() => setIsSettingsModalOpen(true)}
      >
        <div className={styles.wrapper}>
          <ReportSettings
            report={reportSettings as MarketReportRequest}
            onConfirm={setReportSettings}
            currentState={
              currentState as MarketReportRequest | CompetitorReportRequest
            }
            setCurrentState={
              setCurrentState as Dispatch<
                SetStateAction<MarketReportRequest | CompetitorReportRequest>
              >
            }
            onClose={() => setIsSettingsModalOpen(false)}
          />
        </div>
      </SwipeableDrawer>
      {isDeleteModalOpen && (
        <ConfirmModal
          isModalOpen={isDeleteModalOpen}
          closeModal={() => {
            setIsDeleteModalOpen(false);
          }}
          onConfirm={handleDeleteReport}
          confirmText="Удалить отчет"
        >
          <DeleteModal />
        </ConfirmModal>
      )}
    </ReportContext.Provider>
  );
};

export default observer(ReportView);
