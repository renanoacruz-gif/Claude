"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Card } from "@/components/ui/card";

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
  createdAt: Date;
  _count: { products: number };
};

interface Props {
  initialClients: Client[];
}

function ClientForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<Client>;
  onSave: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    email: initial?.email || "",
    phone: initial?.phone || "",
    document: initial?.document || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initial?.id ? `/api/clients/${initial.id}` : "/api/clients";
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
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <Input
        label="Telefone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <Input
        label="CNPJ/Documento"
        value={form.document}
        onChange={(e) => setForm({ ...form, document: e.target.value })}
      />
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

export function ClientsTable({ initialClients }: Props) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Client | null>(null);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.document?.includes(search)
  );

  const refresh = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
    setModalOpen(false);
    setEditClient(null);
    router.refresh();
  };

  const handleDelete = async (client: Client) => {
    await fetch(`/api/clients/${client.id}`, { method: "DELETE" });
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
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => { setEditClient(null); setModalOpen(true); }}>
          <Plus size={16} className="mr-1.5" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Nome</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Email</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Telefone</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Documento</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Produtos</th>
              <th className="text-right px-6 py-3 font-medium text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
            {filtered.map((client) => (
              <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-900">{client.name}</td>
                <td className="px-6 py-3 text-gray-600">{client.email || "-"}</td>
                <td className="px-6 py-3 text-gray-600">{client.phone || "-"}</td>
                <td className="px-6 py-3 text-gray-600">{client.document || "-"}</td>
                <td className="px-6 py-3 text-gray-600">{client._count.products}</td>
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/clients/${client.id}`}>
                      <Button variant="ghost" size="sm" title="Ver Produtos">
                        <Eye size={15} className="mr-1" />
                        Ver Produtos
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setEditClient(client); setModalOpen(true); }}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(client)}
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
        onClose={() => { setModalOpen(false); setEditClient(null); }}
        title={editClient ? "Editar Cliente" : "Novo Cliente"}
      >
        <ClientForm
          initial={editClient || undefined}
          onSave={refresh}
          onClose={() => { setModalOpen(false); setEditClient(null); }}
        />
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmar Exclusão"
      >
        <p className="text-gray-600 mb-4">
          Tem certeza que deseja excluir o cliente{" "}
          <strong>{deleteConfirm?.name}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
            Excluir
          </Button>
        </div>
      </Modal>
    </>
  );
}
