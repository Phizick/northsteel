import userStore from "./user-store.tsx";
import reportsStore from "./reports-store.tsx";
import templatesStore from "./templates-store.tsx";

class RootStore {
  userStore = userStore;
  reportsStore = reportsStore;
  templatesStore = templatesStore;
}

export default RootStore;
