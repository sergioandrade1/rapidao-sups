import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Trilho com rolagem horizontal e setas no desktop.
 *
 * A rolagem é nativa (scroll-snap + touch), então no celular funciona com o
 * dedo e sem JS. As setas só aparecem quando há conteúdo para aquele lado.
 */
export default function Carrossel({ children, className = "" }) {
  const trilho = useRef(null);
  const [podeEsquerda, setPodeEsquerda] = useState(false);
  const [podeDireita, setPodeDireita] = useState(false);

  function avaliar() {
    const el = trilho.current;
    if (!el) return;
    setPodeEsquerda(el.scrollLeft > 8);
    setPodeDireita(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  useEffect(() => {
    avaliar();
    const el = trilho.current;
    if (!el) return;
    const ro = new ResizeObserver(avaliar);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  function rolar(direcao) {
    const el = trilho.current;
    if (!el) return;
    el.scrollBy({ left: direcao * el.clientWidth * 0.8, behavior: "smooth" });
  }

  const seta =
    "absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-borda-clara bg-preto-header/90 text-amarelo shadow-lg transition-colors hover:border-amarelo lg:flex";

  return (
    <div className={`relative ${className}`}>
      {podeEsquerda && (
        <button
          type="button"
          onClick={() => rolar(-1)}
          aria-label="Rolar para a esquerda"
          className={`${seta} -left-4`}
        >
          <ChevronLeft size={22} />
        </button>
      )}

      <div
        ref={trilho}
        onScroll={avaliar}
        className="scrollbar-oculta flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1"
      >
        {children}
      </div>

      {podeDireita && (
        <button
          type="button"
          onClick={() => rolar(1)}
          aria-label="Rolar para a direita"
          className={`${seta} -right-4`}
        >
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  );
}
