import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/products/[id]'>) {
  const { id } = await ctx.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { clients: { include: { client: true } } },
  });

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json(product);
}

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/products/[id]'>) {
  const { id } = await ctx.params;
  const body = await request.json();
  const { name, description, category } = body;

  const product = await prisma.product.update({
    where: { id },
    data: { name, description, category },
  });

  return Response.json(product);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/products/[id]'>) {
  const { id } = await ctx.params;

  await prisma.product.delete({ where: { id } });

  return Response.json({ success: true });
}
