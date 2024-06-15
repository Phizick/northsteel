import { makeAutoObservable, runInAction } from "mobx";
import { ITemplate } from "../components/Template/Template.tsx";
import { createTemplate } from "../api/templates.ts";

class TemplatesStore {
  templates: ITemplate[] = [];
  isLoading = false;
  error: string | null = null;
  isReady = false;

  constructor() {
    makeAutoObservable(this);
  }

  createTemplate = async (body: ITemplate) => {
    this.isLoading = true;
    try {
      const response = await createTemplate(body);

      if (response.ok) {
        const newTemplate = await response.json();
        runInAction(() => {
          this.templates = [...this.templates, newTemplate];
        });
      }
    } catch (error: unknown) {
      console.log(error);
      this.error = `Ошибка при сохранении`;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };
}

export default new TemplatesStore();
