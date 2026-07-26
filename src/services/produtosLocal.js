/**
 * Catálogo local — usado quando não há Supabase configurado.
 *
 * Serve para rodar o projeto sem credenciais (um `git clone` funciona de
 * primeira) e como rede de segurança em desenvolvimento. Em produção quem
 * responde é o Supabase; ver `services/produtos.js`.
 */
import { produtos, marcas } from "../data/produtos";
import { categorias } from "../data/categorias";
import { acharVitrine } from "../data/vitrines";

const ATRASO_MS = 150;

function responder(valor) {
  return new Promise((resolve) => setTimeout(() => resolve(valor), ATRASO_MS));
}

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export async function listarProdutos(filtros = {}) {
  const { categoria, vitrine, marcas: marcasSel, precoMin, precoMax, busca, ordem } = filtros;

  let lista = [...produtos];

  if (categoria) lista = lista.filter((p) => p.categoria === categoria);
  if (marcasSel?.length) lista = lista.filter((p) => marcasSel.includes(p.marca));
  if (precoMin != null) lista = lista.filter((p) => p.preco_centavos >= precoMin);
  if (precoMax != null) lista = lista.filter((p) => p.preco_centavos <= precoMax);

  if (busca?.trim()) {
    const termo = normalizar(busca.trim());
    lista = lista.filter(
      (p) => normalizar(p.nome).includes(termo) || normalizar(p.marca).includes(termo)
    );
  }

  if (vitrine) {
    const v = acharVitrine(vitrine);
    if (!v) return responder([]);
    lista = lista.filter(v.filtro);
    if (v.ordenar) lista.sort(v.ordenar);
    if (v.limite) lista = lista.slice(0, v.limite);
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
      break;
  }

  return responder(lista);
}

export async function obterProduto(slug) {
  return responder(produtos.find((p) => p.slug === slug) ?? null);
}

export async function listarRelacionados(produto, limite = 4) {
  return responder(
    produtos.filter((p) => p.categoria === produto.categoria && p.id !== produto.id).slice(0, limite)
  );
}

export async function listarDestaques(limite = 10) {
  return responder(produtos.filter((p) => p.destaque).slice(0, limite));
}

export async function listarMaisVendidos(limite = 8) {
  return responder(produtos.filter((p) => p.mais_vendido).slice(0, limite));
}

export async function listarPromocoes(limite = 8) {
  return responder(
    produtos
      .filter((p) => p.preco_de_centavos && p.preco_de_centavos > p.preco_centavos)
      .sort(
        (a, b) =>
          (b.preco_de_centavos - b.preco_centavos) / b.preco_de_centavos -
          (a.preco_de_centavos - a.preco_centavos) / a.preco_de_centavos
      )
      .slice(0, limite)
  );
}

export async function listarCategorias() {
  return responder(categorias);
}

export async function listarMarcas() {
  return responder(marcas);
}

export async function obterFaixaPreco() {
  const valores = produtos.map((p) => p.preco_centavos);
  return responder({ min: Math.min(...valores), max: Math.max(...valores) });
}
