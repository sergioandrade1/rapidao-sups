import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import Carrossel from "../ui/Carrossel";
import CardProduto from "../produto/CardProduto";
import { SkeletonCard } from "../ui/Skeleton";

/**
 * Faixa de destaque da home.
 *
 * Diferente das outras seções: fundo próprio com brilho amarelo e trilho
 * horizontal, para o bloco "puxar o olho" antes do grid comum de produtos.
 */
export default function SecaoDestaque({ titulo, subtitulo, produtos, carregando, erro, verTodos }) {
  return (
    <section className="relative overflow-hidden border-y border-amarelo/25 bg-[radial-gradient(circle_at_20%_0%,#2a2400_0%,#0d0d0d_55%)]">
      <div className="container-site py-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-amarelo bg-black/40 px-3 py-0.5">
              <Zap size={12} className="fill-amarelo text-amarelo" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amarelo">
                Destaque
              </span>
            </div>
            <h2 className="titulo-secao">{titulo}</h2>
            {subtitulo && <p className="mt-1 text-sm text-texto-suave">{subtitulo}</p>}
          </div>

          {verTodos && (
            <Link to={verTodos} className="shrink-0 text-sm font-bold text-amarelo hover:underline">
              Ver todos →
            </Link>
          )}
        </div>

        {erro ? (
          <p className="py-10 text-center text-sm text-texto-suave">
            Não foi possível carregar os destaques.
          </p>
        ) : (
          <Carrossel>
            {(carregando ? Array.from({ length: 6 }) : produtos ?? []).map((p, i) => (
              <div
                key={p?.id ?? i}
                className="w-[calc(50%-0.375rem)] shrink-0 snap-start sm:w-56"
              >
                {carregando ? <SkeletonCard /> : <CardProduto produto={p} />}
              </div>
            ))}
          </Carrossel>
        )}
      </div>
    </section>
  );
}
