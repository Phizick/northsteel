import { makeAutoObservable, runInAction } from "mobx";
import { MarketReport } from "../api/models/MarketReport.ts";
import { getReports, getReport, patchReport } from "../api/reports.ts";
import { isJsonObject } from "../utils/variables.ts";

class ReportsStore {
  userReports: MarketReport[] = [];
  companyReports: MarketReport[] = [];
  isLoading = false;
  error: string | null = null;
  isReady = false;

  constructor() {
    makeAutoObservable(this);
  }

  getUserReports = async (id: string) => {
    this.isLoading = true;
    try {
      const response = await getReports(id);
      if (response.ok) {
        const reports = await response.json();
        runInAction(() => {
          this.userReports = reports;
          this.error = null;
        });
      }
    } catch (error) {
      console.log(error);
      this.error = "Ошибка при получении отчетов";
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  getReport = async (reportId: string, userId: string) => {
    this.isLoading = true;
    try {
      const response = await getReport(reportId, userId);
      if (response.ok) {
        const report = await response.json();

        const converted = report.blocks.map((block) => {
          if (
            block.type === "table" &&
            block.data.length &&
            isJsonObject(block.data)
          ) {
            const data = Object.values(JSON.parse(block.data))[0];

            return {
              ...block,
              data,
            };
          }

          return block;
        });

        const convertedReport = { ...report, blocks: converted };

        console.log(convertedReport);

        return convertedReport;
      }

      return null;
    } catch (error) {
      console.log(error);
      this.error = "Ошибка при получении отчета";
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  patchReport = async (
    reportId: string,
    userId: string,
    report: MarketReport,
  ) => {
    try {
      const response = await patchReport(reportId, userId, report);
      if (response.ok) {
        await response.json();
      }
    } catch (error: unknown) {
      console.log(error);
    } finally {
    }
  };
}

export default new ReportsStore();
