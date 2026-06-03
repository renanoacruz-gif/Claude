import prisma from "@/lib/prisma";
import { ProductsTable } from "./products-table";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { _count: { select: { clients: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
        <p className="text-gray-500 mt-1">Gerencie o catálogo de produtos</p>
      </div>
      <ProductsTable initialProducts={products} />
    </div>
  );
}
