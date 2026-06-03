"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Product = {
  id: string;
  name: string;
  category: string | null;
};

type Association = {
  id: string;
  clientId: string;
  productId: string;
  status: string;
  startDate: Date;
  expiresAt: Date | null;
  notes: string | null;
  product: Product;
};

interface Props {
  clientId: string;
  initialAssociations: Association[];
  availableProducts: Product[];
}

function getStatusVariant(status: string, expiresAt: Date | null) {
  if (status === "expired") return "expired";
  if (status === "inactive") return "inactive";
  if (expiresAt) {
    const daysLeft = Math.ceil(
      (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysLeft <= 30 && daysLeft > 0) return "expiring";
    if (daysLeft <= 0) return "expired";
  }
  return "active";
}

const statusOptions = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
  { value: "expired", label: "Expirado" },
];

interface AddFormProps {
  clientId: string;
  availableProducts: Product[];
  onSave: () => void;
  onClose: () => void;
}

function AddProductForm({ clientId, availableProducts, onSave, onClose }: AddFormProps) {
  const [productId, setProductId] = useState("");
  const [status, setStatus] = useState("active");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [expiresAt, setExpiresAt] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    setLoading(true);
    try {
      await fetch("/api/client-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          productId,
          status,
          startDate,
          expiresAt: expiresAt || null,
          notes: notes || null,
        }),
      });
      onSave();
    } finally {
      setLoading(false);
    }
  };

  const productOptions = availableProducts.map((p) => ({
    value: p.id,
    label: p.name + (p.category ? ` (${p.category})` : ""),
  }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Select
        label="Produto *"
        value={productId}
        onValueChange={setProductId}
        options={productOptions}
        placeholder="Selecione um produto"
      />
      <Select
        label="Status"
        value={status}
        onValueChange={setStatus}
        options={statusOptions}
      />
      <Input
        label="Data de Início"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <Input
        label="Data de Expiração"
        type="date"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Notas</label>
        <textarea
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="flex gap-3 justify-end mt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || !productId}>
          {loading ? "Adicionando..." : "Adicionar"}
        </Button>
      </div>
    </form>
  );
}

interface EditFormProps {
  association: Association;
  onSave: () => void;
  onClose: () => void;
}

function EditAssociationForm({ association, onSave, onClose }: EditFormProps) {
  const [status, setStatus] = useState(association.status);
  const [startDate, setStartDate] = useState(
    new Date(association.startDate).toISOString().split("T")[0]
  );
  const [expiresAt, setExpiresAt] = useState(
    association.expiresAt
      ? new Date(association.expiresAt).toISOString().split("T")[0]
      : ""
  );
  const [notes, setNotes] = useState(association.notes || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`/api/client-products/${association.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          startDate,
          expiresAt: expiresAt || null,
          notes: notes || null,
        }),
      });
      onSave();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm font-medium text-gray-700">
        Produto: <span className="text-gray-900">{association.product.name}</span>
      </p>
      <Select
        label="Status"
        value={status}
        onValueChange={setStatus}
        options={statusOptions}
      />
      <Input
        label="Data de Início"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <Input
        label="Data de Expiração"
        type="date"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Notas</label>
        <textarea
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="flex gap-3 justify-end mt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

export function ClientProductsSection({
  clientId,
  initialAssociations,
  availableProducts,
}: Props) {
  const router = useRouter();
  const [associations, setAssociations] =
    useState<Association[]>(initialAssociations);
  const [available, setAvailable] = useState<Product[]>(availableProducts);
  const [addOpen, setAddOpen] = useState(false);
  const [editAssoc, setEditAssoc] = useState<Association | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Association | null>(null);

  const refresh = async () => {
    const res = await fetch(`/api/clients/${clientId}`);
    const data = await res.json();
    setAssociations(data.products);
    const allProducts = await (await fetch("/api/products")).json();
    const associatedIds = data.products.map((cp: Association) => cp.productId);
    setAvailable(allProducts.filter((p: Product) => !associatedIds.includes(p.id)));
    setAddOpen(false);
    setEditAssoc(null);
    router.refresh();
  };

  const handleDelete = async (assoc: Association) => {
    await fetch(`/api/client-products/${assoc.id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    refresh();
  };

  const statusLabel: Record<string, string> = {
    active: "Ativo",
    inactive: "Inativo",
    expired: "Expirado",
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Produtos Associados ({associations.length})</CardTitle>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            disabled={available.length === 0}
          >
            <Plus size={15} className="mr-1.5" />
            Adicionar Produto
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Produto</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Categoria</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Início</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Expiração</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Notas</th>
                <th className="text-right px-6 py-3 font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {associations.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    Nenhum produto associado.
                  </td>
                </tr>
              )}
              {associations.map((assoc) => {
                const variant = getStatusVariant(assoc.status, assoc.expiresAt);
                return (
                  <tr key={assoc.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {assoc.product.name}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {assoc.product.category || "-"}
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={variant}>
                        {variant === "expiring"
                          ? "Expirando"
                          : statusLabel[assoc.status] || assoc.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {format(new Date(assoc.startDate), "dd/MM/yyyy", { locale: ptBR })}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {assoc.expiresAt
                        ? format(new Date(assoc.expiresAt), "dd/MM/yyyy", { locale: ptBR })
                        : "-"}
                    </td>
                    <td className="px-6 py-3 text-gray-500 max-w-xs truncate">
                      {assoc.notes || "-"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditAssoc(assoc)}
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(assoc)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Adicionar Produto"
      >
        <AddProductForm
          clientId={clientId}
          availableProducts={available}
          onSave={refresh}
          onClose={() => setAddOpen(false)}
        />
      </Modal>

      {editAssoc && (
        <Modal
          open={!!editAssoc}
          onClose={() => setEditAssoc(null)}
          title="Editar Associação"
        >
          <EditAssociationForm
            association={editAssoc}
            onSave={refresh}
            onClose={() => setEditAssoc(null)}
          />
        </Modal>
      )}

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmar Remoção"
      >
        <p className="text-gray-600 mb-4">
          Remover <strong>{deleteConfirm?.product.name}</strong> deste cliente?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
          >
            Remover
          </Button>
        </div>
      </Modal>
    </>
  );
}
