import { API_URL } from "./index.ts";
import { MarketReport, MarketReportRequest } from "./models/MarketReport.ts";

export const getReports = async (id: string): Promise<Response> => {
  return await fetch(`${API_URL}/reports/?owner_id=${id}`, {});
};

export const getReport = async (
  reportId: string,
  userId: string,
): Promise<Response> => {
  return await fetch(`${API_URL}/reports/${reportId}?owner_id=${userId}`, {});
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
  body: MarketReportRequest,
): Promise<Response> => {
  return await fetch(`${API_URL}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};
