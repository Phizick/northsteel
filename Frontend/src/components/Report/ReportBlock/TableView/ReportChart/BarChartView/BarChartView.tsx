import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TableResponse } from "../../../../../../api/models/MarketReport.ts";
import { colors } from "../utils/colors.ts";
import { ChartOptions } from "../types";
import { convertToChartData } from "../utils/convertToChartData.ts";

interface ChartProps {
  block: TableResponse;
  options: ChartOptions;
}

const BarChartView = ({ block, options }: ChartProps) => {
  const { chartData, points } = convertToChartData(block, options);

  console.log(options);

  return (
    <BarChart
      width={options.width}
      height={options.height}
      data={chartData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={options.by} />
      <YAxis />
      <Tooltip shared={false} trigger="click" />
      <Legend />
      {points.map((point, index) => (
        <Bar key={index} dataKey={point} fill={colors[index % colors.length]} />
      ))}
    </BarChart>
  );
};

export default BarChartView;
