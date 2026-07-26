/**
 * Formatação de valores.
 *
 * Todo preço no projeto é armazenado em CENTAVOS (inteiro). Float em dinheiro
 * acumula erro de arredondamento no somatório do carrinho e do checkout.
 * A conversão para reais acontece só na hora de exibir.
 */

const formatadorBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** 10999 -> "R$ 109,99" */
export function brl(centavos) {
  return formatadorBRL.format(centavos / 100);
}

/** Percentual de desconto entre dois preços em centavos. */
export function percentualDesconto(de, por) {
  if (!de || por >= de) return 0;
  return Math.round(((de - por) / de) * 100);
}
