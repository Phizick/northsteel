import { API_URL } from "./index.ts";

export const getReport = async (id: number): Promise<any> => {
  let response = await fetch(`${API_URL}/reports`, {});

  return response.json();
};
