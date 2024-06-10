import { Dayjs } from "dayjs";

export interface MarketReport {
  title: string;
  market: string;
  marketNiche: string;
  splitByDates: boolean;
  datesOfReview: {
    by: "month" | "year";
    from: Dayjs;
    to: Dayjs;
  };
  autoupdate: AutoupdateStatus;
  blocks: Array<Data>;
}

export enum AutoupdateStatus {
  "NONE",
  "DAY",
  "WEEK",
  "MONTH",
  "YEAR",
}

export interface Data {
  type: "table" | "text";
  title: string;
  by: "total" | string;
  indicators: Array<string>;
  data: Array<{ [key: string]: string | null }>;
}

const example: Data = {
  type: "table",
  title: "Лидеры рынка молока",
  by: "Компания",
  indicators: ["Доход", "Расходы", "Прибыль"],
  data: [
    {
      Компания: null,
      Показатель: "Доход",
      "2021г.": null,
      "2022г.": null,
      "2023г.": null,
    },
    {
      Компания: null,
      Показатель: "Расход",
      "2021г.": null,
      "2022г.": null,
      "2023г.": null,
    },
    {
      Компания: null,
      Показатель: "Прибыль",
      "2021г.": null,
      "2022г.": null,
      "2023г.": null,
    },
  ],
};
