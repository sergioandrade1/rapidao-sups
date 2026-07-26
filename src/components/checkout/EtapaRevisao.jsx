import { Pencil } from "lucide-react";
import { FORMAS_PAGAMENTO } from "../../lib/pedido";

function Bloco({ titulo, aoEditar, children }) {
  return (
    <section className="rounded-xl border border-borda bg-grafite-card p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-amarelo">
          {titulo}
        </h3>
        <button
          type="button"
          onClick={aoEditar}
          className="flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-amarelo"
        >
          <Pencil size={12} />
          Editar
        </button>
      </div>
      <div className="text-sm leading-relaxed text-neutral-300">{children}</div>
    </section>
  );
}

export default function EtapaRevisao({ dados, aoVoltarPara }) {
  const forma = FORMAS_PAGAMENTO.find((f) => f.id === dados.forma);

  return (
    <div className="flex flex-col gap-3">
      <Bloco titulo="Quem recebe" aoEditar={() => aoVoltarPara(0)}>
        <p className="font-bold text-texto">{dados.nome}</p>
        <p>{dados.telefone}</p>
        {dados.email && <p className="text-texto-fraco">{dados.email}</p>}
      </Bloco>

      <Bloco titulo="Endereço" aoEditar={() => aoVoltarPara(1)}>
        <p>
          {dados.rua}, {dados.numero}
          {dados.complemento && ` — ${dados.complemento}`}
        </p>
        <p>
          {dados.bairro} · {dados.cidade}
        </p>
        <p className="text-texto-fraco">CEP {dados.cep}</p>
        {dados.referencia && <p className="text-texto-fraco">Ref.: {dados.referencia}</p>}
      </Bloco>

      <Bloco titulo="Pagamento" aoEditar={() => aoVoltarPara(2)}>
        <p className="font-bold text-texto">{forma?.nome}</p>
        {dados.forma === "dinheiro" && (
          <p>{dados.precisaTroco ? `Troco para ${dados.trocoPara}` : "Não precisa de troco"}</p>
        )}
        {dados.observacao && (
          <p className="mt-1 text-texto-fraco">Obs.: {dados.observacao}</p>
        )}
      </Bloco>
    </div>
  );
}
