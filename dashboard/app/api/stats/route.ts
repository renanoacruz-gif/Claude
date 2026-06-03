import prisma from "@/lib/prisma";

export async function GET() {
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
          expiresAt: {
            gte: now,
            lte: thirtyDaysFromNow,
          },
        },
        include: {
          client: true,
          product: true,
        },
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
