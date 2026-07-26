import { Zap } from "lucide-react";
import { CORTE_MESMO_DIA } from "../../lib/loja";
import { MINIMO_FRETE_GRATIS } from "../../lib/frete";
import { brl } from "../../lib/formato";

export default function FaixaTopo() {
  return (
    <div className="flex items-center justify-center gap-1.5 bg-amarelo px-3 py-1.5 text-center text-[11px] font-extrabold leading-tight text-black sm:text-[12.5px]">
      <Zap size={13} className="hidden shrink-0 fill-black sm:block" />
      <span>
        PEDIDO ATÉ AS {CORTE_MESMO_DIA} = RECEBE NO MESMO DIA 🌪 · FRETE GRÁTIS ACIMA DE{" "}
        {brl(MINIMO_FRETE_GRATIS)}
      </span>
    </div>
  );
}
