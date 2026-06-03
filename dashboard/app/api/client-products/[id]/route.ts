import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest, ctx: RouteContext<"/api/client-products/[id]">) {
  const { id } = await ctx.params;
  const body = await request.json();
  const { status, startDate, expiresAt, notes } = body;
  const association = await prisma.clientProduct.update({
    where: { id },
    data: {
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      notes,
    },
    include: { client: true, product: true },
  });
  return Response.json(association);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/client-products/[id]">) {
  const { id } = await ctx.params;
  await prisma.clientProduct.delete({ where: { id } });
  return Response.json({ success: true });
}
