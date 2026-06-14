export const dynamic = "force-dynamic";

import Link from "next/link";
import { ClientsTable } from "./clients-table";
import prisma from "@/lib/prisma";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-500 mt-1">Gerencie seus clientes</p>
        </div>
      </div>
      <ClientsTable initialClients={clients} />
    </div>
  );
}
