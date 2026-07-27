import { CIDADES_ATENDIDAS } from "./loja";
import { MINIMO_FRETE_GRATIS } from "./frete";

/**
 * Regras do pedido: máscaras, validação e cálculo do total.
 *
 * Os campos definidos aqui são exatamente os que a tabela `pedidos` vai
 * precisar guardar no Supabase — por isso esta tela vem antes do backend.
 */

/** Frete cobrado abaixo do mínimo. PROVISÓRIO — confirmar com a loja. */
export const FRETE_PADRAO_CENTAVOS = 999;

/** Acréscimo do cartão parcelado, repassado pela maquininha. */
export const ACRESCIMO_CARTAO_CENTAVOS = 1499;

export const FORMAS_PAGAMENTO = [
  {
    id: "pix",
    nome: "PIX",
    detalhe: "Sem acréscimo. O código chega pelo WhatsApp.",
    destaque: true,
  },
  {
    id: "dinheiro_debito",
    nome: "Dinheiro / Débito",
    detalhe: "Sem acréscimo. Maquininha na entrega.",
    permiteTroco: true,
  },
  {
    id: "credito_3x",
    nome: "Cartão até 3x",
    detalhe: "Acréscimo de R$ 14,99 cobrado pela maquininha.",
    acrescimo: ACRESCIMO_CARTAO_CENTAVOS,
  },
];

export function acharForma(id) {
  return FORMAS_PAGAMENTO.find((f) => f.id === id) ?? null;
}

/* ---------------------------------- máscaras --------------------------------- */

export function mascararTelefone(valor) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function mascararCep(valor) {
  const d = valor.replace(/\D/g, "").slice(0, 8);
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
}

/** "R$ 12,50" digitado -> 1250 centavos. */
export function paraCentavos(valor) {
  const d = String(valor).replace(/\D/g, "");
  return d ? Number(d) : 0;
}

/* --------------------------------- validação --------------------------------- */

const soDigitos = (v) => String(v ?? "").replace(/\D/g, "");

/**
 * Erros da etapa de identificação, por campo. Objeto vazio = etapa válida.
 * Só nome e WhatsApp: o pedido é fechado por conversa, e-mail não tem uso.
 */
export function validarIdentificacao({ nome, telefone }) {
  const erros = {};

  if (!nome?.trim()) erros.nome = "Informe seu nome";
  else if (nome.trim().split(/\s+/).length < 2) erros.nome = "Informe nome e sobrenome";

  const tel = soDigitos(telefone);
  if (!tel) erros.telefone = "Informe seu WhatsApp";
  else if (tel.length < 10) erros.telefone = "Telefone incompleto";
  else if (tel.length === 11 && tel[2] !== "9") erros.telefone = "Celular deve começar com 9";

  return erros;
}

/** Erros da etapa de entrega. */
export function validarEntrega({ cep, rua, numero, bairro, cidade }) {
  const erros = {};

  const c = soDigitos(cep);
  if (!c) erros.cep = "Informe o CEP";
  else if (c.length !== 8) erros.cep = "CEP deve ter 8 dígitos";

  if (!rua?.trim()) erros.rua = "Informe a rua";
  if (!numero?.trim()) erros.numero = "Informe o número";
  if (!bairro?.trim()) erros.bairro = "Informe o bairro";

  if (!cidade) erros.cidade = "Escolha a cidade";
  else if (!CIDADES_ATENDIDAS.includes(cidade)) erros.cidade = "Ainda não entregamos nessa cidade";

  return erros;
}

/** Erros da etapa de pagamento. */
export function validarPagamento({ forma, precisaTroco, trocoPara }, totalCentavos) {
  const erros = {};

  const escolhida = acharForma(forma);
  if (!escolhida) erros.forma = "Escolha a forma de pagamento";

  if (escolhida?.permiteTroco && precisaTroco) {
    const troco = paraCentavos(trocoPara);
    if (!troco) erros.trocoPara = "Informe o valor";
    else if (troco < totalCentavos) erros.trocoPara = "Valor menor que o total do pedido";
  }

  return erros;
}

/* ---------------------------------- totais ---------------------------------- */

/** O acréscimo depende da forma escolhida, então ela entra no cálculo. */
export function calcularTotais(subtotalCentavos, formaId) {
  const freteGratis = subtotalCentavos >= MINIMO_FRETE_GRATIS;
  const frete = freteGratis ? 0 : FRETE_PADRAO_CENTAVOS;
  const acrescimo = acharForma(formaId)?.acrescimo ?? 0;

  return {
    subtotal: subtotalCentavos,
    frete,
    freteGratis,
    acrescimo,
    total: subtotalCentavos + frete + acrescimo,
  };
}
