import { Truck } from "lucide-react";
import { brl } from "../../lib/formato";

/** Barra de progresso rumo ao frete grátis — puxa o ticket médio pra cima. */
export default function BarraFreteGratis({ falta, progresso, atingiu }) {
  return (
    <div className="rounded-xl border border-borda bg-grafite-card p-4">
      <div className="mb-2 flex items-center gap-2 text-sm">
        <Truck size={18} className={atingiu ? "text-zap" : "text-amarelo"} />
        {atingiu ? (
          <span className="font-bold text-zap">Você ganhou frete grátis! 🎉</span>
        ) : (
          <span>
            Faltam <strong className="text-amarelo">{brl(falta)}</strong> para o frete grátis
          </span>
        )}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
        <div
          className={`h-full rounded-full transition-all duration-300 ${atingiu ? "bg-zap" : "bg-amarelo"}`}
          style={{ width: `${progresso * 100}%` }}
        />
      </div>
    </div>
  );
}
