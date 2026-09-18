import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role } from "./types";

const secretKey = process.env.AUTH_SECRET ?? "forecast-comercial-dev-secret-change-me";
const encodedKey = new TextEncoder().encode(secretKey);
const COOKIE_NAME = "forecast_session";
const SESSION_TTL = "7d";

export interface SessionPayload {
  userId: number;
  name: string;
  email: string;
  role: Role;
  [key: string]: unknown;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(encodedKey);
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const token = await encrypt(payload);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSessionPayload(): Promise<SessionPayload | null> {
  const store = await cookies();
  return decrypt(store.get(COOKIE_NAME)?.value);
}

export async function deleteSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
