import { Zap } from "lucide-react";

/** Marca "RS" com raio + wordmark. `compacto` esconde o wordmark (uso em espaços curtos). */
export default function Logo({ compacto = false }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <div className="relative flex size-11 items-center justify-center rounded-full border-2 border-amarelo bg-linear-[135deg,#333,#111]">
        <span className="text-lg font-black italic text-amarelo">RS</span>
        <Zap size={12} className="absolute right-1 top-0.5 fill-amarelo text-amarelo" />
      </div>
      {!compacto && (
        <div className="leading-none">
          <div className="text-[17px] font-black italic tracking-tight">RAPIDÃO</div>
          <div className="text-[10px] font-bold tracking-[0.2em] text-amarelo">SUPLEMENTOS</div>
        </div>
      )}
    </div>
  );
}
