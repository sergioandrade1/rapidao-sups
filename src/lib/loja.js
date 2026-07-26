/**
 * Dados institucionais da loja.
 *
 * Fonte: rapidaosuplementos.vendizap.com (loja atual). Centralizados aqui para
 * que mudar horário de corte ou incluir uma cidade seja uma edição só.
 */

export const LOJA = {
  nome: "Rapidão Suplementos",
  responsavel: "Fernando Henrique",
  cidade: "Recife - PE",
  whatsapp: "5581984372495",
  whatsappExibicao: "(81) 98437-2495",
  linktree: "https://linktr.ee/Rapidaosuplementos",
};

/** Horário de corte para entrega no mesmo dia. */
export const CORTE_MESMO_DIA = "18:00";

/** Chamadas da loja atual, reaproveitadas na identidade do site novo. */
export const CHAMADAS = {
  entrega: "Faça seu pedido até as 18:00 e receba no mesmo dia",
  ritmo: "Rápido, prático e seguro",
};

/** Área de atuação — cidades atendidas pelo delivery. */
export const CIDADES_ATENDIDAS = [
  "Recife",
  "Olinda",
  "Paulista",
  "Jaboatão",
  "Abreu e Lima",
  "Camaragibe",
  "São Lourenço da Mata",
];

export const HORARIOS = [
  "Seg a Sex: 9h às 18h",
  "Sábado: 9h às 15h",
  "Pedidos até 18:00 chegam no mesmo dia",
];
