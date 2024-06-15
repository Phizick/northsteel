/// <reference types="vite-plugin-svgr/client" />
import styles from "./ReportCard.module.scss";
import { MarketReport } from "../../../api/models/MarketReport.ts";
import ButtonSimple from "../../../shared/ButtonSimple/ButtonSimple.tsx";
import DotsIcon from "../../../assets/images/icons/dots.svg?react";
import { useLocation, useNavigate } from "react-router-dom";

interface ReportCard {
  report: MarketReport;
}

const ReportCard = ({ report }: ReportCard) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <ButtonSimple visualType="common" className={styles.dots}>
          <DotsIcon />
        </ButtonSimple>
      </div>
      <h3 className={styles.title}>{report.title}</h3>
      <p
        className={styles.subtitle}
      >{`Рыночные сферы: ${report.market}${report.marketNiche ? `, ${report.marketNiche}` : ""}`}</p>
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
