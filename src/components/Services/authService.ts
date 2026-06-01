import { apiFetch } from "./apiClient";
import type { User } from "../types";

interface AuthPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends AuthPayload {
  name: string;
}

interface AuthResponse {
  token: string;
}

export const loginUser = (payload: AuthPayload) => {
  return apiFetch<AuthResponse>("auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export const registerUser = (payload: RegisterPayload) => {
  return apiFetch<AuthResponse>("auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export const getCurrentUser = (token: string) => {
  return apiFetch<User>("me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};