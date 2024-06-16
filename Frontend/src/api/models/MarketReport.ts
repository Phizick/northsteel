import { Dayjs } from "dayjs";
import { ChartOptions } from "../../components/Report/ReportBlock/TableView/ReportChart/types";

export interface MarketReport {
  id?: string;
  owner_id?: string;
  type: ReportType;
  title: string;
  competitorName?: string;
  market: string;
  marketNiche: string;
  splitByDates: boolean;
  datesOfReview: {
    by: "month" | "year";
    from: string;
    to: string;
  };
  autoupdate: AutoupdateStatus;
  blocks: Array<TableResponse | TextResponse>;
}

export interface MarketReportRequest {
  id?: string;
  type: ReportType;
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

export enum ReportType {
  MARKET = "market",
  COMPETITOR = "competitor",
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
  splitByDates: boolean;
}

export interface TableResponse extends Data {
  charts: ChartOptions[];
  data: { [key: string]: string | number | null }[];
  groups: string[];
  periods: string[];
  columnsKeysOrder?: string[];
}

export interface TextResponse extends Data {
  data: {
    links: {
      title: string;
      url: string;
    }[];
    text: {
      text: {
        [key: string]: string;
      };
    };
  };
  columnsKeysOrder?: string[];
}
