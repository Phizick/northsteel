import { API_URL } from "./index.ts";
import { ITemplate } from "../components/Template/Template.tsx";

export const createTemplate = async (body: ITemplate): Promise<Response> => {
  return await fetch(`${API_URL}/templates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};
