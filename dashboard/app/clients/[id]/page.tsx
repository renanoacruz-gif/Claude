export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { ClientProductsSection } from "./client-products-section";

export default async function ClientDetailPage(props: PageProps<'/clients/[id]'>) {
  const { id } = await props.params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      products: {
        include: { product: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) notFound();

  const allProducts = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  const associatedProductIds = client.products.map((cp) => cp.productId);
  const availableProducts = allProducts.filter(
    (p) => !associatedProductIds.includes(p.id)
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/clients"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Voltar para Clientes
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
        <div className="flex gap-6 mt-2 text-sm text-gray-500">
          {client.email && <span>Email: {client.email}</span>}
          {client.phone && <span>Tel: {client.phone}</span>}
          {client.document && <span>Doc: {client.document}</span>}
        </div>
      </div>

      <ClientProductsSection
        clientId={client.id}
        initialAssociations={client.products}
        availableProducts={availableProducts}
      />
    </div>
  );
}
