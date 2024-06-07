import { API_URL } from "./index.ts";
import { User } from "./models/User.ts";

export const getUser = async (id: number): Promise<User> => {
  let response = await fetch(`${API_URL}/users/${id}`, {});

  return response.json();
};
