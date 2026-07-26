import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Minus, Plus, ShieldCheck, Truck, Zap } from "lucide-react";
import Badge from "../components/produto/Badge";
import Estrelas from "../components/produto/Estrelas";
import GridProdutos from "../components/produto/GridProdutos";
import ImagemProduto from "../components/produto/ImagemProduto";
import NaoEncontrada from "./NaoEncontrada";
import { Skeleton } from "../components/ui/Skeleton";
import { useAsync } from "../hooks/useAsync";
import { useTitulo } from "../hooks/useTitulo";
import { obterProduto, listarRelacionados } from "../services/produtos";
import { acharCategoria } from "../data/categorias";
import { brl, percentualDesconto } from "../lib/formato";
import { CORTE_MESMO_DIA } from "../lib/loja";
import { useCarrinho } from "../context/CarrinhoContext";

/**
 * Página de produto.
 * Esqueleto completo (galeria, variantes, quantidade, relacionados). A tabela
 * nutricional é estática por ora — vira coluna `nutricional` no Supabase.
 */
export default function Produto() {
  const { slug } = useParams();
  const { adicionar } = useCarrinho();
  const [varianteId, setVarianteId] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  const { dados: produto, carregando } = useAsync(() => obterProduto(slug), [slug]);
  useTitulo(produto?.nome);
  const relacionados = useAsync(
    () => (produto ? listarRelacionados(produto) : Promise.resolve([])),
    [produto?.id]
  );

  if (carregando) {
    return (
      <div className="container-site grid gap-8 py-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!produto) return <NaoEncontrada />;

  // Sem escolha do cliente, abre no primeiro sabor COM estoque. Cair no
  // primeiro da lista fazia a página anunciar "Indisponível" mesmo havendo
  // outros sabores à venda.
  const variante =
    produto.variantes.find((v) => v.id === varianteId) ??
    produto.variantes.find((v) => v.estoque > 0) ??
    produto.variantes[0] ??
    null;
  const desconto = percentualDesconto(produto.preco_de_centavos, produto.preco_centavos);
  const estoque = variante ? variante.estoque : produto.estoque;
  const indisponivel = estoque === 0;

  return (
    <div className="container-site py-8">
      <nav className="mb-5 text-xs text-texto-fraco">
        <Link to="/" className="hover:text-amarelo">
          Início
        </Link>{" "}
        /{" "}
        <Link to={`/c/${produto.categoria}`} className="hover:text-amarelo">
          {acharCategoria(produto.categoria)?.nome ?? produto.categoria}
        </Link>{" "}
        / <span className="text-texto-suave">{produto.nome}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Galeria — placeholder até chegarem as fotos reais */}
        <div>
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-borda bg-white p-6">
            {produto.tag && (
              <div className="absolute left-4 top-4">
                <Badge variante={produto.tag === "FRETE GRÁTIS" ? "verde" : "amarelo"}>
                  {produto.tag}
                </Badge>
              </div>
            )}
            {desconto > 0 && (
              <div className="absolute right-4 top-4">
                <Badge variante="alerta">-{desconto}%</Badge>
              </div>
            )}
            <ImagemProduto produto={produto} tamanhoPlaceholder={120} className="size-full" />
          </div>

          {/* Miniaturas: só fazem sentido quando houver mais de uma foto cadastrada */}
          {produto.imagens.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {produto.imagens.map((src) => (
                <div
                  key={src}
                  className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-borda bg-white p-2"
                >
                  <img src={src} alt="" loading="lazy" className="size-full object-contain" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compra */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-texto-fraco">
            {produto.marca}
          </span>
          <h1 className="mt-1 text-2xl font-black leading-tight sm:text-3xl">{produto.nome}</h1>
          <Estrelas nota={produto.nota} avaliacoes={produto.avaliacoes} />

          <div className="mt-5">
            {produto.preco_de_centavos && (
              <span className="text-sm text-texto-tenue line-through">
                {brl(produto.preco_de_centavos)}
              </span>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-amarelo">{brl(produto.preco_centavos)}</span>
              <span className="text-sm font-extrabold text-zap">no PIX</span>
            </div>
            <p className="mt-1 text-sm text-texto-fraco">ou em até 3x sem juros no cartão</p>
          </div>

          {produto.variantes.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 text-[13px] font-extrabold uppercase tracking-widest text-amarelo">
                Sabor
              </h2>
              <div className="flex flex-wrap gap-2">
                {produto.variantes.map((v) => {
                  const ativa = v.id === (variante?.id ?? null);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={v.estoque === 0}
                      onClick={() => setVarianteId(v.id)}
                      className={[
                        "rounded-lg border px-4 py-2 text-sm font-semibold transition-colors",
                        v.estoque === 0
                          ? "cursor-not-allowed border-borda text-texto-tenue line-through"
                          : ativa
                            ? "border-amarelo bg-amarelo/10 text-amarelo"
                            : "border-borda-clara text-neutral-200 hover:border-amarelo",
                      ].join(" ")}
                    >
                      {v.rotulo}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-borda-clara">
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                aria-label="Diminuir quantidade"
                className="px-3 py-2.5 text-texto hover:text-amarelo"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-sm font-bold">{quantidade}</span>
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.min(estoque, q + 1))}
                aria-label="Aumentar quantidade"
                className="px-3 py-2.5 text-texto hover:text-amarelo"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              disabled={indisponivel}
              onClick={() => adicionar(produto, variante, quantidade)}
              className="btn-primario flex-1 py-3.5 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
            >
              {indisponivel ? "Indisponível" : "Adicionar ao carrinho"}
            </button>
          </div>

          {!indisponivel && estoque <= 5 && (
            <p className="mt-2 text-sm font-bold text-alerta">
              Restam apenas {estoque} unidades!
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-borda bg-grafite-card p-4">
            <div className="flex items-center gap-3 text-sm">
              <Truck size={18} className="shrink-0 text-amarelo" />
              <span>
                Pedido até as <strong>{CORTE_MESMO_DIA}</strong> chega{" "}
                <strong className="text-amarelo">hoje</strong> em Recife e região.
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <ShieldCheck size={18} className="shrink-0 text-amarelo" />
              <span>Produto 100% original, direto da distribuidora.</span>
            </div>
          </div>

          {/* Tabela nutricional — dados estáticos, vira campo no Supabase */}
          <div className="mt-6">
            <h2 className="titulo-secao mb-3 text-lg">Tabela nutricional</h2>
            <div className="overflow-x-auto rounded-xl border border-borda">
              <table className="w-full text-sm">
                <caption className="sr-only">Informação nutricional por porção</caption>
                <thead className="bg-preto-fundo text-left text-xs uppercase tracking-wide text-texto-fraco">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-bold">
                      Por porção (30g)
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-bold">
                      Quantidade
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-bold">
                      %VD
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Valor energético", "120 kcal", "6%"],
                    ["Proteínas", "24 g", "48%"],
                    ["Carboidratos", "3 g", "1%"],
                    ["Gorduras totais", "1,5 g", "3%"],
                    ["Sódio", "60 mg", "3%"],
                  ].map(([nutriente, qtd, vd]) => (
                    <tr key={nutriente} className="border-t border-borda-sutil">
                      <th scope="row" className="px-4 py-2.5 text-left font-normal text-neutral-200">
                        {nutriente}
                      </th>
                      <td className="px-4 py-2.5 text-neutral-200">{qtd}</td>
                      <td className="px-4 py-2.5 text-texto-fraco">{vd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-texto-tenue">
              Valores ilustrativos. A tabela real de cada produto entra junto com o cadastro.
            </p>
          </div>
        </div>
      </div>

      {relacionados.dados?.length > 0 && (
        <section className="mt-14">
          <h2 className="titulo-secao mb-5">
            Quem viu, levou <span className="text-amarelo">→</span>
          </h2>
          <GridProdutos produtos={relacionados.dados} carregando={relacionados.carregando} />
        </section>
      )}
    </div>
  );
}
