import { makeAutoObservable, runInAction } from "mobx";
import { ITemplate } from "../components/TemplateCards/TemplateCard/TemplateCard.tsx";
import {
  createTemplate,
  getTemplates,
  patchTemplate,
  deleteTemplate,
} from "../api/templates.ts";
import RootStore from "./root-store.tsx";
import messages from "../api/messages";

class TemplatesStore {
  templates: ITemplate[] = [];
  isLoading = false;
  error: string | null = null;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  getTemplates = async () => {
    this.isLoading = true;
    try {
      const response = await getTemplates();
      if (response.ok) {
        const templates = await response.json();
        runInAction(() => {
          this.templates = templates;
          this.error = null;
        });
      }
    } catch (error) {
      console.log(error);
      this.error = "Ошибка при получении шаблонов";
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  createTemplate = async (body: ITemplate, userId: string) => {
    this.isLoading = true;
    try {
      const response = await createTemplate(body, userId);

      if (response.ok) {
        await response.json();
        runInAction(() => {
          this.rootStore.notificationsStore.setNotification({
            type: "success",
            message: messages.createTemplate.success,
          });
        });
      } else {
        this.rootStore.notificationsStore.setNotification({
          type: "error",
          message: messages.createTemplate.error,
        });
      }
    } catch (error: unknown) {
      console.log(error);
      this.rootStore.notificationsStore.setNotification({
        type: "error",
        message: messages.createTemplate.error,
      });
      this.error = `Ошибка при сохранении`;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  patchTemplate = async (
    templateId: string,
    userId: string,
    body: ITemplate,
  ) => {
    try {
      const response = await patchTemplate(body, templateId, userId);
      if (response.ok) {
        await response.json();
        this.rootStore.notificationsStore.setNotification({
          type: "success",
          message: messages.patchTemplate.success,
        });
      } else {
        this.rootStore.notificationsStore.setNotification({
          type: "error",
          message: messages.patchTemplate.error,
        });
      }
    } catch (error) {
      console.log(error);
      this.rootStore.notificationsStore.setNotification({
        type: "error",
        message: messages.patchTemplate.error,
      });
    }
  };

  deleteTemplate = async (templateId: string, userId: string) => {
    try {
      const response = await deleteTemplate(templateId, userId);
      if (response.ok) {
        await response.json();
        this.templates = this.templates.filter(
          (template) => template.template_id !== templateId,
        );
        this.rootStore.notificationsStore.setNotification({
          type: "success",
          message: messages.deleteTemplate.success,
        });
        return true;
      } else {
        this.rootStore.notificationsStore.setNotification({
          type: "error",
          message: messages.deleteTemplate.error,
        });

        return false;
      }
    } catch (error) {
      console.log(error);
      this.rootStore.notificationsStore.setNotification({
        type: "error",
        message: messages.deleteTemplate.error,
      });

      return false;
    }
  };
}

export default TemplatesStore;
