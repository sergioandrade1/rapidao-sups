import { useEffect, useState } from "react";
import { janelaEntrega } from "../lib/janelaEntrega";

/**
 * Estado da janela de entrega, atualizado sozinho.
 *
 * Recalcula a cada 30s: o contador mostra minutos, então não há motivo para
 * re-renderizar a cada segundo. Recalcula também quando a aba volta ao foco —
 * um celular que ficou com a página aberta no bolso mostraria hora velha.
 */
export function useJanelaEntrega() {
  const [janela, setJanela] = useState(() => janelaEntrega());

  useEffect(() => {
    const atualizar = () => setJanela(janelaEntrega());

    const id = setInterval(atualizar, 30_000);
    document.addEventListener("visibilitychange", atualizar);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", atualizar);
    };
  }, []);

  return janela;
}
