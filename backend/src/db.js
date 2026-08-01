const path = require("path");
const Database = require("better-sqlite3");

const dbPath =
  process.env.NODE_ENV === "test"
    ? ":memory:"
    : path.join(__dirname, "..", "database.sqlite");

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS transacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    valor REAL NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    categoria TEXT NOT NULL DEFAULT 'geral',
    data TEXT NOT NULL,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

function seedDadosExemplo() {
  const { total } = db.prepare("SELECT COUNT(*) AS total FROM transacoes").get();
  if (total > 0) return;

  const transacoesExemplo = require("./data/transacoesExemplo");
  const insercao = db.prepare(
    "INSERT INTO transacoes (descricao, valor, tipo, categoria, data) VALUES (@descricao, @valor, @tipo, @categoria, @data)"
  );
  const inserirTodas = db.transaction((transacoes) => {
    for (const transacao of transacoes) insercao.run(transacao);
  });
  inserirTodas(transacoesExemplo);
}

if (process.env.NODE_ENV !== "test") {
  seedDadosExemplo();
}

module.exports = db;
