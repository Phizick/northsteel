import { TableResponse } from "../../../../../../api/models/MarketReport.ts";
import { ChartOptions } from "../types";
import { convertToChartData } from "../utils/convertToChartData.ts";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { colors } from "../utils/colors.ts";

interface ChartProps {
  block: TableResponse;
  options: ChartOptions;
}

const AreaChartView = ({ block, options }: ChartProps) => {
  const { chartData, points } = convertToChartData(block, options);

  return (
    <AreaChart
      width={options.width}
      height={options.height}
      data={chartData}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={options.by} />
      <YAxis />
      <Tooltip />
      <Legend />
      {points.map((point, index) => (
        <Area
          type="monotone"
          dataKey={point}
          stackId={index}
          stroke={colors[index % colors.length]}
          fill={colors[index % colors.length]}
        />
      ))}
    </AreaChart>
  );
};

export default AreaChartView;
