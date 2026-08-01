/**
 * Popula o banco com dados de exemplo para facilitar a demonstração do dashboard.
 * Uso: npm run seed (apaga e recria as transações de exemplo)
 */
const db = require("../db");
const transacoesExemplo = require("./transacoesExemplo");

const insercao = db.prepare(
  "INSERT INTO transacoes (descricao, valor, tipo, categoria, data) VALUES (@descricao, @valor, @tipo, @categoria, @data)"
);

db.prepare("DELETE FROM transacoes").run();

const inserirTodas = db.transaction((transacoes) => {
  for (const transacao of transacoes) insercao.run(transacao);
});

inserirTodas(transacoesExemplo);

console.log(`${transacoesExemplo.length} transações de exemplo inseridas.`);
