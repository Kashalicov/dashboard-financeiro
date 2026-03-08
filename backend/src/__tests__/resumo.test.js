process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");

async function criarTransacao(dados) {
  return request(app).post("/api/transacoes").send(dados);
}

describe("GET /api/resumo", () => {
  it("calcula totais de receitas, despesas e saldo corretamente", async () => {
    await criarTransacao({ descricao: "Receita 1", valor: 1000, tipo: "receita", data: "2026-08-01" });
    await criarTransacao({ descricao: "Despesa 1", valor: 300, tipo: "despesa", data: "2026-08-02" });

    const resposta = await request(app).get("/api/resumo");

    expect(resposta.status).toBe(200);
    expect(resposta.body.totalReceitas).toBeGreaterThanOrEqual(1000);
    expect(resposta.body.totalDespesas).toBeGreaterThanOrEqual(300);
    expect(resposta.body.saldo).toBe(
      resposta.body.totalReceitas - resposta.body.totalDespesas
    );
  });
});

describe("GET /api/resumo/por-categoria", () => {
  it("agrupa despesas por categoria", async () => {
    await criarTransacao({
      descricao: "Mercado",
      valor: 200,
      tipo: "despesa",
      categoria: "alimentacao",
      data: "2026-08-03",
    });

    const resposta = await request(app).get("/api/resumo/por-categoria");

    expect(resposta.status).toBe(200);
    expect(Array.isArray(resposta.body)).toBe(true);
    const categoria = resposta.body.find((c) => c.categoria === "alimentacao");
    expect(categoria).toBeDefined();
    expect(categoria.total).toBeGreaterThanOrEqual(200);
  });
});
