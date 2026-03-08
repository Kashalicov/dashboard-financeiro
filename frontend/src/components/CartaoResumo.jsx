const formatador = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function CartaoResumo({ titulo, valor, variante }) {
  return (
    <div className={`cartao cartao-${variante}`}>
      <span className="cartao-titulo">{titulo}</span>
      <span className="cartao-valor">{formatador.format(valor || 0)}</span>
    </div>
  );
}
