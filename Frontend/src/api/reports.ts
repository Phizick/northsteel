import { API_URL } from "./index.ts";
import { MarketReport, MarketReportRequest } from "./models/MarketReport.ts";
import { CompetitorReportRequest } from "./models/CompetitorReport.ts";

export const getReports = async (id: string): Promise<Response> => {
  return await fetch(`${API_URL}/reports/?owner_id=${id}`, {});
};

export const getCompanyReports = async (id: string): Promise<Response> => {
  return await fetch(`${API_URL}/reports?owner_not=${id}`, {});
};

export const getReport = async (reportId: string): Promise<Response> => {
  return await fetch(`${API_URL}/reports/${reportId}`, {});
};

export const patchReport = async (
  reportId: string,
  userId: string,
  body: MarketReport,
): Promise<Response> => {
  return await fetch(`${API_URL}/reports/${reportId}?owner_id=${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const createReport = async (
  userId: string,
  body: MarketReportRequest | CompetitorReportRequest,
): Promise<Response> => {
  return await fetch(`${API_URL}/reports?owner_id=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const recreateReport = async (
  body: MarketReport,
  reportId: string,
): Promise<Response> => {
  return await fetch(`${API_URL}/reports/${reportId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const deleteReport = async (
  reportId: string,
  userId: string,
): Promise<Response> => {
  return await fetch(`${API_URL}/reports/${reportId}?owner_id=${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
