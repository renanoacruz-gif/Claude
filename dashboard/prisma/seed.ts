import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.clientProduct.deleteMany();
  await prisma.client.deleteMany();
  await prisma.product.deleteMany();

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: { name: "ERP Empresarial", category: "Software", description: "Sistema integrado de gestão empresarial" },
    }),
    prisma.product.create({
      data: { name: "CRM Pro", category: "Software", description: "Gerenciamento de relacionamento com clientes" },
    }),
    prisma.product.create({
      data: { name: "Suporte Premium", category: "Serviço", description: "Suporte técnico 24/7" },
    }),
    prisma.product.create({
      data: { name: "Cloud Storage 1TB", category: "Infraestrutura", description: "Armazenamento em nuvem com 1TB" },
    }),
    prisma.product.create({
      data: { name: "Backup Automático", category: "Segurança", description: "Backup diário automático dos dados" },
    }),
  ]);

  // Create clients
  const clients = await Promise.all([
    prisma.client.create({
      data: { name: "Empresa Alpha Ltda", email: "contato@alpha.com.br", phone: "(11) 9999-1111", document: "12.345.678/0001-90" },
    }),
    prisma.client.create({
      data: { name: "Beta Tecnologia S.A.", email: "ti@beta.com.br", phone: "(21) 8888-2222", document: "98.765.432/0001-10" },
    }),
    prisma.client.create({
      data: { name: "Gamma Consultoria", email: "admin@gamma.com.br", phone: "(31) 7777-3333", document: "55.123.456/0001-77" },
    }),
  ]);

  const now = new Date();
  const in20Days = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000);
  const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  const in15Days = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
  const pastDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Create associations
  await prisma.clientProduct.createMany({
    data: [
      { clientId: clients[0].id, productId: products[0].id, status: "active", expiresAt: in90Days },
      { clientId: clients[0].id, productId: products[1].id, status: "active", expiresAt: in20Days },
      { clientId: clients[0].id, productId: products[2].id, status: "active" },
      { clientId: clients[1].id, productId: products[3].id, status: "active", expiresAt: in15Days },
      { clientId: clients[1].id, productId: products[4].id, status: "inactive" },
      { clientId: clients[2].id, productId: products[0].id, status: "expired", expiresAt: pastDate },
      { clientId: clients[2].id, productId: products[2].id, status: "active", expiresAt: in90Days },
    ],
  });

  console.log("Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
