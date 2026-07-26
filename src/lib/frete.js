/** Regras comerciais de frete. Centralizadas para reuso em carrinho e checkout. */

/** Frete grátis a partir de R$ 89,99 (regra da loja atual). */
export const MINIMO_FRETE_GRATIS = 8999;

/** Quanto falta (em centavos) para o frete grátis. 0 quando já atingiu. */
export function faltaParaFreteGratis(subtotalCentavos) {
  return Math.max(0, MINIMO_FRETE_GRATIS - subtotalCentavos);
}

/** Progresso 0–1 rumo ao frete grátis, para a barra do carrinho. */
export function progressoFreteGratis(subtotalCentavos) {
  return Math.min(1, subtotalCentavos / MINIMO_FRETE_GRATIS);
}
