/// <reference types="vite-plugin-svgr/client" />
import styles from "./ReportBlock.module.scss";
import {
  LinksResponse,
  MarketReport,
  TableResponse,
  TextResponse,
} from "../../../api/models/MarketReport.ts";
import Button from "../../../shared/Button/Button.tsx";
import TableView from "./TableView/TableView.tsx";
import RefreshIcon from "../../../assets/images/icons/refresh.svg?react";
import EyeClose from "../../../assets/images/icons/eye_close.svg?react";
import EyeOpen from "../../../assets/images/icons/eye_open.svg?react";
import Plus from "../../../assets/images/icons/plus.svg?react";
import ButtonSimple from "../../../shared/ButtonSimple/ButtonSimple.tsx";
import { useContext, useRef, useState } from "react";
import TextView from "./TextView/TextView.tsx";
import { LOCAL_STORAGE_INIT_REPORT, ReportContext } from "../ReportView.tsx";
import { useStores } from "../../../stores/root-store-context.ts";
import { observer } from "mobx-react-lite";
import ConfirmModal from "../../ConfirmModal/ConfirmModal.tsx";
import NewChartModal from "./TableView/NewChartModal/NewChartModal.tsx";
import { ChartOptions, ChartType } from "./TableView/ReportChart/types";
import { isDataInvalid } from "./utils";
import { useNavigate } from "react-router-dom";
import LinksView from "./LinksView/LinksView.tsx";

interface ReportBlockProps {
  block: TableResponse | TextResponse | LinksResponse;
}

const ReportBlock = ({ block }: ReportBlockProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { currentReport } = useContext(ReportContext);

  const { userStore, reportsStore } = useStores();

  const [isLoading, setIsLoading] = useState(false);

  const { handleBlockChange } = useContext(ReportContext);

  const ref = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const [newChartOptions, setNewChartOptions] = useState<ChartOptions>({
    title: "",
    indicator: "",
    multiIndicator: [],
    by: "",
    points: "",
    height: 300,
    width: 500,
    type: ChartType.BAR,
  });

  const isUserReport = () => {
    return userStore.user?.user_id == currentReport?.owner_id;
  };

  const getView = () => {
    if (!block.data) {
      return (
        <div className={styles.noData}>
          Данные по запросу не найдены. Попробуйте поменять настройки отчета и
          сгенерировать блок заново.
        </div>
      );
    }

    if (block.type === "text") {
      return <TextView block={block as TextResponse} />;
    }

    if (block.type === "links") {
      return <LinksView block={block as LinksResponse} />;
    }

    if (isDataInvalid(block)) {
      return (
        <div className={styles.noData}>
          Данные по запросу не найдены. Попробуйте поменять настройки отчета и
          сгенерировать блок заново.
        </div>
      );
    }

    return <TableView block={block as TableResponse} />;
  };

  const hasChanges = () => {
    const storageData = localStorage.getItem(LOCAL_STORAGE_INIT_REPORT);

    if (storageData) {
      const initReport = JSON.parse(storageData) as MarketReport;

      return (
        JSON.stringify(
          initReport?.blocks.find((reportBlock) => reportBlock.id === block.id),
        ) !==
        JSON.stringify(
          currentReport?.blocks.find(
            (reportBlock) => reportBlock.id === block.id,
          ),
        )
      );
    }

    return false;
  };

  const handleConfirm = () => {
    if ("charts" in block) {
      const newBlock: TableResponse = {
        ...block,
        charts: [...block.charts, newChartOptions],
      };

      handleBlockChange(block.id, newBlock);
      setIsModalOpen(false);
    }
  };

  const isSplitByDates = () => {
    if (block.type === "table" && Array.isArray(block.data)) {
      return Object.keys(block.data[0]).some((key) => key === "Показатель");
    }

    return false;
  };

  const handleUpdate = async () => {
    if (currentReport && userStore.user) {
      setIsLoading(true);

      for (let block of currentReport.blocks) {
        if (
          Array.isArray(block.data) &&
          block.data.length &&
          (!block.columnsKeysOrder || !block.columnsKeysOrder.length)
        ) {
          block.columnsKeysOrder = Object.keys(block.data[0]);
        }
      }

      await reportsStore.patchReport(
        currentReport.id as string,
        userStore.user.user_id,
        structuredClone(currentReport),
      );
      setIsLoading(false);
      localStorage.setItem(
        LOCAL_STORAGE_INIT_REPORT,
        JSON.stringify(currentReport),
      );
    }
  };

  const shouldDisplayRightButtons = () =>
    block.type === "text" || (Array.isArray(block.data) && block.data.length);

  const handleRecreateBlock = () => {
    if (currentReport) {
      const blockToRecreate: MarketReport = {
        ...currentReport,
        blocks: [block],
      };

      reportsStore.recreateReport(currentReport?.id as string, blockToRecreate);

      navigate("/waiting");
    }
  };

  return (
    <div className={styles.block} ref={ref}>
      <div className={styles.header}>
        <h2 className={styles.title}>{block.title}</h2>
        <ButtonSimple
          visualType="common"
          onClick={() => {
            if (ref.current) {
              if (isVisible) {
                ref.current.setAttribute("data-html2canvas-ignore", "true");
              } else {
                ref.current.removeAttribute("data-html2canvas-ignore");
              }
            }
            setIsVisible(!isVisible);
          }}
        >
          {isVisible ? (
            <span className={styles.span} data-html2canvas-ignore="true">
              Скрыть <EyeClose />
            </span>
          ) : (
            <span className={styles.span} data-html2canvas-ignore="true">
              Показать <EyeOpen />
            </span>
          )}
        </ButtonSimple>
      </div>
      {isVisible && (
        <div>
          {getView()}
          {isUserReport() && (
            <div className={styles.buttons} data-html2canvas-ignore="true">
              <Button
                color="transparent"
                className={styles.generateButton}
                onClick={() => handleRecreateBlock()}
              >
                <RefreshIcon /> Сгенерировать блок заново
              </Button>
              <div className={styles.rightButtonsContainer}>
                {block.type === "table" &&
                Array.isArray(block.data) &&
                block.data.length ? (
                  <ButtonSimple
                    className={styles.addButton}
                    data-html2canvas-ignore="true"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus /> Добавить график
                  </ButtonSimple>
                ) : null}
                {shouldDisplayRightButtons() ? (
                  <Button
                    color="blue"
                    className={styles.button}
                    disabled={!hasChanges()}
                    onClick={handleUpdate}
                    isLoading={isLoading}
                  >
                    Сохранить изменения
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}
      {isModalOpen && (
        <ConfirmModal
          isModalOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
          confirmText="Добавить график"
        >
          <NewChartModal
            block={block as TableResponse}
            options={newChartOptions}
            setOptions={setNewChartOptions}
            type={isSplitByDates() ? "dates" : "flat"}
          />
        </ConfirmModal>
      )}
    </div>
  );
};

export default observer(ReportBlock);
