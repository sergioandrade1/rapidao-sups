import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2, Zap } from "lucide-react";
import BarraFreteGratis from "../components/carrinho/BarraFreteGratis";
import { useCarrinho } from "../context/CarrinhoContext";
import { brl } from "../lib/formato";
import { useTitulo } from "../hooks/useTitulo";

export default function Carrinho() {
  const {
    itens,
    subtotal,
    totalItens,
    freteGratis,
    faltaFreteGratis,
    progressoFrete,
    definirQuantidade,
    remover,
  } = useCarrinho();

  useTitulo("Carrinho");

  if (itens.length === 0) {
    return (
      <div className="container-site flex flex-col items-center gap-4 py-20 text-center">
        <ShoppingCart size={56} className="text-neutral-700" />
        <h1 className="titulo-secao">Seu carrinho está vazio</h1>
        <p className="max-w-sm text-sm text-texto-suave">
          Bora treinar? Escolha seus suplementos e receba hoje mesmo em Recife e região.
        </p>
        <Link to="/produtos" className="btn-primario mt-2">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="container-site py-8">
      <h1 className="titulo-secao mb-6">
        Carrinho <span className="text-amarelo">({totalItens})</span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-3">
          {itens.map((item) => (
            <article
              key={item.chave}
              className="flex gap-3 rounded-xl border border-borda bg-grafite-card p-3"
            >
              <Link
                to={`/p/${item.slug}`}
                className={`flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-borda p-1 ${
                  item.imagem ? "bg-white" : "bg-preto-poco"
                }`}
              >
                {item.imagem ? (
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    loading="lazy"
                    className="size-full object-contain"
                  />
                ) : (
                  <Zap size={28} className="fill-amarelo text-amarelo" />
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wide text-texto-fraco">
                  {item.marca}
                </span>
                <h2 className="text-sm font-bold leading-tight">
                  <Link to={`/p/${item.slug}`} className="hover:text-amarelo">
                    {item.nome}
                  </Link>
                </h2>
                {item.variante && (
                  <span className="text-xs text-texto-fraco">Sabor: {item.variante.rotulo}</span>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-lg border border-borda-clara">
                    <button
                      type="button"
                      onClick={() => definirQuantidade(item.chave, item.quantidade - 1)}
                      aria-label={`Diminuir quantidade de ${item.nome}`}
                      className="px-2.5 py-1.5 hover:text-amarelo"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantidade}</span>
                    <button
                      type="button"
                      onClick={() => definirQuantidade(item.chave, item.quantidade + 1)}
                      aria-label={`Aumentar quantidade de ${item.nome}`}
                      className="px-2.5 py-1.5 hover:text-amarelo"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remover(item.chave)}
                    aria-label={`Remover ${item.nome}`}
                    className="flex items-center gap-1 text-xs text-texto-fraco hover:text-alerta"
                  >
                    <Trash2 size={14} />
                    Remover
                  </button>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-lg font-black text-amarelo">
                  {brl(item.preco_centavos * item.quantidade)}
                </div>
                {item.quantidade > 1 && (
                  <div className="text-xs text-texto-fraco">{brl(item.preco_centavos)} cada</div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Resumo */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-40 lg:self-start">
          <BarraFreteGratis
            falta={faltaFreteGratis}
            progresso={progressoFrete}
            atingiu={freteGratis}
          />

          <div className="rounded-xl border border-borda bg-grafite-card p-4">
            <h2 className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-amarelo">
              Resumo
            </h2>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-texto-suave">Subtotal</dt>
                <dd>{brl(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-texto-suave">Entrega</dt>
                <dd className={freteGratis ? "font-bold text-zap" : "text-texto-suave"}>
                  {freteGratis ? "Grátis" : "Calculado no checkout"}
                </dd>
              </div>
              <div className="mt-2 flex items-baseline justify-between border-t border-borda-sutil pt-3">
                <dt className="font-bold">Total no PIX</dt>
                <dd className="text-2xl font-black text-amarelo">{brl(subtotal)}</dd>
              </div>
            </dl>

            <Link to="/checkout" className="btn-primario mt-4 w-full">
              Finalizar pedido
            </Link>
            <Link
              to="/produtos"
              className="mt-2 block text-center text-sm font-bold text-amarelo hover:underline"
            >
              Continuar comprando
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
