process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");

describe("POST /api/transacoes", () => {
  it("cria uma transação válida", async () => {
    const resposta = await request(app).post("/api/transacoes").send({
      descricao: "Salário",
      valor: 3000,
      tipo: "receita",
      categoria: "salario",
      data: "2026-08-05",
    });

    expect(resposta.status).toBe(201);
    expect(resposta.body.descricao).toBe("Salário");
  });

  it("rejeita transação sem descrição", async () => {
    const resposta = await request(app)
      .post("/api/transacoes")
      .send({ valor: 100, tipo: "despesa", data: "2026-08-01" });

    expect(resposta.status).toBe(400);
  });

  it("rejeita valor negativo ou zero", async () => {
    const resposta = await request(app).post("/api/transacoes").send({
      descricao: "Teste",
      valor: -10,
      tipo: "despesa",
      data: "2026-08-01",
    });

    expect(resposta.status).toBe(400);
  });

  it("rejeita tipo inválido", async () => {
    const resposta = await request(app).post("/api/transacoes").send({
      descricao: "Teste",
      valor: 10,
      tipo: "investimento",
      data: "2026-08-01",
    });

    expect(resposta.status).toBe(400);
  });

  it("rejeita data em formato inválido", async () => {
    const resposta = await request(app).post("/api/transacoes").send({
      descricao: "Teste",
      valor: 10,
      tipo: "despesa",
      data: "01/08/2026",
    });

    expect(resposta.status).toBe(400);
  });
});

describe("GET /api/transacoes", () => {
  it("lista transações e filtra por mês", async () => {
    await request(app).post("/api/transacoes").send({
      descricao: "Aluguel Junho",
      valor: 1000,
      tipo: "despesa",
      data: "2026-06-05",
    });
    await request(app).post("/api/transacoes").send({
      descricao: "Aluguel Julho",
      valor: 1000,
      tipo: "despesa",
      data: "2026-07-05",
    });

    const resposta = await request(app).get("/api/transacoes?mes=2026-06");

    expect(resposta.status).toBe(200);
    expect(resposta.body.every((t) => t.data.startsWith("2026-06"))).toBe(true);
  });
});

describe("DELETE /api/transacoes/:id", () => {
  it("exclui uma transação existente", async () => {
    const criada = await request(app).post("/api/transacoes").send({
      descricao: "A excluir",
      valor: 50,
      tipo: "despesa",
      data: "2026-08-01",
    });

    const resposta = await request(app).delete(`/api/transacoes/${criada.body.id}`);
    expect(resposta.status).toBe(204);
  });

  it("retorna 404 ao excluir transação inexistente", async () => {
    const resposta = await request(app).delete("/api/transacoes/999999");
    expect(resposta.status).toBe(404);
  });
});
