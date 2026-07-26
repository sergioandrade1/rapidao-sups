import { Link } from "react-router-dom";
import Carrossel from "../ui/Carrossel";
import IconeCategoria from "../ui/IconeCategoria";
import { categorias } from "../../data/categorias";

/** Todas as categorias num trilho horizontal: tile circular + rótulo embaixo. */
export default function CarrosselCategorias() {
  return (
    <section className="container-site py-10">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="titulo-secao">
          Categorias <span className="text-amarelo">/</span>
        </h2>
        <span className="shrink-0 text-sm text-texto-fraco">{categorias.length} categorias</span>
      </div>

      <Carrossel>
        {categorias.map((c) => (
          <Link
            key={c.slug}
            to={`/c/${c.slug}`}
            className="group flex w-24 shrink-0 snap-start flex-col items-center gap-2 sm:w-28"
          >
            <div className="flex size-20 items-center justify-center rounded-full border-2 border-borda bg-grafite-card text-neutral-400 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-amarelo group-hover:bg-grafite-hover group-hover:text-amarelo sm:size-24">
              <IconeCategoria slug={c.slug} size={30} />
            </div>
            <span className="text-center text-[12px] font-bold leading-tight text-neutral-300 transition-colors group-hover:text-amarelo">
              {c.nome}
            </span>
          </Link>
        ))}
      </Carrossel>
    </section>
  );
}
