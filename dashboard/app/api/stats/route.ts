import prisma from "@/lib/prisma";
import { addDays } from "date-fns";

export async function GET() {
  const now = new Date();
  const thirtyDaysLater = addDays(now, 30);

  const [totalClients, totalProducts, activeAssociations, expiringSoon] =
    await Promise.all([
      prisma.client.count(),
      prisma.product.count(),
      prisma.clientProduct.count({ where: { status: "active" } }),
      prisma.clientProduct.findMany({
        where: {
          status: "active",
          expiresAt: { gte: now, lte: thirtyDaysLater },
        },
        include: { client: true, product: true },
        orderBy: { expiresAt: "asc" },
      }),
    ]);

  return Response.json({
    totalClients,
    totalProducts,
    activeAssociations,
    expiringSoonCount: expiringSoon.length,
    expiringSoon,
  });
}
