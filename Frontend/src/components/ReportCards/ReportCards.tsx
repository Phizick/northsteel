import styles from "./ReportCards.module.scss";
import { MarketReport } from "../../api/models/MarketReport.ts";
import ReportCard from "./ReportCard/ReportCard.tsx";

interface ReportCards {
  reports: MarketReport[];
}

const ReportCards = ({ reports }: ReportCards) => {
  return (
    <ul className={styles.cards}>
      {reports.map((report) => (
        <li key={report.id}>
          <ReportCard report={report} />
        </li>
      ))}
    </ul>
  );
};

export default ReportCards;
