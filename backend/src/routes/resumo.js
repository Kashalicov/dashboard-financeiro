const express = require("express");
const db = require("../db");

const router = express.Router();

// Resumo geral: total de receitas, despesas e saldo
router.get("/", (req, res) => {
  const linha = db
    .prepare(
      `SELECT
        COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END), 0) AS totalReceitas,
        COALESCE(SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END), 0) AS totalDespesas
      FROM transacoes`
    )
    .get();

  res.json({
    totalReceitas: linha.totalReceitas,
    totalDespesas: linha.totalDespesas,
    saldo: linha.totalReceitas - linha.totalDespesas,
  });
});

// Totais agrupados por mês (para gráfico de evolução)
router.get("/por-mes", (req, res) => {
  const linhas = db
    .prepare(
      `SELECT
        substr(data, 1, 7) AS mes,
        COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END), 0) AS receitas,
        COALESCE(SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END), 0) AS despesas
      FROM transacoes
      GROUP BY mes
      ORDER BY mes ASC`
    )
    .all();

  res.json(linhas);
});

// Totais agrupados por categoria (para gráfico de pizza/barras)
router.get("/por-categoria", (req, res) => {
  const linhas = db
    .prepare(
      `SELECT categoria, SUM(valor) AS total
      FROM transacoes
      WHERE tipo = 'despesa'
      GROUP BY categoria
      ORDER BY total DESC`
    )
    .all();

  res.json(linhas);
});

module.exports = router;
