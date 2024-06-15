/// <reference types="vite-plugin-svgr/client" />
import styles from "./NewReportBlock.module.scss";
import { Data, MarketReportRequest } from "../../../api/models/MarketReport.ts";
import Badge from "../../../shared/Badge/Badge.tsx";
import { Dispatch, SetStateAction } from "react";
import ButtonSimple from "../../../shared/ButtonSimple/ButtonSimple.tsx";
import EditIcon from "../../../assets/images/icons/edit-button.svg?react";
import { EditStatus } from "../../Settings/Settings.tsx";

interface NewReportBlockProps {
  block: Data;
  editStatus: EditStatus | null;
  setKeyToEdit: Dispatch<SetStateAction<string | null>>;
  setEditStatus: Dispatch<SetStateAction<EditStatus | null>>;
  marketReportRequest: MarketReportRequest;
  setMarketReportRequest:
    | Dispatch<SetStateAction<MarketReportRequest>>
    | ((request: MarketReportRequest) => void);
}

const NewReportBlock = ({
  block,
  setKeyToEdit,
  setEditStatus,
  marketReportRequest,
  setMarketReportRequest,
}: NewReportBlockProps) => {
  const { title, type, by, indicators, splitByDates } = block;

  const getFormatedDate = (by: "month" | "year", period: "from" | "to") => {
    if (!marketReportRequest.datesOfReview[period]) {
      return 0;
    }
    if (by === "month") {
      return `${String(marketReportRequest.datesOfReview[period].month() + 1).padStart(2, "0")}.${marketReportRequest.datesOfReview[period].year()}`;
    }
    return marketReportRequest.datesOfReview[period].year();
  };

  const handleDelete = () => {
    const blocks = marketReportRequest.blocks.filter(
      (currentBlock) => currentBlock.id !== block.id,
    );
    setMarketReportRequest({ ...marketReportRequest, blocks: blocks });
  };

  return (
    <div className={styles.block}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.string}>
        <span className={styles.point}>Формат данных:</span>
        <Badge visualType="blue">
          {type === "table" ? "Таблица" : "Текст"}
        </Badge>
      </div>
      <div className={styles.string}>
        {by === "total" ? (
          <span className={styles.point}>Итого по рынку/нише</span>
        ) : (
          <>
            <span className={styles.point}>Разделить по критерию:</span>
            <Badge visualType="blue">{by}</Badge>
          </>
        )}
      </div>
      <div className={styles.string}>
        <span className={styles.point}>Период:</span>
        {!splitByDates ? (
          <span className={styles.point}>на сегодняшнюю дату</span>
        ) : !marketReportRequest.datesOfReview.from ||
          !marketReportRequest.datesOfReview.to ? (
          <span className={styles.point}>не выбраны даты в настройках</span>
        ) : (
          <>
            <span className={styles.point}>с</span>
            <Badge visualType="blue">
              {getFormatedDate(marketReportRequest.datesOfReview.by, "from")}
            </Badge>
            <span className={styles.point}>по</span>
            <Badge visualType="blue">
              {getFormatedDate(marketReportRequest.datesOfReview.by, "to")}
            </Badge>
          </>
        )}
      </div>
      <div className={styles.twoColumns}>
        <span className={styles.point}>Показатели:</span>
        <ul className={styles.list}>
          {indicators &&
            indicators.map((indicator, index) => (
              <li key={index}>
                <Badge>{indicator}</Badge>
              </li>
            ))}
        </ul>
      </div>
      {!block.isDefault && (
        <div className={styles.buttons}>
          <ButtonSimple
            onClick={() => {
              setKeyToEdit(block.id);
              setEditStatus("editing");
            }}
          >
            <EditIcon className={styles.editIcon} /> Редактировать
          </ButtonSimple>
          <ButtonSimple visualType="common" onClick={handleDelete}>
            Удалить
          </ButtonSimple>
        </div>
      )}
    </div>
  );
};

export default NewReportBlock;
