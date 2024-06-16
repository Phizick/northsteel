import { makeAutoObservable, runInAction } from "mobx";

export interface StoreNotification {
  type: "success" | "error";
  message: string;
}

class NotificationsStore {
  notification: StoreNotification | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setNotification(notification: StoreNotification, ms: number = 3000) {
    this.notification = notification;
    setTimeout(
      () =>
        runInAction(() => {
          this.notification = null;
        }),
      ms,
    );
  }
}

export default NotificationsStore;
