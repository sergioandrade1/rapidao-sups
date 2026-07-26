import { useEffect } from "react";

const SUFIXO = "Rapidão Suplementos";

/**
 * Define o <title> da aba por página.
 *
 * Sem isto toda rota herdava o mesmo título — com várias abas abertas o cliente
 * não distingue "Carrinho" de "Creatina", e o texto vira o rótulo padrão quando
 * a página é compartilhada. Vale como base de SEO até existir SSR.
 */
export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · ${SUFIXO}` : `${SUFIXO} · Delivery em Recife e região`;
  }, [titulo]);
}
