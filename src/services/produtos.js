/**
 * Fronteira de dados de produtos.
 *
 * Nenhuma página importa `data/` diretamente — tudo passa por aqui. Quando há
 * Supabase configurado, as funções consultam o banco; sem credenciais, caem no
 * catálogo local. O formato devolvido é idêntico nos dois casos, então as telas
 * não sabem (nem precisam saber) de onde veio o dado.
 */
import { supabase, temSupabase } from "../lib/supabase";
import * as local from "./produtosLocal";
import { acharVitrine } from "../data/vitrines";

/** Colunas + relações. O mesmo shape que a UI já consumia do mock. */
const SELECT = `
  id, slug, nome, marca, categoria_slug, preco_centavos, preco_de_centavos,
  tag, nota, avaliacoes, estoque, destaque, mais_vendido,
  produto_imagens ( url, ordem ),
  produto_variantes ( id, rotulo, preco_centavos, estoque )
`;

/** Linha do banco -> objeto que as telas esperam. */
function paraProduto(linha) {
  if (!linha) return null;

  const imagens = (linha.produto_imagens ?? [])
    .slice()
    .sort((a, b) => a.ordem - b.ordem)
    .map((i) => i.url);

  return {
    id: linha.id,
    slug: linha.slug,
    nome: linha.nome,
    marca: linha.marca,
    categoria: linha.categoria_slug,
    preco_centavos: linha.preco_centavos,
    preco_de_centavos: linha.preco_de_centavos,
    tag: linha.tag,
    nota: linha.nota,
    avaliacoes: linha.avaliacoes,
    estoque: linha.estoque,
    destaque: linha.destaque,
    mais_vendido: linha.mais_vendido,
    imagens,
    variantes: (linha.produto_variantes ?? []).map((v) => ({
      id: v.id,
      rotulo: v.rotulo,
      preco_centavos: v.preco_centavos,
      estoque: v.estoque,
    })),
  };
}

/** Erro do Supabase vira exceção, para o useAsync mostrar o estado de erro. */
function conferir({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

export async function listarProdutos(filtros = {}) {
  if (!temSupabase) return local.listarProdutos(filtros);

  const { categoria, vitrine, marcas: marcasSel, precoMin, precoMax, busca, ordem } = filtros;

  let q = supabase.from("produtos").select(SELECT).eq("ativo", true);

  if (categoria) q = q.eq("categoria_slug", categoria);
  if (marcasSel?.length) q = q.in("marca", marcasSel);
  if (precoMin != null) q = q.gte("preco_centavos", precoMin);
  if (precoMax != null) q = q.lte("preco_centavos", precoMax);

  if (busca?.trim()) {
    const termo = busca.trim();
    q = q.or(`nome.ilike.%${termo}%,marca.ilike.%${termo}%`);
  }

  const v = vitrine ? acharVitrine(vitrine) : null;
  if (vitrine && !v) return [];
  if (v?.aplicar) q = v.aplicar(q);

  switch (ordem) {
    case "menor-preco":
      q = q.order("preco_centavos", { ascending: true });
      break;
    case "maior-preco":
      q = q.order("preco_centavos", { ascending: false });
      break;
    case "nome":
      q = q.order("nome", { ascending: true });
      break;
    default:
      q = q.order("id", { ascending: true });
  }

  if (v?.limite) q = q.limit(v.limite);

  let lista = conferir(await q).map(paraProduto);

  // Ordenação por desconto não existe como coluna: é calculada.
  if (v?.ordenar) lista.sort(v.ordenar);

  return lista;
}

export async function obterProduto(slug) {
  if (!temSupabase) return local.obterProduto(slug);

  const { data, error } = await supabase
    .from("produtos")
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return paraProduto(data);
}

export async function listarRelacionados(produto, limite = 4) {
  if (!temSupabase) return local.listarRelacionados(produto, limite);

  const data = conferir(
    await supabase
      .from("produtos")
      .select(SELECT)
      .eq("ativo", true)
      .eq("categoria_slug", produto.categoria)
      .neq("id", produto.id)
      .limit(limite)
  );

  return data.map(paraProduto);
}

export async function listarDestaques(limite = 10) {
  if (!temSupabase) return local.listarDestaques(limite);

  const data = conferir(
    await supabase
      .from("produtos")
      .select(SELECT)
      .eq("ativo", true)
      .eq("destaque", true)
      .order("id")
      .limit(limite)
  );

  return data.map(paraProduto);
}

export async function listarMaisVendidos(limite = 8) {
  if (!temSupabase) return local.listarMaisVendidos(limite);

  const data = conferir(
    await supabase
      .from("produtos")
      .select(SELECT)
      .eq("ativo", true)
      .eq("mais_vendido", true)
      .order("id")
      .limit(limite)
  );

  return data.map(paraProduto);
}

export async function listarPromocoes(limite = 8) {
  if (!temSupabase) return local.listarPromocoes(limite);

  const data = conferir(
    await supabase
      .from("produtos")
      .select(SELECT)
      .eq("ativo", true)
      .not("preco_de_centavos", "is", null)
      .limit(200)
  );

  return data
    .map(paraProduto)
    .sort(
      (a, b) =>
        (b.preco_de_centavos - b.preco_centavos) / b.preco_de_centavos -
        (a.preco_de_centavos - a.preco_centavos) / a.preco_de_centavos
    )
    .slice(0, limite);
}

export async function listarCategorias() {
  if (!temSupabase) return local.listarCategorias();

  const data = conferir(await supabase.from("categorias").select("*").order("ordem"));
  return data;
}

export async function listarMarcas() {
  if (!temSupabase) return local.listarMarcas();

  const data = conferir(await supabase.from("produtos").select("marca").eq("ativo", true));
  return [...new Set(data.map((r) => r.marca))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function obterFaixaPreco() {
  if (!temSupabase) return local.obterFaixaPreco();

  const data = conferir(
    await supabase.from("produtos").select("preco_centavos").eq("ativo", true)
  );
  const valores = data.map((r) => r.preco_centavos);
  return { min: Math.min(...valores), max: Math.max(...valores) };
}
