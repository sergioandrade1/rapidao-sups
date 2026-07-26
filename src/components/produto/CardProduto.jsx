import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import Badge from "./Badge";
import ImagemProduto from "./ImagemProduto";
import Estrelas from "./Estrelas";
import { brl, percentualDesconto } from "../../lib/formato";
import { useCarrinho } from "../../context/CarrinhoContext";

/**
 * Card de produto do grid.
 * O hover é todo CSS (`group-hover`) — no protótipo era um useState por card,
 * o que forçava re-render a cada passada de mouse.
 */
export default function CardProduto({ produto }) {
  const { adicionar } = useCarrinho();
  const desconto = percentualDesconto(produto.preco_de_centavos, produto.preco_centavos);
  const freteGratis = produto.tag === "FRETE GRÁTIS";
  const semEstoque = produto.estoque === 0;

  return (
    <article className="card-superficie group flex flex-col overflow-hidden hover:-translate-y-1 hover:border-amarelo">
      <Link
        to={`/p/${produto.slug}`}
        className="relative flex h-44 items-center justify-center bg-white p-2"
      >
        {produto.tag && (
          <div className="absolute left-2.5 top-2.5">
            <Badge variante={freteGratis ? "verde" : "amarelo"}>{produto.tag}</Badge>
          </div>
        )}
        {desconto > 0 && (
          <div className="absolute right-2.5 top-2.5">
            <Badge variante="alerta">-{desconto}%</Badge>
          </div>
        )}

        <ImagemProduto
          produto={produto}
          className="h-36 w-full px-4 transition-transform duration-200 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <span className="text-[11px] font-bold uppercase tracking-wide text-texto-fraco">
          {produto.marca}
        </span>

        <h3 className="min-h-9 text-sm font-bold leading-tight">
          <Link to={`/p/${produto.slug}`} className="hover:text-amarelo">
            {produto.nome}
          </Link>
        </h3>

        <Estrelas nota={produto.nota} avaliacoes={produto.avaliacoes} />

        <div className="mt-auto pt-2">
          {/* Espaço reservado mesmo sem desconto, para os cards do grid alinharem */}
          <span className="block h-4 text-xs text-texto-tenue line-through">
            {produto.preco_de_centavos ? brl(produto.preco_de_centavos) : ""}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amarelo">{brl(produto.preco_centavos)}</span>
            <span className="text-[11px] font-extrabold text-zap">no PIX</span>
          </div>
        </div>

        <button
          type="button"
          disabled={semEstoque}
          onClick={() => adicionar(produto, produto.variantes[0] ?? null, 1)}
          className="btn-primario mt-2 w-full py-2.5 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
        >
          {semEstoque ? (
            "Indisponível"
          ) : (
            <>
              <Plus size={16} strokeWidth={3} />
              Adicionar
            </>
          )}
        </button>
      </div>
    </article>
  );
}
