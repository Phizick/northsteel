/// <reference types="vite-plugin-svgr/client" />
import styles from "./ReportCard.module.scss";
import { MarketReport } from "../../../api/models/MarketReport.ts";
import ButtonSimple from "../../../shared/ButtonSimple/ButtonSimple.tsx";
import { useLocation, useNavigate } from "react-router-dom";

interface ReportCard {
  report: MarketReport;
}

const ReportCard = ({ report }: ReportCard) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{report.title}</h3>
      {report.type === "market" && (
        <p
          className={styles.subtitle}
        >{`Рыночные сферы: ${report.market}${report.marketNiche ? `, ${report.marketNiche}` : ""}`}</p>
      )}{" "}
      {report.type === "competitor" && (
        <p
          className={styles.subtitle}
        >{`Название компании: ${report.competitorName}`}</p>
      )}
      <ButtonSimple
        className={styles.button}
        onClick={() => navigate(`${location.pathname}/${report.id}`)}
      >
        Перейти к отчету
      </ButtonSimple>
    </div>
  );
};

export default ReportCard;
