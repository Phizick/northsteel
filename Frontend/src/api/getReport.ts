import { API_URL } from "./index.ts";

export const getReport = async (): Promise<any> => {
  let response = await fetch(`${API_URL}/reports`, {});

  return response.json();
};
