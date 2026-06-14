export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Package, Activity, AlertTriangle } from "lucide-react";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

async function getStats() {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [totalClients, totalProducts, activeAssociations, expiringSoon] =
    await Promise.all([
      prisma.client.count(),
      prisma.product.count(),
      prisma.clientProduct.count({ where: { status: "active" } }),
      prisma.clientProduct.findMany({
        where: {
          status: "active",
          expiresAt: { gte: now, lte: thirtyDaysFromNow },
        },
        include: { client: true, product: true },
        orderBy: { expiresAt: "asc" },
      }),
    ]);

  return { totalClients, totalProducts, activeAssociations, expiringSoon };
}

export default async function OverviewPage() {
  const { totalClients, totalProducts, activeAssociations, expiringSoon } =
    await getStats();

  const statCards = [
    {
      title: "Total de Clientes",
      value: totalClients,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total de Produtos",
      value: totalProducts,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Associações Ativas",
      value: activeAssociations,
      icon: Activity,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Expirando em 30 dias",
      value: expiringSoon.length,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Visão Geral</h2>
        <p className="text-gray-500 mt-1">Resumo do sistema de gestão de produtos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(({ title, value, icon: Icon, color, bg }) => (
          <Card key={title}>
            <CardContent className="flex items-center gap-4 py-6">
              <div className={`${bg} p-3 rounded-lg`}>
                <Icon className={`${color}`} size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {expiringSoon.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle size={20} />
              Produtos Expirando em 30 Dias
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Cliente</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Produto</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Expiração</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {expiringSoon.map((assoc) => {
                  const daysLeft = assoc.expiresAt
                    ? Math.ceil(
                        (assoc.expiresAt.getTime() - Date.now()) /
                          (1000 * 60 * 60 * 24)
                      )
                    : null;
                  return (
                    <tr key={assoc.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">
                        {assoc.client.name}
                      </td>
                      <td className="px-6 py-3 text-gray-700">{assoc.product.name}</td>
                      <td className="px-6 py-3 text-gray-600">
                        {assoc.expiresAt
                          ? format(assoc.expiresAt, "dd/MM/yyyy", { locale: ptBR })
                          : "-"}
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant="expiring">
                          {daysLeft !== null ? `${daysLeft} dias` : "—"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {expiringSoon.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-400">
            <AlertTriangle size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum produto expirando nos próximos 30 dias.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
