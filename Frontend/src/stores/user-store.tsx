import { makeAutoObservable, runInAction } from "mobx";
import { login } from "../api/login.ts";
import { User } from "../api/models/User.ts";
import { getUser, patchUser } from "../api/users.ts";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

class UserStore {
  user: User | null = null;
  isLoading = false;
  error: string | null = null;
  isReady = false;

  constructor() {
    makeAutoObservable(this);
  }

  getUser = async (id: string) => {
    this.isLoading = true;
    try {
      const user = await getUser(id);
      runInAction(() => {
        this.user = user;
        this.error = null;
      });
    } catch (error) {
      console.log(error);
      this.error = "Ошибка при получении информации о пользователе";
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  login = async (username: string, password: string) => {
    let userId: string | null = null;
    this.isLoading = true;
    try {
      const data = await login({ username, password });
      if (data.message === "Login successful") {
        userId = data.user_id;
        cookies.set("user_id", userId);
        this.error = null;
      } else {
        this.error = "Неправильный логин или пароль";
        this.isLoading = false;
      }
    } catch (error) {
      console.log(error);
      this.error = "Ошибка сервера";
      this.isLoading = false;
    }

    if (userId !== null) {
      await this.getUser(userId);
    }
  };

  logout = () => {
    this.user = null;
    cookies.remove("user_id");
  };

  patchUser = async (id: string, body: Partial<User>) => {
    this.isLoading = true;
    try {
      const response = await patchUser(id, body);
      if (response.message === "User updated.") {
        runInAction(() => {
          if (!this.user) return;
          this.user = { ...this.user, ...body };
          this.error = null;
        });
      }
    } catch (error: unknown) {
      console.log(error);
      this.error = `Ошибка при обновлении данных`;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };
}

export default new UserStore();
