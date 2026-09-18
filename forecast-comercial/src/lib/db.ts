import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import type {
  ForecastSnapshot,
  Opportunity,
  OpportunityFilters,
  OpportunityStatus,
  OpportunityWithExecutive,
  RevenueType,
  Role,
  SheetsConnection,
  User,
} from "./types";

const DEFAULT_OPPORTUNITY_TYPES = [
  "Licenciamento",
  "SaaS",
  "Cloud",
  "Serviços",
  "Implantação",
  "Consultoria",
  "Projeto",
  "Outros",
];

function openDb() {
  const dbPath = process.env.DB_PATH ?? path.join(process.cwd(), "data", "forecast.db");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

declare global {
  // eslint-disable-next-line no-var
  var __forecastDb: Database.Database | undefined;
}

export function getDb(): Database.Database {
  if (!global.__forecastDb) {
    global.__forecastDb = openDb();
    migrate(global.__forecastDb);
    seed(global.__forecastDb);
  }
  return global.__forecastDb;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('executive','manager','admin')),
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS opportunity_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS opportunities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client TEXT NOT NULL,
      description TEXT NOT NULL,
      executive_id INTEGER NOT NULL REFERENCES users(id),
      opportunity_type TEXT NOT NULL,
      revenue_type TEXT NOT NULL CHECK(revenue_type IN ('recorrente','nao_recorrente')),
      value REAL NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('previsao','assinatura','vendido','perdida')),
      expected_close_date TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_opportunities_executive ON opportunities(executive_id);

    CREATE TABLE IF NOT EXISTS forecast_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      opportunity_id INTEGER NOT NULL REFERENCES opportunities(id),
      executive_id INTEGER NOT NULL,
      report_date TEXT NOT NULL,
      client TEXT NOT NULL,
      description TEXT NOT NULL,
      value REAL NOT NULL,
      status TEXT NOT NULL,
      expected_close_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_snapshots_opportunity ON forecast_snapshots(opportunity_id);
    CREATE INDEX IF NOT EXISTS idx_snapshots_executive ON forecast_snapshots(executive_id);

    CREATE TABLE IF NOT EXISTS sheets_connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      executive_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
      spreadsheet_id TEXT NOT NULL,
      sheet_name TEXT NOT NULL DEFAULT '',
      last_sync_at TEXT,
      status TEXT NOT NULL DEFAULT 'nunca_sincronizado'
    );
  `);
}

function seed(db: Database.Database) {
  const userCount = db.prepare("SELECT COUNT(*) c FROM users").get() as { c: number };
  if (userCount.c > 0) return;

  const insertType = db.prepare(
    "INSERT INTO opportunity_types (name, sort_order) VALUES (?, ?)"
  );
  DEFAULT_OPPORTUNITY_TYPES.forEach((name, i) => insertType.run(name, i));

  const hash = bcrypt.hashSync("demo123", 10);
  const insertUser = db.prepare(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)"
  );
  const gestor = insertUser.run("Camila Duarte", "gestor@demo.com", hash, "manager");
  const ana = insertUser.run("Ana Ribeiro", "ana@demo.com", hash, "executive");
  const bruno = insertUser.run("Bruno Alves", "bruno@demo.com", hash, "executive");
  const carla = insertUser.run("Carla Nunes", "carla@demo.com", hash, "executive");
  void gestor;

  const execIds = [ana.lastInsertRowid, bruno.lastInsertRowid, carla.lastInsertRowid] as number[];
  const clients = [
    "Tecno Medical",
    "Grupo Vertta",
    "Norte Logística",
    "Fibra Telecom",
    "Aliança Seguros",
    "Porto Varejo",
    "Estrela Educação",
    "Vale Indústrias",
  ];
  const types = DEFAULT_OPPORTUNITY_TYPES;
  const statuses: OpportunityStatus[] = ["previsao", "previsao", "assinatura", "vendido", "perdida"];
  const revenueTypes: RevenueType[] = ["recorrente", "nao_recorrente"];

  let seedDate = new Date();
  seedDate.setDate(seedDate.getDate() - 40);
  let n = 0;
  for (const execId of execIds) {
    for (let i = 0; i < 7; i++) {
      const client = clients[(n + i) % clients.length];
      const type = types[(n * 3 + i) % types.length];
      const status = statuses[(n + i) % statuses.length];
      const revenue = revenueTypes[n % revenueTypes.length];
      const value = 8000 + ((n * 37 + i * 911) % 42000);
      const close = new Date(seedDate);
      close.setDate(close.getDate() + i * 9 + 15);
      const created = new Date(seedDate);
      created.setDate(created.getDate() + i * 3);
      const id = createOpportunityRaw(db, {
        client,
        description: `${type} — ${client}`,
        executive_id: execId,
        opportunity_type: type,
        revenue_type: revenue,
        value,
        status,
        expected_close_date: close.toISOString().slice(0, 10),
        notes: "Proposta apresentada, aguardando retorno do cliente.",
        created_at: created.toISOString(),
      });
      void id;
      n++;
    }
  }
}

function createOpportunityRaw(
  db: Database.Database,
  data: {
    client: string;
    description: string;
    executive_id: number;
    opportunity_type: string;
    revenue_type: RevenueType;
    value: number;
    status: OpportunityStatus;
    expected_close_date: string;
    notes: string | null;
    created_at?: string;
  }
) {
  const createdAt = data.created_at ?? new Date().toISOString();
  const info = db
    .prepare(
      `INSERT INTO opportunities
        (client, description, executive_id, opportunity_type, revenue_type, value, status, expected_close_date, notes, created_at, updated_at)
       VALUES (@client, @description, @executive_id, @opportunity_type, @revenue_type, @value, @status, @expected_close_date, @notes, @created_at, @created_at)`
    )
    .run({ ...data, created_at: createdAt });
  const id = Number(info.lastInsertRowid);
  writeSnapshot(db, id, data.executive_id, createdAt, data.client, data.description, data.value, data.status, data.expected_close_date);
  return id;
}

function writeSnapshot(
  db: Database.Database,
  opportunityId: number,
  executiveId: number,
  reportDate: string,
  client: string,
  description: string,
  value: number,
  status: OpportunityStatus,
  expectedCloseDate: string
) {
  db.prepare(
    `INSERT INTO forecast_snapshots
      (opportunity_id, executive_id, report_date, client, description, value, status, expected_close_date, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(opportunityId, executiveId, reportDate, client, description, value, status, expectedCloseDate, reportDate);
}

