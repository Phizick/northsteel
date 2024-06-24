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
      {block.links && (
        <p className={styles.sources} data-html2canvas-ignore="true">
          Источники:
          {block.links.map((source, index) => (
            <a
              href={source}
              target="_blank"
              key={index}
              className={styles.link}
            >
              {`${index + 1}. ${source}`}
            </a>
          ))}
        </p>
      )}
      <div className={styles.charts}>
        {block.charts.map((chart, i) => (
          <ReportChart block={block} options={chart} key={i} index={i} />
        ))}
      </div>
    </div>
  );
};

export default TableView;
