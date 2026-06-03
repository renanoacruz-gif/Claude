import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const clients = await prisma.client.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { document: { contains: search } },
          ],
        }
      : undefined,
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(clients);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const client = await prisma.client.create({ data: body });
  return Response.json(client, { status: 201 });
}
