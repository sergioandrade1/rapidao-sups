import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, X } from "lucide-react";
import Badge from "./Badge";
import Estrelas from "./Estrelas";
import ImagemProduto from "./ImagemProduto";
import { brl, percentualDesconto } from "../../lib/formato";
import { useCarrinho } from "../../context/CarrinhoContext";

/**
 * Card de produto do grid.
 *
 * Produto com sabor não vai direto pro carrinho: abre a escolha sobre o card.
 * Antes ele adicionava a primeira variante em silêncio, e o cliente só
 * descobria o sabor errado quando o pedido chegava em casa.
 */
export default function CardProduto({ produto }) {
  const { adicionar } = useCarrinho();
  const [escolhendo, setEscolhendo] = useState(false);

  const desconto = percentualDesconto(produto.preco_de_centavos, produto.preco_centavos);
  const freteGratis = produto.tag === "FRETE GRÁTIS";
  const temSabor = produto.variantes.length > 0;
  const semEstoque = temSabor
    ? produto.variantes.every((v) => v.estoque === 0)
    : produto.estoque === 0;

  function aoClicarAdicionar() {
    if (temSabor) setEscolhendo(true);
    else adicionar(produto, null, 1);
  }

  return (
    <article className="card-superficie group relative flex flex-col overflow-hidden hover:-translate-y-1 hover:border-amarelo">
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
          {/* Altura reservada mesmo sem desconto, para os cards alinharem */}
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
          onClick={aoClicarAdicionar}
          className="btn-primario mt-2 w-full py-2.5 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
        >
          {semEstoque ? (
            "Indisponível"
          ) : temSabor ? (
            "Escolher sabor"
          ) : (
            <>
              <Plus size={16} strokeWidth={3} />
              Adicionar
            </>
          )}
        </button>
      </div>

      {/* Escolha de sabor sobre o próprio card */}
      {escolhendo && (
        <div className="absolute inset-0 z-10 flex flex-col bg-grafite-card/97 p-3.5 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-[13px] font-extrabold uppercase tracking-widest text-amarelo">
              Escolha o sabor
            </h4>
            <button
              type="button"
              onClick={() => setEscolhendo(false)}
              aria-label="Fechar escolha de sabor"
              className="text-texto-fraco hover:text-texto"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
            {produto.variantes.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={v.estoque === 0}
                onClick={() => {
                  adicionar(produto, v, 1);
                  setEscolhendo(false);
                }}
                className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold transition-colors ${
                  v.estoque === 0
                    ? "cursor-not-allowed border-borda text-texto-tenue line-through"
                    : "border-borda-clara text-neutral-200 hover:border-amarelo hover:text-amarelo"
                }`}
              >
                {v.rotulo}
                {v.estoque === 0 && <span className="ml-1 text-[10px]">(esgotado)</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
