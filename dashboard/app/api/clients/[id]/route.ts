import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/clients/[id]'>) {
  const { id } = await ctx.params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      products: {
        include: { product: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) {
    return Response.json({ error: "Client not found" }, { status: 404 });
  }

  return Response.json(client);
}

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/clients/[id]'>) {
  const { id } = await ctx.params;
  const body = await request.json();
  const { name, email, phone, document } = body;

  const client = await prisma.client.update({
    where: { id },
    data: { name, email, phone, document },
  });

  return Response.json(client);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/clients/[id]'>) {
  const { id } = await ctx.params;

  await prisma.client.delete({ where: { id } });

  return Response.json({ success: true });
}
