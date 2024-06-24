import { MarketReportRequest, ReportType } from "../api/models/MarketReport.ts";
import dayjs from "dayjs";
import { CompetitorReportRequest } from "../api/models/CompetitorReport.ts";
import { Option } from "../shared/MultiSelect/MultiSelect.tsx";

export const initialMarketReportRequest: MarketReportRequest = {
  title: "Новый отчет",
  type: ReportType.MARKET,
  market: "",
  marketNiche: "",
  autoupdate: 0,
  splitByDates: false,
  datesOfReview: {
    by: "month",
    from: dayjs(),
    to: dayjs(),
  },
  blocks: [
    {
      id: "1",
      isDefault: true,
      type: "text",
      title: "Определение игроков рынка",
      split: false,
      by: "",
      splitByDates: false,
      indicators: ["Общая информация", "Драйверы роста", "Тренды в развитии"],
    },
    {
      id: "2",
      isDefault: true,
      type: "table",
      title: "Финансовые показатели",
      split: true,
      by: "Компания",
      splitByDates: false,
      indicators: [
        "Баланс",
        "Выручка",
        "Валовая прибыль (убыток)",
        "Прибыль (убыток) от продаж",
        "Чистая прибыль (убыток)",
      ],
    },
    {
      id: "3",
      isDefault: true,
      type: "text",
      title: "Финансовая отчетность",
      split: true,
      by: "Компания",
      splitByDates: true,
      indicators: [],
    },
  ],
};

export const initialCompetitorReportRequest: CompetitorReportRequest = {
  title: "Новый отчет",
  type: ReportType.COMPETITOR,
  competitorName: "",
  autoupdate: 0,
};

export const autoupdateOptions: Option[] = [
  {
    label: "Каждый день",
    value: "1",
  },
  {
    label: "Каждую неделю",
    value: "2",
  },
  {
    label: "Каждый месяц",
    value: "3",
  },
  {
    label: "Каждый год",
    value: "4",
  },
];

export const thematics = [
  {
    id: "1",
    value: "Металлургия",
    niches: ["Черная металлургия", "Цветная металлургия"],
  },
  {
    id: "2",
    value: "Добыча полезных ископаемых",
    niches: ["Нефть", "Газ"],
  },
];

export function isJsonObject(strData: string) {
  try {
    JSON.parse(strData);
  } catch (e) {
    return false;
  }
  return true;
}
