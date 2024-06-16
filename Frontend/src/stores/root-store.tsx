import ReportsStore from "./reports-store.tsx";
import UserStore from "./user-store.tsx";
import TemplatesStore from "./templates-store.tsx";
import NotificationsStore from "./notifications-store.tsx";

class RootStore {
  userStore: UserStore;
  reportsStore: ReportsStore;
  templatesStore: TemplatesStore;
  notificationsStore: NotificationsStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.reportsStore = new ReportsStore(this);
    this.templatesStore = new TemplatesStore(this);
    this.notificationsStore = new NotificationsStore();
  }
}

export default RootStore;
