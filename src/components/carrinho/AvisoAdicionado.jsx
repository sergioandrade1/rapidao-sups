import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { useCarrinho } from "../../context/CarrinhoContext";

/**
 * Aviso flutuante ao adicionar um item.
 *
 * Sem isso, clicar em "Adicionar" no card não dava retorno visível nenhum —
 * o único sinal era o número no ícone do topo, fácil de não notar no celular.
 */
export default function AvisoAdicionado() {
  const { aviso, fecharAviso, totalItens } = useCarrinho();

  // Reinicia o cronômetro a cada novo item (a chave `em` muda).
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(fecharAviso, 4000);
    return () => clearTimeout(t);
  }, [aviso?.em, fecharAviso, aviso]);

  if (!aviso) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 bottom-24 z-100 mx-auto max-w-sm rounded-xl border border-zap/50 bg-preto-header/95 p-3 shadow-2xl backdrop-blur sm:inset-x-auto sm:right-6 sm:bottom-24"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zap">
          <Check size={18} strokeWidth={3} className="text-white" />
        </div>

        {aviso.imagem && (
          <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1">
            <img src={aviso.imagem} alt="" className="size-full object-contain" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-zap">Adicionado ao carrinho</p>
          <p className="truncate text-xs text-texto-suave">{aviso.nome}</p>
        </div>

        <button
          type="button"
          onClick={fecharAviso}
          aria-label="Fechar aviso"
          className="shrink-0 text-texto-fraco hover:text-texto"
        >
          <X size={18} />
        </button>
      </div>

      <Link
        to="/carrinho"
        onClick={fecharAviso}
        className="btn-primario mt-3 w-full py-2 text-xs"
      >
        Ver carrinho ({totalItens})
      </Link>
    </div>
  );
}
