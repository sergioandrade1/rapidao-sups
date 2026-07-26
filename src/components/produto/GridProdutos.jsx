import CardProduto from "./CardProduto";
import { SkeletonCard } from "../ui/Skeleton";

/** Grid responsivo de produtos, com estados de carregando / vazio / erro. */
export default function GridProdutos({ produtos, carregando, erro, vazioTexto }) {
  if (carregando) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4.5 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (erro) {
    return (
      <p className="py-12 text-center text-sm text-texto-suave">
        Não foi possível carregar os produtos. Tente novamente em instantes.
      </p>
    );
  }

  if (!produtos?.length) {
    return (
      <p className="py-12 text-center text-sm text-texto-suave">
        {vazioTexto ?? "Nenhum produto encontrado com esses filtros."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4.5 lg:grid-cols-4">
      {produtos.map((p) => (
        <CardProduto key={p.id} produto={p} />
      ))}
    </div>
  );
}
