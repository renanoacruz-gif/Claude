import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionPayload } from "./session";
import { getUserById } from "./db";
import type { Role, User } from "./types";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const payload = await getSessionPayload();
  if (!payload) return null;
  const user = getUserById(payload.userId);
  if (!user || !user.active) return null;
  return user;
});

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(...roles: Role[]): Promise<User> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    redirect(user.role === "executive" ? "/dashboard" : "/gestor");
  }
  return user;
}

export function isManager(role: Role) {
  return role === "manager" || role === "admin";
}
