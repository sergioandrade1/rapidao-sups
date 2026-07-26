import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { MINIMO_FRETE_GRATIS, faltaParaFreteGratis, progressoFreteGratis } from "../lib/frete";

const CHAVE_STORAGE = "rapidao:carrinho:v1";

const CarrinhoContext = createContext(null);

/** Identidade de uma linha do carrinho: produto + variante escolhida. */
function chaveItem(produtoId, varianteId) {
  return `${produtoId}:${varianteId ?? "unica"}`;
}

function reducer(itens, acao) {
  switch (acao.tipo) {
    case "adicionar": {
      const { produto, variante, quantidade = 1 } = acao;
      const chave = chaveItem(produto.id, variante?.id);
      const existente = itens.find((i) => i.chave === chave);

      if (existente) {
        return itens.map((i) =>
          i.chave === chave ? { ...i, quantidade: i.quantidade + quantidade } : i
        );
      }

      return [
        ...itens,
        {
          chave,
          produtoId: produto.id,
          slug: produto.slug,
          nome: produto.nome,
          marca: produto.marca,
          imagem: produto.imagens?.[0] ?? null,
          preco_centavos: produto.preco_centavos,
          variante: variante ? { id: variante.id, rotulo: variante.rotulo } : null,
          quantidade,
        },
      ];
    }

    case "definirQuantidade": {
      if (acao.quantidade < 1) return itens.filter((i) => i.chave !== acao.chave);
      return itens.map((i) =>
        i.chave === acao.chave ? { ...i, quantidade: acao.quantidade } : i
      );
    }

    case "remover":
      return itens.filter((i) => i.chave !== acao.chave);

    case "limpar":
      return [];

    default:
      return itens;
  }
}

/** Lê o carrinho salvo. Storage corrompido ou indisponível não pode quebrar o site. */
function estadoInicial() {
  try {
    const bruto = localStorage.getItem(CHAVE_STORAGE);
    const salvo = bruto ? JSON.parse(bruto) : null;
    return Array.isArray(salvo) ? salvo : [];
  } catch {
    return [];
  }
}

export function CarrinhoProvider({ children }) {
  const [itens, dispatch] = useReducer(reducer, undefined, estadoInicial);
  /** Último item adicionado, só para o aviso flutuante. Some sozinho. */
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(itens));
    } catch {
      // Modo privado / cota cheia: o carrinho segue funcionando em memória.
    }
  }, [itens]);

  const valor = useMemo(() => {
    const subtotal = itens.reduce((s, i) => s + i.preco_centavos * i.quantidade, 0);
    const totalItens = itens.reduce((s, i) => s + i.quantidade, 0);

    return {
      itens,
      totalItens,
      subtotal,
      freteGratis: subtotal >= MINIMO_FRETE_GRATIS,
      faltaFreteGratis: faltaParaFreteGratis(subtotal),
      progressoFrete: progressoFreteGratis(subtotal),
      aviso,
      fecharAviso: () => setAviso(null),
      adicionar: (produto, variante, quantidade = 1) => {
        dispatch({ tipo: "adicionar", produto, variante, quantidade });
        setAviso({ nome: produto.nome, imagem: produto.imagens?.[0] ?? null, em: Date.now() });
      },
      definirQuantidade: (chave, quantidade) =>
        dispatch({ tipo: "definirQuantidade", chave, quantidade }),
      remover: (chave) => dispatch({ tipo: "remover", chave }),
      limpar: () => dispatch({ tipo: "limpar" }),
    };
  }, [itens, aviso]);

  return <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>;
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) throw new Error("useCarrinho precisa estar dentro de <CarrinhoProvider>");
  return ctx;
}
