import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import { useCarrinho } from "../context/CarrinhoContext";
import { brl } from "../lib/formato";
import { useTitulo } from "../hooks/useTitulo";

/**
 * Checkout — apenas o esqueleto da rota nesta fase.
 * O layout em etapas (identificação → entrega → pagamento → revisão) entra na
 * Fase 3; a rota já existe para o fluxo do carrinho não terminar em 404.
 */
export default function Checkout() {
  const { itens, subtotal } = useCarrinho();
  useTitulo("Checkout");

  return (
    <div className="container-site py-12">
      <h1 className="titulo-secao mb-6">Checkout</h1>

      <div className="flex max-w-xl flex-col items-start gap-4 rounded-xl border border-borda bg-grafite-card p-6">
        <Construction size={32} className="text-amarelo" />
        <p className="text-sm text-texto-suave">
          Tela em construção. As etapas de identificação, entrega, pagamento e revisão entram na
          próxima fase.
        </p>
        <p className="text-sm">
          {itens.length} item(ns) no carrinho · Total{" "}
          <strong className="text-amarelo">{brl(subtotal)}</strong>
        </p>
        <Link to="/carrinho" className="btn-secundario">
          Voltar ao carrinho
        </Link>
      </div>
    </div>
  );
}
