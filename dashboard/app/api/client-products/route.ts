import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (clientId) where.clientId = clientId;
  if (status) where.status = status;

  const associations = await prisma.clientProduct.findMany({
    where,
    include: { client: true, product: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(associations);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { clientId, productId, status, startDate, expiresAt, notes } = body;
  const association = await prisma.clientProduct.create({
    data: {
      clientId,
      productId,
      status: status || "active",
      startDate: startDate ? new Date(startDate) : new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      notes: notes || null,
    },
    include: { client: true, product: true },
  });
  return Response.json(association, { status: 201 });
}
