/// <reference types="vite-plugin-svgr/client" />
import styles from "./TableView.module.scss";
import { TableResponse } from "../../../../api/models/MarketReport.ts";
import ReportTable from "./ReportTable/ReportTable.tsx";
import ReportChart from "./ReportChart/ReportChart.tsx";

interface TableViewProps {
  block: TableResponse;
}

const TableView = ({ block }: TableViewProps) => {
  return (
    <div className={styles.tableView}>
      {block.data.length && <ReportTable block={block} />}
      <div className={styles.charts}>
        {block.charts.map((chart, i) => (
          <ReportChart block={block} options={chart} index={i} />
        ))}
      </div>
    </div>
  );
};

export default TableView;
