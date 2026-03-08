/**
 * Popula o banco com dados de exemplo para facilitar a demonstração do dashboard.
 * Uso: npm run seed
 */
const db = require("../db");

const transacoesExemplo = [
  { descricao: "Salário", valor: 5200, tipo: "receita", categoria: "salario", data: "2026-06-05" },
  { descricao: "Freelance", valor: 800, tipo: "receita", categoria: "extra", data: "2026-06-15" },
  { descricao: "Aluguel", valor: 1500, tipo: "despesa", categoria: "moradia", data: "2026-06-05" },
  { descricao: "Mercado", valor: 650, tipo: "despesa", categoria: "alimentacao", data: "2026-06-10" },
  { descricao: "Internet", valor: 120, tipo: "despesa", categoria: "contas", data: "2026-06-08" },
  { descricao: "Salário", valor: 5200, tipo: "receita", categoria: "salario", data: "2026-07-05" },
  { descricao: "Aluguel", valor: 1500, tipo: "despesa", categoria: "moradia", data: "2026-07-05" },
  { descricao: "Mercado", valor: 720, tipo: "despesa", categoria: "alimentacao", data: "2026-07-12" },
  { descricao: "Cinema", valor: 90, tipo: "despesa", categoria: "lazer", data: "2026-07-20" },
  { descricao: "Salário", valor: 5200, tipo: "receita", categoria: "salario", data: "2026-08-05" },
  { descricao: "Aluguel", valor: 1500, tipo: "despesa", categoria: "moradia", data: "2026-08-05" },
  { descricao: "Mercado", valor: 590, tipo: "despesa", categoria: "alimentacao", data: "2026-08-09" },
  { descricao: "Internet", valor: 120, tipo: "despesa", categoria: "contas", data: "2026-08-08" },
  { descricao: "Curso online", valor: 250, tipo: "despesa", categoria: "educacao", data: "2026-08-14" },
];

const insercao = db.prepare(
  "INSERT INTO transacoes (descricao, valor, tipo, categoria, data) VALUES (@descricao, @valor, @tipo, @categoria, @data)"
);

db.prepare("DELETE FROM transacoes").run();

const inserirTodas = db.transaction((transacoes) => {
  for (const transacao of transacoes) insercao.run(transacao);
});

inserirTodas(transacoesExemplo);

console.log(`${transacoesExemplo.length} transações de exemplo inseridas.`);
