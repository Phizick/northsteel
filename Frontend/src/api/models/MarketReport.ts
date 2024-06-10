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
  id: string; // служебная для реакта
  isDefault: boolean; // служебная для разделения на редактируемые и нередактируемые блоки в интерфейсе
  type: "table" | "text";
  title: string;
  split: boolean; // если false - ищем в целом по рынку/нише, если true - разделеям по:
  by?: string; // указанному здесь параметру (Компания - по компаниям, Регион - по регионам и т.д., что укажет юзер)
  indicators: Array<string>;
  dates: "current" | "custom"; // если current - ищем на текущую дату без разбивок, если "custom" - разбиваем по месяцам/годам в указанном периоде (datesOfReview)
  data?: Array<{ [key: string]: string | null }>;
}

const example: Data = {
  id: "1",
  isDefault: true,
  type: "table",
  title: "Лидеры рынка молока",
  split: true,
  by: "Компания",
  indicators: ["Доход", "Расходы", "Прибыль"],
  dates: "custom",
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

const text = [
  {
    Компания: "Северсталь",
    Выручка: 200,
    Расходы: 100,
    Прибыль: 100,
  },
  {
    Компания: "МТК",
    Выручка: 200,
    Расходы: 100,
    Прибыль: 100,
  },
];
