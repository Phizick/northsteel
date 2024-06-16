import { API_URL } from "./index.ts";
import { ITemplate } from "../components/TemplateCards/TemplateCard/TemplateCard.tsx";

export const getTemplates = async (): Promise<Response> => {
  return await fetch(`${API_URL}/templates`);
};

export const createTemplate = async (
  body: ITemplate,
  userID: string,
): Promise<Response> => {
  return await fetch(`${API_URL}/templates/?owner_id=${userID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const patchTemplate = async (
  body: ITemplate,
  templateId: string,
  userID: string,
): Promise<Response> => {
  return await fetch(`${API_URL}/templates/${templateId}/?owner_id=${userID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const deleteTemplate = async (
  templateId: string,
  userID: string,
): Promise<Response> => {
  return await fetch(`${API_URL}/templates/${templateId}/?owner_id=${userID}`, {
    method: "DELETE",
  });
};
