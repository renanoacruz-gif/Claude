import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  const products = await prisma.product.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search } },
            { category: { contains: search } },
          ],
        }
      : undefined,
    include: {
      _count: { select: { clients: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description, category } = body;

  if (!name) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: { name, description, category },
  });

  return Response.json(product, { status: 201 });
}
