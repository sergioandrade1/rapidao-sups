import { useJanelaEntrega } from "../../hooks/useJanelaEntrega";

const TAMANHO = 60;
const ESPESSURA = 5;
const RAIO = (TAMANHO - ESPESSURA) / 2;
const PERIMETRO = 2 * Math.PI * RAIO;

/**
 * Versão do contador para o celular.
 *
 * O selo grande do hero ocupa a tela inteira no mobile e empurrava o botão de
 * comprar para fora. Aqui o mesmo anel vira uma faixa horizontal fina, que
 * cabe acima do título sem disputar espaço com a chamada.
 */
export default function SeloEntregaCompacto() {
  const janela = useJanelaEntrega();

  const ativo = janela.estado === "aberto";
  const urgente = ativo && janela.restanteMin <= 60;
  const cor = urgente ? "#FF3B3B" : ativo ? "#FFC800" : "#666666";

  return (
    <div
      role="timer"
      aria-label={ativo ? `Faltam ${janela.titulo} para receber hoje` : janela.legenda}
      className="mb-5 flex items-center gap-3 rounded-xl border p-2.5 sm:hidden"
      style={{ borderColor: `${cor}55`, background: `${cor}0d` }}
    >
      <div className="relative shrink-0" style={{ width: TAMANHO, height: TAMANHO }}>
        <svg width={TAMANHO} height={TAMANHO} className="-rotate-90" aria-hidden="true">
          <circle
            cx={TAMANHO / 2}
            cy={TAMANHO / 2}
            r={RAIO}
            fill="none"
            stroke="#242424"
            strokeWidth={ESPESSURA}
          />
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
            style={{ transition: "stroke-dashoffset 700ms ease, stroke 400ms ease" }}
          />
        </svg>

        {ativo && (
          <span
            className="absolute inset-0 flex items-center justify-center text-[11px] font-black leading-none"
            style={{ color: cor }}
          >
            {janela.restanteMin >= 60 ? `${Math.floor(janela.restanteMin / 60)}h` : `${janela.restanteMin}m`}
          </span>
        )}
      </div>

      <div className="min-w-0">
        {ativo ? (
          <>
            <p className="text-sm font-extrabold leading-tight">
              Faltam <span style={{ color: cor }}>{janela.titulo}</span>
            </p>
            <p className="text-xs text-texto-fraco">
              para pedir e receber hoje · corte às {janela.corte}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-extrabold leading-tight" style={{ color: cor }}>
              {janela.titulo}
            </p>
            <p className="text-xs text-texto-fraco">{janela.legenda}</p>
          </>
        )}
      </div>
    </div>
  );
}
