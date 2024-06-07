import { API_URL } from "./index.ts";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user_id: number;
}

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  let response = await fetch(`${API_URL}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: request.username,
      password: +request.password,
    }),
  });

  return response.json();
};
