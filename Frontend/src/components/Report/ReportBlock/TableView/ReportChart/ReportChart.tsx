/// <reference types="vite-plugin-svgr/client" />
import styles from "./ReportChart.module.scss";
import { TableResponse } from "../../../../../api/models/MarketReport.ts";
import { ChartOptions, ChartType } from "./types";
import BarChartView from "./BarChartView/BarChartView.tsx";
import LineChartView from "./LineChartView/LineChartView.tsx";
import PieChartView from "./PieChart/PieChartView.tsx";
import AreaChartView from "./AreaChartView/AreaChartView.tsx";
import ButtonSimple from "../../../../../shared/ButtonSimple/ButtonSimple.tsx";
import TooltipButtons from "../../../../../shared/TooltipButtons/TooltipButtons.tsx";
import { useContext } from "react";
import { ReportContext } from "../../../ReportView.tsx";

interface ChartProps {
  block: TableResponse;
  options: ChartOptions;
  index: number;
}

const ReportChart = ({ block, options, index }: ChartProps) => {
  const { handleBlockChange } = useContext(ReportContext);

  const handleDeleteButton = () => {
    if ("charts" in block) {
      const newBlock: TableResponse = {
        ...block,
        charts: block.charts.filter((_, chartIndex) => chartIndex !== index),
      };

      console.log("!!!");

      handleBlockChange(block.id, newBlock);
    }
  };

  if (options.type === ChartType.BAR) {
    return (
      <div className={styles.chart}>
        <TooltipButtons>
          <ButtonSimple className={styles.button} onClick={handleDeleteButton}>
            Удалить
          </ButtonSimple>
        </TooltipButtons>
        <BarChartView block={block} options={options} />
      </div>
    );
  }

  if (options.type === ChartType.LINE) {
    return (
      <div className={styles.chart}>
        <TooltipButtons>
          <ButtonSimple className={styles.button} onClick={handleDeleteButton}>
            Удалить
          </ButtonSimple>
        </TooltipButtons>
        <LineChartView block={block} options={options} />
      </div>
    );
  }

  if (options.type === ChartType.PIE) {
    return (
      <div className={styles.chart}>
        <TooltipButtons>
          <ButtonSimple className={styles.button} onClick={handleDeleteButton}>
            Удалить
          </ButtonSimple>
        </TooltipButtons>
        <PieChartView block={block} options={options} />
      </div>
    );
  }

  if (options.type === ChartType.AREA) {
    return (
      <div className={styles.chart}>
        <TooltipButtons>
          <ButtonSimple className={styles.button} onClick={handleDeleteButton}>
            Удалить
          </ButtonSimple>
        </TooltipButtons>
        <AreaChartView block={block} options={options} />
      </div>
    );
  }
};

export default ReportChart;
