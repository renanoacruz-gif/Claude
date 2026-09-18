import { redirect } from "next/navigation";
import { getCurrentUser, isManager } from "@/lib/dal";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  redirect(isManager(user.role) ? "/gestor" : "/dashboard");
}
