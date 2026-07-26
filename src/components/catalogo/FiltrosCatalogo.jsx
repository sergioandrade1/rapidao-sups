import { brl } from "../../lib/formato";

/**
 * Painel de filtros. Não guarda estado próprio — lê e escreve nos search params
 * via callbacks, para que a URL continue sendo a fonte da verdade.
 */
export default function FiltrosCatalogo({
  marcas,
  marcasSelecionadas,
  aoAlternarMarca,
  precoMax,
  precoMaxLimite,
  aoMudarPreco,
  aoLimpar,
  temFiltro,
}) {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-amarelo">
          Marca
        </h3>
        <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
          {marcas.map((marca) => (
            <label key={marca} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={marcasSelecionadas.includes(marca)}
                onChange={() => aoAlternarMarca(marca)}
                className="size-4 accent-amarelo"
              />
              <span className="text-neutral-200">{marca}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-amarelo">
          Preço até
        </h3>
        <input
          type="range"
          min={0}
          max={precoMaxLimite}
          step={500}
          value={precoMax}
          onChange={(e) => aoMudarPreco(Number(e.target.value))}
          className="w-full accent-amarelo"
          aria-label="Preço máximo"
        />
        <div className="mt-1 flex justify-between text-xs text-texto-fraco">
          <span>{brl(0)}</span>
          <span className="font-bold text-texto">{brl(precoMax)}</span>
        </div>
      </section>

      {temFiltro && (
        <button
          type="button"
          onClick={aoLimpar}
          className="text-left text-sm font-bold text-amarelo hover:underline"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
