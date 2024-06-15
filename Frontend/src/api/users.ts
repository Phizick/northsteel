import { API_URL } from "./index.ts";
import { User } from "./models/User.ts";

export const getUser = async (id: string): Promise<User> => {
  let response = await fetch(`${API_URL}/users/${id}`, {});

  return response.json();
};

export const patchUser = async (
  id: string,
  body: Partial<User>,
): Promise<{ message: string }> => {
  let response = await fetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response.json();
};
