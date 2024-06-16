import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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

const LineChartView = ({ block, options }: ChartProps) => {
  const { chartData, points } = convertToChartData(block, options);

  return (
    <LineChart
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
      <Tooltip />
      <Legend />
      {points.map((point, index) => (
        <Line
          key={index}
          dataKey={point}
          stroke={colors[index % colors.length]}
        />
      ))}
    </LineChart>
  );
};

export default LineChartView;
