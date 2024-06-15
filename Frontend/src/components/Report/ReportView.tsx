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
import { ITemplate } from "../Template/Template.tsx";
import SettingsModal from "./SettingsModal/SettingsModal.tsx";
import dayjs from "dayjs";
import ReportSettings from "../ReportSettings/ReportSettings.tsx";
import marketReportSettings from "../ReportSettings/MarketReportSettings/MarketReportSettings.tsx";
import Modal from "../../shared/Modal/Modal.tsx";
import { Space } from "react-zoomable-ui";

// const example: TableResponse = {
//   id: "1",
//   isDefault: true,
//   type: "table",
//   title: "Лидеры рынка металлургии в РФ",
//   split: true,
//   by: "Компания",
//   indicators: ["Доход", "Расход", "Прибыль"],
//   dates: "custom",
//   charts: [],
//   groups: ["Северсталь", "МТК"],
//   periods: ["Итого 2021", "Итого 2022", "Итого 2023"],
//   data: [
//     {
//       Компания: "Северсталь",
//       Показатель: "Доход",
//       "Итого 2021": 200,
//       "Итого 2022": 250,
//       "Итого 2023": 300,
//     },
//     {
//       Компания: "Северсталь",
//       Показатель: "Расход",
//       "Итого 2021": 100,
//       "Итого 2022": 120,
//       "Итого 2023": 170,
//     },
//     {
//       Компания: "Северсталь",
//       Показатель: "Прибыль",
//       "Итого 2021": 100,
//       "Итого 2022": 130,
//       "Итого 2023": 130,
//     },
//     {
//       Компания: "МТК",
//       Показатель: "Доход",
//       "Итого 2021": 150,
//       "Итого 2022": 170,
//       "Итого 2023": 190,
//     },
//     {
//       Компания: "МТК",
//       Показатель: "Расход",
//       "Итого 2021": 80,
//       "Итого 2022": 100,
//       "Итого 2023": 120,
//     },
//     {
//       Компания: "МТК",
//       Показатель: "Прибыль",
//       "Итого 2021": 70,
//       "Итого 2022": 70,
//       "Итого 2023": 70,
//     },
//   ],
// };
//
// const example2: TableResponse = {
//   id: "2",
//   isDefault: true,
//   type: "table",
//   title: "Ещё одни лидеры",
//   split: true,
//   by: "Компания",
//   indicators: [
//     "Доход",
//     "Расход",
//     "Валовая прибыль",
//     "EBITDA",
//     "Чистая прибыль",
//   ],
//   dates: "custom",
//   charts: [],
//   groups: ["Северсталь", "МТК", "ЧВК"],
//   periods: [
//     "Итого 2021",
//     "Итого 2022",
//     "Итого 2023",
//     "Итого 2024",
//     "Итого 2025",
//   ],
//   data: [
//     {
//       Компания: "Северсталь",
//       Показатель: "Доход",
//       "Итого 2021": 200,
//       "Итого 2022": 250,
//       "Итого 2023": 300,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//     {
//       Компания: "Северсталь",
//       Показатель: "Расход",
//       "Итого 2021": 100,
//       "Итого 2022": 120,
//       "Итого 2023": 170,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//     {
//       Компания: "Северсталь",
//       Показатель: "Валовая прибыль",
//       "Итого 2021": 100,
//       "Итого 2022": 130,
//       "Итого 2023": 130,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//     {
//       Компания: "Северсталь",
//       Показатель: "EBITDA",
//       "Итого 2021": 100,
//       "Итого 2022": 130,
//       "Итого 2023": 130,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//     {
//       Компания: "Северсталь",
//       Показатель: "Чистая прибыль",
//       "Итого 2021": 100,
//       "Итого 2022": 120,
//       "Итого 2023": 170,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//     {
//       Компания: "МТК",
//       Показатель: "Доход",
//       "Итого 2021": 150,
//       "Итого 2022": 170,
//       "Итого 2023": 190,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//     {
//       Компания: "МТК",
//       Показатель: "Расход",
//       "Итого 2021": 80,
//       "Итого 2022": 100,
//       "Итого 2023": 120,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//     {
//       Компания: "МТК",
//       Показатель: "Валовая прибыль",
//       "Итого 2021": 70,
//       "Итого 2022": 70,
//       "Итого 2023": 70,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//     {
//       Компания: "МТК",
//       Показатель: "EBITDA",
//       "Итого 2021": 80,
//       "Итого 2022": 100,
//       "Итого 2023": 120,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//     {
//       Компания: "МТК",
//       Показатель: "Чистая прибыль",
//       "Итого 2021": 70,
//       "Итого 2022": 70,
//       "Итого 2023": 70,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//     {
//       Компания: "ЧВК",
//       Показатель: "Доход",
//       "Итого 2021": 150,
//       "Итого 2022": 170,
//       "Итого 2023": 190,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//     {
//       Компания: "ЧВК",
//       Показатель: "Расход",
//       "Итого 2021": 80,
//       "Итого 2022": 100,
//       "Итого 2023": 120,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//     {
//       Компания: "ЧВК",
//       Показатель: "Валовая прибыль",
//       "Итого 2021": 70,
//       "Итого 2022": 70,
//       "Итого 2023": 70,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//     {
//       Компания: "ЧВК",
//       Показатель: "EBITDA",
//       "Итого 2021": 80,
//       "Итого 2022": 100,
//       "Итого 2023": 120,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//     {
//       Компания: "ЧВК",
//       Показатель: "Чистая прибыль",
//       "Итого 2021": 70,
//       "Итого 2022": 70,
//       "Итого 2023": 70,
//       "Итого 2024": 300,
//       "Итого 2025": 300,
//     },
//   ],
// };
//
// const example3: TableResponse = {
//   id: "3",
//   isDefault: true,
//   type: "table",
//   title: "Кастомный заголовок",
//   split: true,
//   by: "Компания",
//   indicators: ["Доход", "Расход", "Прибыль"],
//   dates: "custom",
//   charts: [],
//   groups: ["Северсталь", "МТК"],
//   periods: ["Итого 2021", "Итого 2022", "Итого 2023"],
//   data: [
//     {
//       Компания: "Северсталь",
//       Показатель: "Доход",
//       "Итого 2021": 200,
//       "Итого 2022": 250,
//       "Итого 2023": 300,
//     },
//     {
//       Компания: "Северсталь",
//       Показатель: "Расход",
//       "Итого 2021": 100,
//       "Итого 2022": 120,
//       "Итого 2023": 170,
//     },
//     {
//       Компания: "Северсталь",
//       Показатель: "Прибыль",
//       "Итого 2021": 100,
//       "Итого 2022": 130,
//       "Итого 2023": 130,
//     },
//     {
//       Компания: "МТК",
//       Показатель: "Доход",
//       "Итого 2021": 150,
//       "Итого 2022": 170,
//       "Итого 2023": 190,
//     },
//     {
//       Компания: "МТК",
//       Показатель: "Расход",
//       "Итого 2021": 80,
//       "Итого 2022": 100,
//       "Итого 2023": 120,
//     },
//     {
//       Компания: "МТК",
//       Показатель: "Прибыль",
//       "Итого 2021": 70,
//       "Итого 2022": 70,
//       "Итого 2023": 70,
//     },
//   ],
// };

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

  const [currentReport, setCurrentReport] = useState<MarketReport | null>(null);
  const [reportSettings, setReportSettings] =
    useState<MarketReportRequest | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState("");

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (userStore.user) {
        const report = await reportsStore.getReport(
          id as string,
          userStore.user?.user_id,
        );

        if (report) {
          setCurrentReport(report);
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

  const handleBlockChange = (blockId: string, newData: TableResponse) => {
    const index = currentReport?.blocks.findIndex(
      (block) => block.id === blockId,
    );
    currentReport?.blocks.splice(index || 0, 1, newData);

    console.log(currentReport?.blocks);

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
      body: createTemplateBody(),
    };

    await templatesStore.createTemplate(newTemplate);

    setIsTemplateModalOpen(false);
    setNewTemplateTitle("");
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
                    <Button
                      className={styles.button}
                      color="transparent"
                      onClick={() => setIsSettingsModalOpen(true)}
                    >
                      <SettingsIcon /> Настройка отчета
                    </Button>
                    <Button
                      className={styles.button}
                      color="grey"
                      onClick={() => setIsTemplateModalOpen(true)}
                    >
                      <SaveIcon /> Сохранить как шаблон
                    </Button>
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
              <Button className={styles.button} color="transparent">
                <RefreshIcon /> Сгенерировать заново
              </Button>
              <Button
                onClick={() => toPDF()}
                className={styles.button}
                color="blue"
              >
                <DownloadIcon /> Экспортировать в PDF
              </Button>
            </div>
          </>
        )}
      </div>
      {isTemplateModalOpen && (
        <ConfirmModal
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
      {isSettingsModalOpen && (
        <Modal
          closeModal={() => {
            setIsSettingsModalOpen(false);
          }}
        >
          <ReportSettings
            report={reportSettings as MarketReportRequest}
            onConfirm={setReportSettings}
          />
        </Modal>
      )}
    </ReportContext.Provider>
  );
};

export default observer(ReportView);
