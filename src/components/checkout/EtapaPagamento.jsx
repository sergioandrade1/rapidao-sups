import Campo from "../ui/Campo";
import { FORMAS_PAGAMENTO, acharForma } from "../../lib/pedido";
import { brl } from "../../lib/formato";

/** Formata enquanto digita: "1550" -> "R$ 15,50". */
function mascararDinheiro(valor) {
  const d = valor.replace(/\D/g, "").slice(0, 8);
  return d ? brl(Number(d)) : "";
}

export default function EtapaPagamento({ dados, aoMudar, erros, total }) {
  return (
    <div className="flex flex-col gap-4">
      <fieldset>
        <legend className="mb-2 text-[13px] font-bold text-neutral-300">
          Como você prefere pagar?
        </legend>

        <div className="flex flex-col gap-2">
          {FORMAS_PAGAMENTO.map((f) => {
            const ativo = dados.forma === f.id;
            return (
              <label
                key={f.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                  ativo
                    ? f.destaque
                      ? "border-zap bg-zap/5"
                      : "border-amarelo bg-amarelo/5"
                    : "border-borda-clara hover:border-neutral-600"
                }`}
              >
                <input
                  type="radio"
                  name="forma"
                  value={f.id}
                  checked={ativo}
                  onChange={() => aoMudar("forma", f.id)}
                  className={`mt-0.5 size-4 ${f.destaque ? "accent-zap" : "accent-amarelo"}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span
                      className={`text-sm font-bold ${
                        ativo && f.destaque ? "text-zap" : "text-texto"
                      }`}
                    >
                      {f.nome}
                    </span>
                    {f.acrescimo > 0 && (
                      <span className="shrink-0 text-xs font-bold text-alerta">
                        + {brl(f.acrescimo)}
                      </span>
                    )}
                  </span>
                  <span className="block text-xs text-texto-fraco">{f.detalhe}</span>
                </span>
              </label>
            );
          })}
        </div>

        {erros.forma && <p className="mt-2 text-xs font-semibold text-alerta">{erros.forma}</p>}
      </fieldset>

      {acharForma(dados.forma)?.permiteTroco && (
        <div className="rounded-xl border border-borda bg-grafite-card p-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={dados.precisaTroco}
              onChange={(e) => aoMudar("precisaTroco", e.target.checked)}
              className="size-4 accent-amarelo"
            />
            Preciso de troco
          </label>

          {dados.precisaTroco && (
            <Campo
              id="trocoPara"
              rotulo="Troco para quanto?"
              className="mt-3"
              erro={erros.trocoPara}
              dica={`O total do pedido é ${brl(total)}.`}
              value={dados.trocoPara}
              onChange={(e) => aoMudar("trocoPara", mascararDinheiro(e.target.value))}
              placeholder="R$ 0,00"
              inputMode="numeric"
            />
          )}
        </div>
      )}

      <Campo
        id="observacao"
        rotulo="Observação para a loja"
        value={dados.observacao}
        onChange={(e) => aoMudar("observacao", e.target.value)}
      >
        <textarea
          id="observacao"
          rows={3}
          value={dados.observacao}
          onChange={(e) => aoMudar("observacao", e.target.value)}
          placeholder="Alguma preferência de sabor, horário... (opcional)"
          className="w-full resize-none rounded-lg border border-borda-clara bg-neutral-900 px-3 py-2.5 text-sm text-texto placeholder:text-texto-tenue focus:border-amarelo focus:outline-none"
        />
      </Campo>
    </div>
  );
}
