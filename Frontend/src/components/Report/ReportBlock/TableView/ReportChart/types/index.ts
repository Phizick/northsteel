export enum ChartType {
  BAR = "bar",
  LINE = "line",
  PIE = "pie",
  AREA = "area",
}

export interface ChartOptions {
  indicator: string;
  multiIndicator: string[];
  by: string;
  points: string;
  type: ChartType;
  title?: string;
  height: number;
  width: number;
}
