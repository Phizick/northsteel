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
  blocks: Array<PlainData | SearchData>;
}

export enum AutoupdateStatus {
  "NONE",
  "DAY",
  "WEEK",
  "MONTH",
  "YEAR",
}

export interface PlainData {
  type: "table" | "text";
  title: string;
  columns?: string[];
  data: {
    type: "fixed";
    rows: { [key: string]: string | null }[];
  };
}

export interface SearchData {
  type: "table" | "text";
  title: string;
  columns?: string[];
  data: {
    type: "search";
    rows: {
      string: string | null;
      subRows: { [key: string]: string | null }[];
    }[];
  };
}
