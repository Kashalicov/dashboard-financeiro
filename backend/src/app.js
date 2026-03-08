const express = require("express");
const cors = require("cors");

const transacoesRoutes = require("./routes/transacoes");
const resumoRoutes = require("./routes/resumo");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/transacoes", transacoesRoutes);
app.use("/api/resumo", resumoRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

module.exports = app;
