import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export const getAccessToken = async (): Promise<string> => {
  const now = Date.now();
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const res = await fetch(process.env.AUTH_API!, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.APS_CLIENT_ID!,
      client_secret: process.env.APS_CLIENT_SECRET!,
      grant_type: "client_credentials",
      scope: "data:read data:write",
    }),
  });

  const data: any = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = now + data.expires_in * 1000;
  return cachedToken as string;
}