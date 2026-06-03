"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Card } from "@/components/ui/card";

type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  createdAt: Date;
  _count: { clients: number };
};

interface Props {
  initialProducts: Product[];
}

function ProductForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<Product>;
  onSave: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    category: initial?.category || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initial?.id ? `/api/products/${initial.id}` : "/api/products";
      const method = initial?.id ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onSave();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nome *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <Input
        label="Categoria"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="flex gap-3 justify-end mt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : initial?.id ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
}

export function ProductsTable({ initialProducts }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const refresh = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setModalOpen(false);
    setEditProduct(null);
    router.refresh();
  };

  const handleDelete = async (product: Product) => {
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    refresh();
  };

  return (
    <>
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => { setEditProduct(null); setModalOpen(true); }}>
          <Plus size={16} className="mr-1.5" />
          Novo Produto
        </Button>
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Nome</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Categoria</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Descrição</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Clientes</th>
              <th className="text-right px-6 py-3 font-medium text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-3 text-gray-600">{product.category || "-"}</td>
                <td className="px-6 py-3 text-gray-500 max-w-xs truncate">
                  {product.description || "-"}
                </td>
                <td className="px-6 py-3 text-gray-600">{product._count.clients}</td>
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setEditProduct(product); setModalOpen(true); }}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(product)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditProduct(null); }}
        title={editProduct ? "Editar Produto" : "Novo Produto"}
      >
        <ProductForm
          initial={editProduct || undefined}
          onSave={refresh}
          onClose={() => { setModalOpen(false); setEditProduct(null); }}
        />
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmar Exclusão"
      >
        <p className="text-gray-600 mb-4">
          Tem certeza que deseja excluir o produto{" "}
          <strong>{deleteConfirm?.name}</strong>?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
          >
            Excluir
          </Button>
        </div>
      </Modal>
    </>
  );
}
