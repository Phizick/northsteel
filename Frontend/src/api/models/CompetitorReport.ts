import { AutoupdateStatus, ReportType } from "./MarketReport.ts";

export interface CompetitorReportRequest {
  title: string;
  type: ReportType;
  competitorName: string;
  autoupdate: AutoupdateStatus;
}
