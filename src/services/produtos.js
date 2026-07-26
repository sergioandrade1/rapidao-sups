/**
 * Fronteira de dados de produtos.
 *
 * Nenhuma página importa `data/` diretamente — tudo passa por aqui. Hoje as
 * funções resolvem em cima do mock, mas já são assíncronas, então a UI já lida
 * com loading e erro de verdade. Quando o Supabase entrar, só o corpo destas
 * funções muda; nenhuma tela é tocada.
 */
import { produtos, marcas } from "../data/produtos";
import { categorias } from "../data/categorias";
import { acharVitrine } from "../data/vitrines";

/** Latência simulada, para que os estados de loading sejam exercitados. */
const ATRASO_MS = 250;

function responder(valor) {
  return new Promise((resolve) => setTimeout(() => resolve(valor), ATRASO_MS));
}

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/**
 * Lista produtos com filtros opcionais.
 * @param {object} filtros
 * @param {string} [filtros.categoria] slug da categoria
 * @param {string[]} [filtros.marcas] marcas selecionadas
 * @param {number} [filtros.precoMin] centavos
 * @param {number} [filtros.precoMax] centavos
 * @param {string} [filtros.busca] termo livre
 * @param {'relevancia'|'menor-preco'|'maior-preco'|'nome'} [filtros.ordem]
 */
export async function listarProdutos(filtros = {}) {
  const { categoria, vitrine, marcas: marcasSel, precoMin, precoMax, busca, ordem } = filtros;

  let lista = [...produtos];

  if (categoria) lista = lista.filter((p) => p.categoria === categoria);

  // Vitrine aplica sua própria regra de curadoria antes dos filtros do usuário.
  if (vitrine) {
    const v = acharVitrine(vitrine);
    if (!v) return responder([]);
    lista = lista.filter(v.filtro);
    if (v.ordenar) lista.sort(v.ordenar);
    if (v.limite) lista = lista.slice(0, v.limite);
  }

  if (marcasSel?.length) lista = lista.filter((p) => marcasSel.includes(p.marca));

  if (precoMin != null) lista = lista.filter((p) => p.preco_centavos >= precoMin);
  if (precoMax != null) lista = lista.filter((p) => p.preco_centavos <= precoMax);

  if (busca?.trim()) {
    const termo = normalizar(busca.trim());
    lista = lista.filter(
      (p) => normalizar(p.nome).includes(termo) || normalizar(p.marca).includes(termo)
    );
  }

  switch (ordem) {
    case "menor-preco":
      lista.sort((a, b) => a.preco_centavos - b.preco_centavos);
      break;
    case "maior-preco":
      lista.sort((a, b) => b.preco_centavos - a.preco_centavos);
      break;
    case "nome":
      lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
      break;
    default:
      break; // relevância = ordem natural do catálogo
  }

  return responder(lista);
}

/** Produto único por slug. Devolve null quando não existe (a página faz o 404). */
export async function obterProduto(slug) {
  return responder(produtos.find((p) => p.slug === slug) ?? null);
}

/** Produtos da mesma categoria, excluindo o atual. */
export async function listarRelacionados(produto, limite = 4) {
  const lista = produtos
    .filter((p) => p.categoria === produto.categoria && p.id !== produto.id)
    .slice(0, limite);
  return responder(lista);
}

/** Produtos em destaque — a vitrine de topo da home (combos). */
export async function listarDestaques(limite = 10) {
  return responder(produtos.filter((p) => p.destaque).slice(0, limite));
}

/** Mais vendidos — itens de giro rápido. */
export async function listarMaisVendidos(limite = 8) {
  return responder(produtos.filter((p) => p.mais_vendido).slice(0, limite));
}

/** Promoções: só produtos com preço riscado, do maior desconto para o menor. */
export async function listarPromocoes(limite = 8) {
  const lista = produtos
    .filter((p) => p.preco_de_centavos && p.preco_de_centavos > p.preco_centavos)
    .sort((a, b) => {
      const descA = (a.preco_de_centavos - a.preco_centavos) / a.preco_de_centavos;
      const descB = (b.preco_de_centavos - b.preco_centavos) / b.preco_de_centavos;
      return descB - descA;
    })
    .slice(0, limite);
  return responder(lista);
}

export async function listarCategorias() {
  return responder(categorias);
}

export async function listarMarcas() {
  return responder(marcas);
}

/** Faixa de preço do catálogo inteiro — define os limites do slider do filtro. */
export async function obterFaixaPreco() {
  const valores = produtos.map((p) => p.preco_centavos);
  return responder({ min: Math.min(...valores), max: Math.max(...valores) });
}
