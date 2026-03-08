import { useEffect, useState } from "react";
import api from "./api/client";
import CartaoResumo from "./components/CartaoResumo";
import FormTransacao from "./components/FormTransacao";
import GraficoCategorias from "./components/GraficoCategorias";
import GraficoEvolucao from "./components/GraficoEvolucao";

export default function App() {
  const [resumo, setResumo] = useState({ totalReceitas: 0, totalDespesas: 0, saldo: 0 });
  const [porMes, setPorMes] = useState([]);
  const [porCategoria, setPorCategoria] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarTudo() {
    const [resumoRes, porMesRes, porCategoriaRes, transacoesRes] = await Promise.all([
      api.get("/resumo"),
      api.get("/resumo/por-mes"),
      api.get("/resumo/por-categoria"),
      api.get("/transacoes"),
    ]);

    setResumo(resumoRes.data);
    setPorMes(porMesRes.data);
    setPorCategoria(porCategoriaRes.data);
    setTransacoes(transacoesRes.data);
    setCarregando(false);
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  async function criarTransacao(dados) {
    await api.post("/transacoes", dados);
    await carregarTudo();
  }

  async function excluirTransacao(id) {
    await api.delete(`/transacoes/${id}`);
    await carregarTudo();
  }

  if (carregando) return <p className="carregando">Carregando dashboard...</p>;

  return (
    <div className="dashboard">
      <header>
        <h1>💰 Dashboard Financeiro</h1>
      </header>

      <section className="cartoes">
        <CartaoResumo titulo="Receitas" valor={resumo.totalReceitas} variante="receita" />
        <CartaoResumo titulo="Despesas" valor={resumo.totalDespesas} variante="despesa" />
        <CartaoResumo titulo="Saldo" valor={resumo.saldo} variante="saldo" />
      </section>

      <section className="graficos">
        <div className="grafico-card">
          <h2>Evolução mensal</h2>
          {porMes.length > 0 ? <GraficoEvolucao dados={porMes} /> : <p>Sem dados suficientes ainda.</p>}
        </div>
        <div className="grafico-card">
          <h2>Despesas por categoria</h2>
          {porCategoria.length > 0 ? (
            <GraficoCategorias dados={porCategoria} />
          ) : (
            <p>Sem despesas cadastradas ainda.</p>
          )}
        </div>
      </section>

      <section className="transacoes">
        <h2>Nova transação</h2>
        <FormTransacao onCriar={criarTransacao} />

        <h2>Últimas transações</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((t) => (
              <tr key={t.id}>
                <td>{t.data}</td>
                <td>{t.descricao}</td>
                <td>{t.categoria}</td>
                <td className={t.tipo === "receita" ? "texto-receita" : "texto-despesa"}>{t.tipo}</td>
                <td>{t.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td>
                  <button onClick={() => excluirTransacao(t.id)}>Excluir</button>
                </td>
              </tr>
            ))}
            {transacoes.length === 0 && (
              <tr>
                <td colSpan={6}>Nenhuma transação cadastrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
