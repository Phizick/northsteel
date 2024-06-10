/// <reference types="vite-plugin-svgr/client" />
import styles from "./NewReportBlock.module.scss";
import { Data } from "../../../api/models/MarketReport.ts";
import Badge from "../../../shared/Badge/Badge.tsx";
import { Dispatch, SetStateAction, useContext } from "react";
import { NewMarketReportContext } from "../NewReport.tsx";
import ButtonSimple from "../../../shared/ButtonSimple/ButtonSimple.tsx";
import EditIcon from "../../../assets/images/icons/edit-button.svg?react";
import { EditStatus } from "../../../pages/Onboarding/ui/OnboardingSettings/OnboardingSettings.tsx";

interface NewReportBlockProps {
  block: Data;
  editStatus: EditStatus | null;
  setKeyToEdit: Dispatch<SetStateAction<string | null>>;
  setEditStatus: Dispatch<SetStateAction<EditStatus | null>>;
}

const NewReportBlock = ({
  block,
  setKeyToEdit,
  setEditStatus,
  editStatus,
}: NewReportBlockProps) => {
  const { title, type, by, indicators, dates } = block;

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

  console.log(block);

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
        {dates === "current" ? (
          <span className={styles.point}>на сегодняшнюю дату</span>
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
          {indicators.map((indicator, index) => (
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

      {editStatus && <div className={styles.overlay}></div>}
    </div>
  );
};

export default NewReportBlock;
