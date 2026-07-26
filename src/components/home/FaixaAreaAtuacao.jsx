import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { CIDADES_ATENDIDAS } from "../../lib/loja";

/** Bloco "ÁREA DE ATUAÇÃO" — copy herdada da loja atual, que destaca as cidades. */
export default function FaixaAreaAtuacao() {
  return (
    <section className="container-site py-10">
      <div className="card-superficie flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="mb-2 flex items-center gap-2 text-amarelo">
            <MapPin size={20} />
            <h2 className="text-lg font-black uppercase italic tracking-tight">Área de atuação</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {CIDADES_ATENDIDAS.map((cidade) => (
              <span
                key={cidade}
                className="rounded-full border border-borda-clara bg-neutral-900 px-3 py-1 text-[13px] font-semibold text-neutral-200"
              >
                {cidade}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[13px] text-texto-fraco">
            Rápido, prático e seguro 🛵💨 — entregamos em toda a região metropolitana do Recife.
          </p>
        </div>

        <Link to="/area-de-atuacao" className="btn-secundario shrink-0">
          Ver se entrego aí
        </Link>
      </div>
    </section>
  );
}
