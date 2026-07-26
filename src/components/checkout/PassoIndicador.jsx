import { Check } from "lucide-react";

/** Trilha das 4 etapas. Etapa já concluída é clicável para voltar e corrigir. */
export default function PassoIndicador({ passos, atual, aoVoltarPara }) {
  return (
    <ol className="mb-8 flex items-center gap-1 sm:gap-2">
      {passos.map((passo, i) => {
        const concluido = i < atual;
        const ativo = i === atual;

        return (
          <li key={passo} className="flex flex-1 items-center gap-1 sm:gap-2">
            <button
              type="button"
              disabled={!concluido}
              onClick={() => concluido && aoVoltarPara(i)}
              className={`flex items-center gap-2 ${concluido ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-colors ${
                  concluido
                    ? "bg-zap text-white"
                    : ativo
                      ? "bg-amarelo text-black"
                      : "border border-borda-clara text-texto-tenue"
                }`}
              >
                {concluido ? <Check size={14} strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={`hidden text-[13px] font-bold sm:inline ${
                  ativo ? "text-amarelo" : concluido ? "text-neutral-300" : "text-texto-tenue"
                }`}
              >
                {passo}
              </span>
            </button>

            {i < passos.length - 1 && (
              <span
                className={`h-px flex-1 ${concluido ? "bg-zap" : "bg-borda-clara"}`}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
