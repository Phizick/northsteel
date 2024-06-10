import styles from "./NewReportBlock.module.scss";
import { Data } from "../../../api/models/MarketReport.ts";
import Badge from "../../../shared/Badge/Badge.tsx";
import { useContext } from "react";
import { NewMarketReportContext } from "../NewReport.tsx";
import ButtonSimple from "../../../shared/ButtonSimple/ButtonSimple.tsx";

interface NewReportBlockProps {
  block: Data;
}

const NewReportBlock = ({ block }: NewReportBlockProps) => {
  const { title, type, by, isDefault, indicators, dates } = block;

  const { marketReportRequest, setMarketReportRequest } = useContext(
    NewMarketReportContext,
  );

  const getFormatedDate = (by: "month" | "year", period: "from" | "to") => {
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
            <span className={styles.point}>Разделить по:</span>
            <Badge visualType="blue">{by}</Badge>
          </>
        )}
      </div>
      <div className={styles.twoColumns}>
        <span className={styles.point}>Показатели:</span>
        <ul className={styles.list}>
          {indicators.map((indicator, index) => (
            <li key={index}>
              <Badge>{indicator}</Badge>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.string}>
        {dates === "current" ? (
          <span className={styles.point}>На сегодняшнюю дату</span>
        ) : (
          <>
            <span className={styles.point}>С</span>
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
      <div className={styles.buttons}>
        <ButtonSimple visualType="common" onClick={handleDelete}>
          Удалить
        </ButtonSimple>
      </div>
    </div>
  );
};

export default NewReportBlock;
