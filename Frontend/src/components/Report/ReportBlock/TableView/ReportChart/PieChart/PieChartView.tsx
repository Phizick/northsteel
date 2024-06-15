import { TableResponse } from "../../../../../../api/models/MarketReport.ts";
import { ChartOptions } from "../types";
import { Cell, Pie, PieChart } from "recharts";
import { convertToChartData } from "../utils/convertToChartData.ts";
import { colors } from "../utils/colors.ts";

interface ChartProps {
  block: TableResponse;
  options: ChartOptions;
}

const PieChartView = ({ block, options }: ChartProps) => {
  const { chartData, points } = convertToChartData(block, options);

  return (
    <PieChart width={options.width} height={options.height}>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey={options.by}
      >
        {points.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default PieChartView;
