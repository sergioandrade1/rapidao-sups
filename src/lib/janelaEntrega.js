/**
 * Janela de entrega no mesmo dia.
 *
 * O anel do selo do hero se fecha conforme o dia avança rumo ao horário de
 * corte: às 9h está vazio, às 18h está cheio. Domingo não há entrega.
 *
 * O cálculo usa sempre o fuso de Recife, não o do aparelho do visitante —
 * senão alguém acessando de outro fuso veria um prazo que não é o da loja.
 */

const FUSO = "America/Recife";

/** Minutos desde a meia-noite em que a loja começa a operar. */
const ABERTURA = 9 * 60;

/**
 * Horário de corte por dia da semana (0 = domingo).
 * Sábado fecha às 15h, então o corte não pode ser 18h como nos dias úteis.
 * `null` = não há entrega no dia.
 */
const CORTE_POR_DIA = {
  0: null, // domingo
  1: 18 * 60,
  2: 18 * 60,
  3: 18 * 60,
  4: 18 * 60,
  5: 18 * 60,
  6: 15 * 60, // sábado
};

const DIAS_EN = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const formatador = new Intl.DateTimeFormat("en-US", {
  timeZone: FUSO,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Hora da loja: { dia: 0-6, minutos: minutos desde a meia-noite }. */
export function horaDaLoja(agora = new Date()) {
  const partes = formatador.formatToParts(agora);
  const pegar = (tipo) => partes.find((p) => p.type === tipo)?.value;

  return {
    dia: DIAS_EN[pegar("weekday")] ?? 0,
    minutos: Number(pegar("hour")) * 60 + Number(pegar("minute")),
  };
}

/** "2h 47min" / "43min" — texto curto para o contador. */
export function formatarRestante(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

/** Formata minutos-desde-a-meia-noite como "18:00". */
function comoHora(minutos) {
  return `${String(Math.floor(minutos / 60)).padStart(2, "0")}:${String(minutos % 60).padStart(2, "0")}`;
}

/**
 * Estado da janela de entrega.
 *
 * @returns {{
 *   estado: 'aberto'|'antes'|'encerrado'|'domingo',
 *   progresso: number,   // 0 a 1 — quanto do dia de vendas já passou
 *   corte: string|null,  // "18:00"
 *   restanteMin: number|null,
 *   titulo: string,      // texto grande no centro do selo
 *   legenda: string,     // linha de baixo
 * }}
 */
export function janelaEntrega(agora = new Date()) {
  const { dia, minutos } = horaDaLoja(agora);
  const corte = CORTE_POR_DIA[dia];

  if (corte === null) {
    return {
      estado: "domingo",
      progresso: 0,
      corte: null,
      restanteMin: null,
      titulo: "SEG A SÁB",
      legenda: "Domingo não entregamos",
    };
  }

  const rotuloCorte = comoHora(corte);

  // Antes de abrir: o anel ainda não começou a fechar.
  if (minutos < ABERTURA) {
    return {
      estado: "antes",
      progresso: 0,
      corte: rotuloCorte,
      restanteMin: null,
      titulo: rotuloCorte,
      legenda: "Abrimos às 9h",
    };
  }

  // Passou do corte: entrega vai para o próximo dia útil.
  if (minutos >= corte) {
    return {
      estado: "encerrado",
      progresso: 1,
      corte: rotuloCorte,
      restanteMin: 0,
      titulo: rotuloCorte,
      legenda: dia === 6 ? "Volta segunda" : "Peça agora, sai amanhã",
    };
  }

  const restanteMin = corte - minutos;

  return {
    estado: "aberto",
    progresso: (minutos - ABERTURA) / (corte - ABERTURA),
    corte: rotuloCorte,
    restanteMin,
    titulo: formatarRestante(restanteMin),
    legenda: "para receber hoje",
  };
}
