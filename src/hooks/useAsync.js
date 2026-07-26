import { useEffect, useState } from "react";

/**
 * Executa uma função assíncrona e devolve { dados, carregando, erro }.
 *
 * Ignora respostas de chamadas antigas (flag `ativo`), senão um filtro rápido
 * pode fazer um resultado anterior chegar depois e sobrescrever o atual.
 *
 * @param {() => Promise<any>} fn
 * @param {any[]} deps lista de dependências, como no useEffect
 */
export function useAsync(fn, deps = []) {
  const [estado, setEstado] = useState({ dados: null, carregando: true, erro: null });

  useEffect(() => {
    let ativo = true;
    setEstado((e) => ({ ...e, carregando: true, erro: null }));

    fn()
      .then((dados) => ativo && setEstado({ dados, carregando: false, erro: null }))
      .catch((erro) => ativo && setEstado({ dados: null, carregando: false, erro }));

    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return estado;
}
