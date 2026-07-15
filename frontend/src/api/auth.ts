import { api } from "./client";

export async function login(username: string, password: string) {
  const body = new URLSearchParams();

  body.append("grant_type", "password");
  body.append("username", username);
  body.append("password", password);

  const response = await fetch("http://127.0.0.1:8000/auth/login", {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();

  localStorage.setItem("token", data.access_token);

  return data;
}