// ---------- users ----------

export function getUserByEmail(email: string): User | undefined {
  return getDb().prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined;
}

export function getUserById(id: number): User | undefined {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
}

export function listUsers(): User[] {
  return getDb().prepare("SELECT * FROM users ORDER BY role, name").all() as User[];
}

export function listExecutives(): User[] {
  return getDb()
    .prepare("SELECT * FROM users WHERE role = 'executive' ORDER BY name")
    .all() as User[];
}

export function createUser(input: { name: string; email: string; password: string; role: Role }) {
  const hash = bcrypt.hashSync(input.password, 10);
  return getDb()
    .prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)")
    .run(input.name, input.email, hash, input.role);
}

export function setUserActive(id: number, active: boolean) {
  getDb()
    .prepare("UPDATE users SET active = ?, updated_at = datetime('now') WHERE id = ?")
    .run(active ? 1 : 0, id);
}

export function verifyPassword(user: User, password: string): boolean {
  const row = getDb().prepare("SELECT password_hash FROM users WHERE id = ?").get(user.id) as
    | { password_hash: string }
    | undefined;
  if (!row) return false;
  return bcrypt.compareSync(password, row.password_hash);
}

// ---------- opportunity types ----------

export function listOpportunityTypes(): string[] {
  return (
    getDb()
      .prepare("SELECT name FROM opportunity_types WHERE active = 1 ORDER BY sort_order")
      .all() as { name: string }[]
  ).map((r) => r.name);
}

// ---------- opportunities ----------

function buildFilterClause(filters: OpportunityFilters, scopeExecutiveId?: number) {
  const clauses: string[] = [];
  const params: Record<string, unknown> = {};

  if (scopeExecutiveId) {
    clauses.push("o.executive_id = @scopeExecutiveId");
    params.scopeExecutiveId = scopeExecutiveId;
  } else if (filters.executiveId) {
    clauses.push("o.executive_id = @executiveId");
    params.executiveId = filters.executiveId;
  }
  if (filters.client) {
    clauses.push("o.client LIKE @client");
    params.client = `%${filters.client}%`;
  }
  if (filters.opportunityType) {
    clauses.push("o.opportunity_type = @opportunityType");
    params.opportunityType = filters.opportunityType;
  }
  if (filters.revenueType) {
    clauses.push("o.revenue_type = @revenueType");
    params.revenueType = filters.revenueType;
  }
  if (filters.status) {
    clauses.push("o.status = @status");
    params.status = filters.status;
  }
  if (filters.from) {
    clauses.push("o.expected_close_date >= @from");
    params.from = filters.from;
  }
  if (filters.to) {
    clauses.push("o.expected_close_date <= @to");
    params.to = filters.to;
  }
  return { where: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "", params };
}

