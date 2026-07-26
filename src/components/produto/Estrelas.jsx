import { Star } from "lucide-react";

export default function Estrelas({ nota = 5, avaliacoes }) {
  return (
    <div className="mt-0.5 flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= nota ? "fill-amarelo text-amarelo" : "fill-neutral-700 text-neutral-700"}
        />
      ))}
      {avaliacoes != null && (
        <span className="ml-1 text-[11px] text-texto-tenue">({avaliacoes})</span>
      )}
    </div>
  );
}
