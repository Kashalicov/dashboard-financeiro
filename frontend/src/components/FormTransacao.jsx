import { useState } from "react";

export default function FormTransacao({ onCriar }) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("despesa");
  const [categoria, setCategoria] = useState("geral");
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    const valorNumerico = Number(valor);
    if (!descricao.trim() || !valorNumerico || valorNumerico <= 0) {
      setErro("Preencha descrição e um valor positivo.");
      return;
    }

    try {
      await onCriar({ descricao, valor: valorNumerico, tipo, categoria, data });
      setDescricao("");
      setValor("");
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao criar transação.");
    }
  }

  return (
    <form className="form-transacao" onSubmit={handleSubmit}>
      {erro && <p className="erro">{erro}</p>}
      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <input
        type="number"
        placeholder="Valor"
        step="0.01"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="despesa">Despesa</option>
        <option value="receita">Receita</option>
      </select>
      <input
        type="text"
        placeholder="Categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />
      <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
      <button type="submit">+ Adicionar</button>
    </form>
  );
}
