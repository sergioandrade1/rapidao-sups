import { Zap } from "lucide-react";
import { useJanelaEntrega } from "../../hooks/useJanelaEntrega";

const TAMANHO = 280;
const ESPESSURA = 14;
const RAIO = (TAMANHO - ESPESSURA) / 2;
const PERIMETRO = 2 * Math.PI * RAIO;

/** Cor do anel por estado. Na última hora vira vermelho — é o momento decisivo. */
function corDoAnel(janela) {
  if (janela.estado === "domingo" || janela.estado === "encerrado") return "#666666";
  if (janela.estado === "aberto" && janela.restanteMin <= 60) return "#FF3B3B";
  return "#FFC800";
}

/**
 * Selo do hero: anel que se fecha conforme o dia avança rumo ao horário de
 * corte. Às 9h está vazio; às 18h, cheio. No centro, quanto tempo ainda resta
 * para o pedido sair no mesmo dia.
 */
export default function SeloEntrega() {
  const janela = useJanelaEntrega();
  const cor = corDoAnel(janela);
  const urgente = janela.estado === "aberto" && janela.restanteMin <= 60;
  const ativo = janela.estado === "aberto";

  return (
    <div
      className="relative"
      style={{ width: TAMANHO, height: TAMANHO }}
      role="timer"
      aria-live="off"
      aria-label={
        ativo
          ? `Faltam ${janela.titulo} para pedir e receber hoje`
          : `${janela.titulo}. ${janela.legenda}`
      }
    >
      <svg
        width={TAMANHO}
        height={TAMANHO}
        viewBox={`0 0 ${TAMANHO} ${TAMANHO}`}
        aria-hidden="true"
        className="-rotate-90"
      >
        {/* Trilho */}
        <circle
          cx={TAMANHO / 2}
          cy={TAMANHO / 2}
          r={RAIO}
          fill="none"
          stroke="#242424"
          strokeWidth={ESPESSURA}
        />
        {/* Progresso do dia */}
        <circle
          cx={TAMANHO / 2}
          cy={TAMANHO / 2}
          r={RAIO}
          fill="none"
          stroke={cor}
          strokeWidth={ESPESSURA}
          strokeLinecap="round"
          strokeDasharray={PERIMETRO}
          strokeDashoffset={PERIMETRO * (1 - janela.progresso)}
          style={{
            transition: "stroke-dashoffset 700ms ease, stroke 400ms ease",
            filter: `drop-shadow(0 0 12px ${cor}66)`,
          }}
        />
      </svg>

      {/* Miolo */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
        <Zap
          size={44}
          className={urgente ? "fill-alerta text-alerta" : "fill-amarelo text-amarelo"}
        />

        <span
          className="text-4xl font-black italic leading-none"
          style={{ color: ativo ? "#fff" : cor }}
        >
          {janela.titulo}
        </span>

        <span
          className="max-w-40 text-[12px] font-extrabold uppercase tracking-widest"
          style={{ color: cor }}
        >
          {janela.legenda}
        </span>

        {ativo && (
          <span className="mt-1 text-[11px] font-semibold text-texto-fraco">
            corte às {janela.corte}
          </span>
        )}
      </div>
    </div>
  );
}