export function listOpportunities(
  filters: OpportunityFilters,
  scopeExecutiveId?: number
): OpportunityWithExecutive[] {
  const { where, params } = buildFilterClause(filters, scopeExecutiveId);
  return getDb()
    .prepare(
      `SELECT o.*, u.name AS executive_name
       FROM opportunities o JOIN users u ON u.id = o.executive_id
       ${where}
       ORDER BY o.expected_close_date ASC, o.id DESC`
    )
    .all(params) as OpportunityWithExecutive[];
}

export function getOpportunityById(id: number): OpportunityWithExecutive | undefined {
  return getDb()
    .prepare(
      `SELECT o.*, u.name AS executive_name FROM opportunities o JOIN users u ON u.id = o.executive_id WHERE o.id = ?`
    )
    .get(id) as OpportunityWithExecutive | undefined;
}

export interface OpportunityInput {
  client: string;
  description: string;
  executive_id: number;
  opportunity_type: string;
  revenue_type: RevenueType;
  value: number;
  status: OpportunityStatus;
  expected_close_date: string;
  notes: string | null;
}

export function createOpportunity(input: OpportunityInput): number {
  return createOpportunityRaw(getDb(), input);
}

export function updateOpportunity(id: number, input: OpportunityInput) {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE opportunities SET
      client=@client, description=@description, opportunity_type=@opportunity_type,
      revenue_type=@revenue_type, value=@value, status=@status,
      expected_close_date=@expected_close_date, notes=@notes, updated_at=@now
     WHERE id=@id`
  ).run({ ...input, id, now });
  writeSnapshot(
    db,
    id,
    input.executive_id,
    now,
    input.client,
    input.description,
    input.value,
    input.status,
    input.expected_close_date
  );
}

export function deleteOpportunity(id: number) {
  const db = getDb();
  db.prepare("DELETE FROM forecast_snapshots WHERE opportunity_id = ?").run(id);
  db.prepare("DELETE FROM opportunities WHERE id = ?").run(id);
}

export interface Kpis {
  forecast: number;
  assinatura: number;
  vendido: number;
  perdida: number;
  recorrente: number;
  naoRecorrente: number;
}

export function computeKpis(filters: OpportunityFilters, scopeExecutiveId?: number): Kpis {
  const { where, params } = buildFilterClause(filters, scopeExecutiveId);
  const row = getDb()
    .prepare(
      `SELECT
        COALESCE(SUM(CASE WHEN o.status='previsao' THEN o.value END), 0) AS forecast,
        COALESCE(SUM(CASE WHEN o.status='assinatura' THEN o.value END), 0) AS assinatura,
        COALESCE(SUM(CASE WHEN o.status='vendido' THEN o.value END), 0) AS vendido,
        COALESCE(SUM(CASE WHEN o.status='perdida' THEN o.value END), 0) AS perdida,
        COALESCE(SUM(CASE WHEN o.revenue_type='recorrente' AND o.status != 'perdida' THEN o.value END), 0) AS recorrente,
        COALESCE(SUM(CASE WHEN o.revenue_type='nao_recorrente' AND o.status != 'perdida' THEN o.value END), 0) AS naoRecorrente
       FROM opportunities o
       ${where}`
    )
    .get(params) as Kpis;
  return row;
}

export interface ExecutiveSummaryRow {
  executive_id: number;
  executive_name: string;
  forecast: number;
  assinatura: number;
  vendido: number;
  perdida: number;
}

export function summaryByExecutive(): ExecutiveSummaryRow[] {
  return getDb()
    .prepare(
      `SELECT
        u.id AS executive_id, u.name AS executive_name,
        COALESCE(SUM(CASE WHEN o.status='previsao' THEN o.value END), 0) AS forecast,
        COALESCE(SUM(CASE WHEN o.status='assinatura' THEN o.value END), 0) AS assinatura,
        COALESCE(SUM(CASE WHEN o.status='vendido' THEN o.value END), 0) AS vendido,
        COALESCE(SUM(CASE WHEN o.status='perdida' THEN o.value END), 0) AS perdida
       FROM users u LEFT JOIN opportunities o ON o.executive_id = u.id
       WHERE u.role = 'executive'
       GROUP BY u.id, u.name
       ORDER BY u.name`
    )
    .all() as ExecutiveSummaryRow[];
}

// ---------- snapshots / history ----------

export function listSnapshots(filters: { executiveId?: number; opportunityId?: number }): ForecastSnapshot[] {
  const clauses: string[] = [];
  const params: Record<string, unknown> = {};
  if (filters.executiveId) {
    clauses.push("executive_id = @executiveId");
    params.executiveId = filters.executiveId;
  }
  if (filters.opportunityId) {
    clauses.push("opportunity_id = @opportunityId");
    params.opportunityId = filters.opportunityId;
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return getDb()
    .prepare(`SELECT * FROM forecast_snapshots ${where} ORDER BY created_at DESC, id DESC`)
    .all(params) as ForecastSnapshot[];
}

export interface OpportunityChange {
  opportunity_id: number;
  client: string;
  description: string;
  kind: "nova" | "valor_alterado" | "status_alterado" | "previsao_alterada";
  detail: string;
  report_date: string;
}

export function getRecentChanges(executiveId?: number, sinceDays = 14): OpportunityChange[] {
  const db = getDb();
  const where = executiveId ? "WHERE executive_id = @executiveId" : "";
  const rows = db
    .prepare(
      `WITH ranked AS (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY opportunity_id ORDER BY created_at DESC, id DESC) rn
        FROM forecast_snapshots
        ${where}
      )
      SELECT * FROM ranked WHERE rn <= 2 ORDER BY opportunity_id, rn`
    )
    .all(executiveId ? { executiveId } : {}) as (ForecastSnapshot & { rn: number })[];

  const since = new Date();
  since.setDate(since.getDate() - sinceDays);
  const byOpportunity = new Map<number, (ForecastSnapshot & { rn: number })[]>();
  for (const r of rows) {
    if (!byOpportunity.has(r.opportunity_id)) byOpportunity.set(r.opportunity_id, []);
    byOpportunity.get(r.opportunity_id)!.push(r);
  }

  const changes: OpportunityChange[] = [];
  for (const [, snaps] of byOpportunity) {
    const latest = snaps.find((s) => s.rn === 1)!;
    const previous = snaps.find((s) => s.rn === 2);
    if (new Date(latest.created_at) < since) continue;
    if (!previous) {
      changes.push({
        opportunity_id: latest.opportunity_id,
        client: latest.client,
        description: latest.description,
        kind: "nova",
        detail: "Entrou no forecast",
        report_date: latest.created_at,
      });
      continue;
    }
    if (previous.status !== latest.status) {
      changes.push({
        opportunity_id: latest.opportunity_id,
        client: latest.client,
        description: latest.description,
        kind: "status_alterado",
        detail: `Status: ${previous.status} → ${latest.status}`,
        report_date: latest.created_at,
      });
    }
    if (previous.value !== latest.value) {
      const dir = latest.value > previous.value ? "aumentou" : "diminuiu";
      changes.push({
        opportunity_id: latest.opportunity_id,
        client: latest.client,
        description: latest.description,
        kind: "valor_alterado",
        detail: `Valor ${dir}: ${previous.value} → ${latest.value}`,
        report_date: latest.created_at,
      });
    }
    if (previous.expected_close_date !== latest.expected_close_date) {
      changes.push({
        opportunity_id: latest.opportunity_id,
        client: latest.client,
        description: latest.description,
        kind: "previsao_alterada",
        detail: `Previsão: ${previous.expected_close_date} → ${latest.expected_close_date}`,
        report_date: latest.created_at,
      });
    }
  }
  return changes.sort((a, b) => (a.report_date < b.report_date ? 1 : -1));
}

// ---------- sheets connections ----------

export function getSheetsConnection(executiveId: number): SheetsConnection | undefined {
  return getDb()
    .prepare("SELECT * FROM sheets_connections WHERE executive_id = ?")
    .get(executiveId) as SheetsConnection | undefined;
}

export function listSheetsConnections(): (SheetsConnection & { executive_name: string })[] {
  return getDb()
    .prepare(
      `SELECT sc.*, u.name AS executive_name FROM sheets_connections sc JOIN users u ON u.id = sc.executive_id`
    )
    .all() as (SheetsConnection & { executive_name: string })[];
}

export function upsertSheetsConnection(executiveId: number, spreadsheetId: string, sheetName: string) {
  getDb()
    .prepare(
      `INSERT INTO sheets_connections (executive_id, spreadsheet_id, sheet_name, status)
       VALUES (?, ?, ?, 'nunca_sincronizado')
       ON CONFLICT(executive_id) DO UPDATE SET spreadsheet_id = excluded.spreadsheet_id, sheet_name = excluded.sheet_name`
    )
    .run(executiveId, spreadsheetId, sheetName);
}

export function markSheetsSync(executiveId: number, status: "conectado" | "erro") {
  getDb()
    .prepare(
      "UPDATE sheets_connections SET status = ?, last_sync_at = datetime('now') WHERE executive_id = ?"
    )
    .run(status, executiveId);
}

export function findOpportunityByClientAndDescription(
  executiveId: number,
  client: string,
  description: string
): Opportunity | undefined {
  return getDb()
    .prepare(
      "SELECT * FROM opportunities WHERE executive_id = ? AND client = ? AND description = ?"
    )
    .get(executiveId, client, description) as Opportunity | undefined;
}
