import { makeAutoObservable, runInAction } from "mobx";
import {
  MarketReport,
  MarketReportRequest,
} from "../api/models/MarketReport.ts";
import {
  getReports,
  getReport,
  patchReport,
  createReport,
  deleteReport,
  getCompanyReports,
  recreateReport,
} from "../api/reports.ts";
import RootStore from "./root-store.tsx";
import messages from "../api/messages";
import { CompetitorReportRequest } from "../api/models/CompetitorReport.ts";

class ReportsStore {
  userReports: MarketReport[] = [];
  companyReports: MarketReport[] = [];
  isLoading = false;
  error: string | null = null;
  isReady = false;
  isReportCreating = false;
  createdReportId = "";
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  createReport = async (
    userId: string,
    report: MarketReportRequest | CompetitorReportRequest,
  ) => {
    try {
      this.isReportCreating = true;
      this.createdReportId = "";
      const response = await createReport(userId, report);
      if (response.ok) {
        const report = await response.json();
        runInAction(() => {
          this.createdReportId = report.id;
          this.error = null;
        });
      } else {
        runInAction(() => {
          this.rootStore.notificationsStore.setNotification(
            {
              type: "error",
              message: messages.createReport.error,
            },
            5000,
          );
          this.createdReportId = "";
        });
      }
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.rootStore.notificationsStore.setNotification(
          {
            type: "error",
            message: messages.createReport.error,
          },
          5000,
        );
        this.error = "Ошибка при создании отчета";
      });
    } finally {
      this.isReportCreating = false;
    }
  };

  recreateReport = async (reportId: string, report: MarketReport) => {
    try {
      this.isReportCreating = true;
      this.createdReportId = reportId;
      const response = await recreateReport(report, reportId);
      if (response.ok) {
        await response.json();
        runInAction(() => {
          this.error = null;
        });
      } else {
        runInAction(() => {
          this.rootStore.notificationsStore.setNotification(
            {
              type: "error",
              message: messages.createReport.error,
            },
            5000,
          );
        });
      }
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.rootStore.notificationsStore.setNotification(
          {
            type: "error",
            message: messages.createReport.error,
          },
          5000,
        );
        this.error = "Ошибка при создании отчета";
      });
    } finally {
      this.isReportCreating = false;
    }
  };

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

  getCompanyReports = async (id: string) => {
    this.isLoading = true;
    try {
      const response = await getCompanyReports(id);
      if (response.ok) {
        const reports = await response.json();
        runInAction(() => {
          this.companyReports = reports;
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

  getReport = async (
    reportId: string,
  ): Promise<MarketReport | null | undefined> => {
    this.isLoading = true;
    try {
      const response = await getReport(reportId);
      if (response.ok) {
        return await response.json();
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
        this.rootStore.notificationsStore.setNotification({
          type: "success",
          message: messages.patchReport.success,
        });
      } else {
        this.rootStore.notificationsStore.setNotification({
          type: "error",
          message: messages.patchReport.error,
        });
      }
    } catch (error) {
      console.log(error);
      this.rootStore.notificationsStore.setNotification({
        type: "error",
        message: messages.patchReport.error,
      });
    }
  };

  deleteReport = async (reportId: string, userId: string) => {
    try {
      const response = await deleteReport(reportId, userId);
      if (response.ok) {
        await response.json();
        this.rootStore.notificationsStore.setNotification({
          type: "success",
          message: messages.deleteReport.success,
        });
        return true;
      } else {
        this.rootStore.notificationsStore.setNotification({
          type: "error",
          message: messages.deleteReport.error,
        });

        return false;
      }
    } catch (error) {
      console.log(error);
      this.rootStore.notificationsStore.setNotification({
        type: "error",
        message: messages.deleteReport.error,
      });

      return false;
    }
  };
}

export default ReportsStore;
