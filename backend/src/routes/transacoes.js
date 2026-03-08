const express = require("express");
const db = require("../db");

const router = express.Router();

function validarTransacao(body) {
  const { descricao, valor, tipo, data } = body;

  if (!descricao || !descricao.trim()) return "A descrição é obrigatória.";
  if (typeof valor !== "number" || valor <= 0) return "O valor deve ser um número positivo.";
  if (!["receita", "despesa"].includes(tipo)) return "O tipo deve ser 'receita' ou 'despesa'.";
  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return "A data deve estar no formato AAAA-MM-DD.";

  return null;
}

// Listar transações (com filtro opcional por mês: ?mes=2026-08)
router.get("/", (req, res) => {
  const { mes } = req.query;

  let transacoes;
  if (mes) {
    transacoes = db
      .prepare("SELECT * FROM transacoes WHERE data LIKE ? ORDER BY data DESC")
      .all(`${mes}%`);
  } else {
    transacoes = db.prepare("SELECT * FROM transacoes ORDER BY data DESC").all();
  }

  res.json(transacoes);
});

// Criar transação
router.post("/", (req, res) => {
  const erro = validarTransacao(req.body);
  if (erro) return res.status(400).json({ erro });

  const { descricao, valor, tipo, categoria, data } = req.body;

  const resultado = db
    .prepare(
      "INSERT INTO transacoes (descricao, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)"
    )
    .run(descricao.trim(), valor, tipo, categoria || "geral", data);

  const transacao = db
    .prepare("SELECT * FROM transacoes WHERE id = ?")
    .get(resultado.lastInsertRowid);

  res.status(201).json(transacao);
});

// Excluir transação
router.delete("/:id", (req, res) => {
  const transacao = db
    .prepare("SELECT * FROM transacoes WHERE id = ?")
    .get(req.params.id);

  if (!transacao) {
    return res.status(404).json({ erro: "Transação não encontrada." });
  }

  db.prepare("DELETE FROM transacoes WHERE id = ?").run(req.params.id);
  res.status(204).send();
});

module.exports = router;
