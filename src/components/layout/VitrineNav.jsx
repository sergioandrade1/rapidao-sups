import { NavLink } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { vitrines } from "../../data/vitrines";

/**
 * Barra do topo — atalhos comerciais, não categorias.
 *
 * As categorias (25) vivem no carrossel da home e no menu hambúrguer; repeti-las
 * aqui gastava a faixa mais visível do site com navegação duplicada.
 */
export default function VitrineNav() {
  const classe = ({ isActive }, destaque) =>
    [
      "shrink-0 whitespace-nowrap border-b-2 px-3.5 py-3 text-[13px] font-bold transition-colors",
      isActive
        ? "border-amarelo text-amarelo"
        : destaque
          ? "border-transparent text-amarelo hover:border-amarelo"
          : "border-transparent text-neutral-300 hover:border-amarelo hover:text-amarelo",
    ].join(" ");

  return (
    <nav className="border-t border-borda-sutil bg-preto-fundo">
      <div className="container-site scrollbar-oculta flex gap-1 overflow-x-auto">
        {vitrines.map((v) => (
          <NavLink
            key={v.slug}
            to={`/v/${v.slug}`}
            className={(estado) => classe(estado, v.destaque)}
          >
            <span className="mr-1">{v.emoji}</span>
            {v.nome}
          </NavLink>
        ))}

        <NavLink
          to="/produtos"
          className={(estado) =>
            `${classe(estado, false)} ml-auto flex items-center gap-1.5 border-l border-borda-sutil pl-4`
          }
        >
          <LayoutGrid size={14} />
          Todas as categorias
        </NavLink>
      </div>
    </nav>
  );
}
