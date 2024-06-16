import { MarketReportRequest } from "../../../api/models/MarketReport.ts";
import styles from "./TemplateCard.module.scss";
import ButtonSimple from "../../../shared/ButtonSimple/ButtonSimple.tsx";
import { Dispatch, SetStateAction, useState } from "react";
import { SwipeableDrawer } from "@mui/material";
import ReportSettings from "../../ReportSettings/ReportSettings.tsx";
import dayjs from "dayjs";
import { useStores } from "../../../stores/root-store-context.ts";
import { CompetitorReportRequest } from "../../../api/models/CompetitorReport.ts";

export interface ITemplate {
  title: string;
  body: MarketReportRequest;
  template_id: string;
}

const TemplateCard = ({ title, body, template_id }: ITemplate) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userStore, templatesStore } = useStores();

  const [currentTemplateSettings, setCurrentTemplateSettings] =
    useState<MarketReportRequest>(() => {
      const convertedFromDate =
        typeof body.datesOfReview.from === "string"
          ? dayjs(body?.datesOfReview.from)
          : body.datesOfReview.from;
      const convertedToDate =
        typeof body.datesOfReview.to === "string"
          ? dayjs(body?.datesOfReview.to)
          : body.datesOfReview.to;

      return {
        ...body,
        datesOfReview: {
          ...body.datesOfReview,
          from: convertedFromDate,
          to: convertedToDate,
        },
      };
    });

  const handleUpdate = async () => {
    templatesStore.patchTemplate(
      template_id,
      userStore.user?.user_id as string,
      {
        body: currentTemplateSettings,
        template_id: template_id,
        title: title,
      },
    );
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    templatesStore.deleteTemplate(
      template_id,
      userStore.user?.user_id as string,
    );
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p
        className={styles.subtitle}
      >{`Рыночные сферы: ${body.market}${body.marketNiche ? `, ${body.marketNiche}` : ""}`}</p>
      <div className={styles.buttonContainer}>
        <ButtonSimple
          className={styles.button}
          onClick={() => setIsModalOpen(true)}
        >
          Открыть шаблон
        </ButtonSimple>
        <ButtonSimple className={styles.deleteButton} onClick={handleDelete}>
          Удалить
        </ButtonSimple>
      </div>
      <SwipeableDrawer
        anchor="right"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOpen={() => setIsModalOpen(true)}
      >
        <div className={styles.wrapper}>
          <ReportSettings
            report={body}
            onConfirm={handleUpdate}
            height="short"
            isCreateButton
            currentState={currentTemplateSettings}
            setCurrentState={
              setCurrentTemplateSettings as Dispatch<
                SetStateAction<MarketReportRequest | CompetitorReportRequest>
              >
            }
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </SwipeableDrawer>
    </div>
  );
};

export default TemplateCard;
