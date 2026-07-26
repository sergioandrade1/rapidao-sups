import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import GridProdutos from "../components/produto/GridProdutos";
import FiltrosCatalogo from "../components/catalogo/FiltrosCatalogo";
import IconeCategoria from "../components/ui/IconeCategoria";
import { useAsync } from "../hooks/useAsync";
import { useTitulo } from "../hooks/useTitulo";
import { listarProdutos } from "../services/produtos";
import { acharCategoria } from "../data/categorias";
import { acharVitrine } from "../data/vitrines";
import { marcas as TODAS_MARCAS } from "../data/produtos";

const TETO_PRECO = 40000; // R$ 400 — acima do produto mais caro do catálogo

const ORDENS = [
  { valor: "relevancia", rotulo: "Relevância" },
  { valor: "menor-preco", rotulo: "Menor preço" },
  { valor: "maior-preco", rotulo: "Maior preço" },
  { valor: "nome", rotulo: "Nome (A-Z)" },
];

/**
 * Catálogo. Serve três rotas: /produtos, /c/:categoria e /busca.
 *
 * Todo o estado dos filtros vive na URL — o link é compartilhável e o botão
 * "voltar" do navegador desfaz um filtro em vez de sair da página.
 */
export default function Catalogo() {
  const { categoria: slugCategoria, vitrine: slugVitrine } = useParams();
  const [params, setParams] = useSearchParams();
  const [painelAberto, setPainelAberto] = useState(false);

  const categoria = slugCategoria ? acharCategoria(slugCategoria) : null;
  const vitrine = slugVitrine ? acharVitrine(slugVitrine) : null;
  const busca = params.get("q") ?? "";
  const marcasSelecionadas = params.getAll("marca");
  const precoMax = Number(params.get("max") ?? TETO_PRECO);
  const ordem = params.get("ordem") ?? "relevancia";

  const { dados, carregando, erro } = useAsync(
    () =>
      listarProdutos({
        categoria: slugCategoria,
        vitrine: slugVitrine,
        marcas: marcasSelecionadas,
        precoMax,
        busca,
        ordem,
      }),
    [slugCategoria, slugVitrine, marcasSelecionadas.join(","), precoMax, busca, ordem]
  );

  /** Atualiza um parâmetro preservando os demais. `valor` null remove. */
  function atualizar(chave, valor) {
    const proximos = new URLSearchParams(params);
    if (valor == null || valor === "") proximos.delete(chave);
    else proximos.set(chave, valor);
    setParams(proximos, { replace: true });
  }

  function alternarMarca(marca) {
    const proximos = new URLSearchParams(params);
    const atuais = proximos.getAll("marca");
    proximos.delete("marca");
    const novas = atuais.includes(marca)
      ? atuais.filter((m) => m !== marca)
      : [...atuais, marca];
    novas.forEach((m) => proximos.append("marca", m));
    setParams(proximos, { replace: true });
  }

  function limparFiltros() {
    const proximos = new URLSearchParams();
    if (busca) proximos.set("q", busca);
    setParams(proximos, { replace: true });
  }

  const temFiltro = marcasSelecionadas.length > 0 || precoMax < TETO_PRECO;

  const titulo = vitrine
    ? vitrine.titulo
    : categoria
      ? categoria.nome
      : busca
        ? `Resultados para "${busca}"`
        : "Todos os produtos";

  useTitulo(titulo);

  const propsFiltros = {
    marcas: TODAS_MARCAS,
    marcasSelecionadas,
    aoAlternarMarca: alternarMarca,
    precoMax,
    precoMaxLimite: TETO_PRECO,
    aoMudarPreco: (v) => atualizar("max", v === TETO_PRECO ? null : String(v)),
    aoLimpar: limparFiltros,
    temFiltro,
  };

  return (
    <div className="container-site py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="titulo-secao flex items-center gap-2">
            {vitrine ? (
              <vitrine.Icone size={24} className="shrink-0 text-amarelo" aria-hidden="true" />
            ) : (
              categoria && (
                <IconeCategoria slug={categoria.slug} size={24} className="shrink-0 text-amarelo" />
              )
            )}
            {titulo}
          </h1>
          {vitrine?.subtitulo && (
            <p className="mt-1 max-w-xl text-sm text-texto-suave">{vitrine.subtitulo}</p>
          )}
          {!carregando && (
            <p className="mt-1 text-sm text-texto-fraco">
              {dados?.length ?? 0} produto{dados?.length === 1 ? "" : "s"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Abre o painel de filtros como bottom-sheet no mobile */}
          <button
            type="button"
            onClick={() => setPainelAberto(true)}
            className="btn-secundario px-4 py-2.5 text-sm lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filtros{temFiltro ? ` (${marcasSelecionadas.length + (precoMax < TETO_PRECO ? 1 : 0)})` : ""}
          </button>

          <label className="sr-only" htmlFor="ordem">
            Ordenar por
          </label>
          <select
            id="ordem"
            value={ordem}
            onChange={(e) => atualizar("ordem", e.target.value === "relevancia" ? null : e.target.value)}
            className="rounded-lg border border-borda-clara bg-neutral-900 px-3 py-2.5 text-sm text-texto focus:border-amarelo focus:outline-none"
          >
            {ORDENS.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.rotulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar de filtros no desktop */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <FiltrosCatalogo {...propsFiltros} />
        </aside>

        <div className="min-w-0 flex-1">
          <GridProdutos produtos={dados} carregando={carregando} erro={erro} />
        </div>
      </div>

      {/* Bottom-sheet de filtros no mobile */}
      {painelAberto && (
        <div className="fixed inset-0 z-100 flex items-end bg-black/70 lg:hidden">
          <div className="max-h-[80vh] w-full overflow-y-auto rounded-t-2xl border-t border-borda bg-grafite p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black uppercase italic">Filtros</h2>
              <button type="button" onClick={() => setPainelAberto(false)} aria-label="Fechar filtros">
                <X size={22} />
              </button>
            </div>

            <FiltrosCatalogo {...propsFiltros} />

            <button
              type="button"
              onClick={() => setPainelAberto(false)}
              className="btn-primario mt-6 w-full"
            >
              Ver {dados?.length ?? 0} produtos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
