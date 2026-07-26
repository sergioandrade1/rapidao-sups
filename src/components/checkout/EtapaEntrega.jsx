import Campo from "../ui/Campo";
import { mascararCep } from "../../lib/pedido";
import { CIDADES_ATENDIDAS } from "../../lib/loja";

export default function EtapaEntrega({ dados, aoMudar, erros }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Campo
          id="cep"
          rotulo="CEP"
          erro={erros.cep}
          value={dados.cep}
          onChange={(e) => aoMudar("cep", mascararCep(e.target.value))}
          placeholder="52020-020"
          inputMode="numeric"
          autoComplete="postal-code"
        />

        <Campo id="cidade" rotulo="Cidade" erro={erros.cidade}>
          <select
            id="cidade"
            value={dados.cidade}
            onChange={(e) => aoMudar("cidade", e.target.value)}
            aria-invalid={erros.cidade ? true : undefined}
            className={`w-full rounded-lg border bg-neutral-900 px-3 py-2.5 text-sm text-texto focus:outline-none ${
              erros.cidade ? "border-alerta" : "border-borda-clara focus:border-amarelo"
            }`}
          >
            <option value="">Selecione</option>
            {CIDADES_ATENDIDAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <Campo
        id="rua"
        rotulo="Rua"
        erro={erros.rua}
        value={dados.rua}
        onChange={(e) => aoMudar("rua", e.target.value)}
        placeholder="Nome da rua ou avenida"
        autoComplete="address-line1"
      />

      <div className="grid grid-cols-3 gap-4">
        <Campo
          id="numero"
          rotulo="Número"
          erro={erros.numero}
          value={dados.numero}
          onChange={(e) => aoMudar("numero", e.target.value)}
          placeholder="123"
        />
        <Campo
          id="complemento"
          rotulo="Complemento"
          className="col-span-2"
          value={dados.complemento}
          onChange={(e) => aoMudar("complemento", e.target.value)}
          placeholder="Apto, bloco (opcional)"
        />
      </div>

      <Campo
        id="bairro"
        rotulo="Bairro"
        erro={erros.bairro}
        value={dados.bairro}
        onChange={(e) => aoMudar("bairro", e.target.value)}
        placeholder="Boa Viagem"
      />

      <Campo
        id="referencia"
        rotulo="Ponto de referência"
        dica="Ajuda o entregador a achar mais rápido."
        value={dados.referencia}
        onChange={(e) => aoMudar("referencia", e.target.value)}
        placeholder="Perto da praça, portão azul... (opcional)"
      />
    </div>
  );
}
