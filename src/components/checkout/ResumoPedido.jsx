import { Zap } from "lucide-react";
import { brl } from "../../lib/formato";
import { calcularTotais } from "../../lib/pedido";
import { useJanelaEntrega } from "../../hooks/useJanelaEntrega";

/** Coluna lateral do checkout: itens, totais e previsão de entrega. */
export default function ResumoPedido({ itens, subtotal }) {
  const { frete, freteGratis, total } = calcularTotais(subtotal);
  const janela = useJanelaEntrega();

  const previsao =
    janela.estado === "aberto"
      ? "Chega hoje"
      : janela.estado === "domingo"
        ? "Sai na segunda"
        : janela.estado === "antes"
          ? "Sai hoje após as 9h"
          : "Sai amanhã";

  return (
    <aside className="lg:sticky lg:top-40 lg:self-start">
      <div className="rounded-xl border border-borda bg-grafite-card p-4">
        <h2 className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-amarelo">
          Seu pedido
        </h2>

        <ul className="mb-4 flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
          {itens.map((item) => (
            <li key={item.chave} className="flex gap-2.5">
              <div
                className={`flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-borda p-1 ${
                  item.imagem ? "bg-white" : "bg-preto-poco"
                }`}
              >
                {item.imagem ? (
                  <img src={item.imagem} alt="" className="size-full object-contain" />
                ) : (
                  <Zap size={18} className="fill-amarelo text-amarelo" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-xs font-bold leading-tight">{item.nome}</p>
                <p className="text-[11px] text-texto-fraco">
                  {item.quantidade}x {item.variante ? `· ${item.variante.rotulo}` : ""}
                </p>
              </div>

              <span className="shrink-0 text-xs font-bold text-amarelo">
                {brl(item.preco_centavos * item.quantidade)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="flex flex-col gap-2 border-t border-borda-sutil pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-texto-suave">Subtotal</dt>
            <dd>{brl(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-texto-suave">Entrega</dt>
            <dd className={freteGratis ? "font-bold text-zap" : ""}>
              {freteGratis ? "Grátis" : brl(frete)}
            </dd>
          </div>
          <div className="mt-1 flex items-baseline justify-between border-t border-borda-sutil pt-3">
            <dt className="font-bold">Total</dt>
            <dd className="text-2xl font-black text-amarelo">{brl(total)}</dd>
          </div>
        </dl>

        <p className="mt-3 rounded-lg bg-neutral-900 px-3 py-2 text-center text-xs font-bold text-neutral-300">
          {previsao}
        </p>
      </div>
    </aside>
  );
}
