import { Link } from "react-router-dom";
import { Clock, MapPin, Truck } from "lucide-react";
import { CHAMADAS, CIDADES_ATENDIDAS, CORTE_MESMO_DIA, LOJA } from "../lib/loja";
import { MINIMO_FRETE_GRATIS } from "../lib/frete";
import { brl } from "../lib/formato";
import { useTitulo } from "../hooks/useTitulo";

/** Página institucional "Área de atuação" — a copy vem da loja atual. */
export default function AreaAtuacao() {
  useTitulo("Área de atuação");

  return (
    <div className="container-site py-10">
      <h1 className="titulo-secao mb-2">
        Área de atuação <span className="text-amarelo">📍</span>
      </h1>
      <p className="mb-8 max-w-2xl text-texto-suave">
        {CHAMADAS.entrega}. {CHAMADAS.ritmo} 🛵💨
      </p>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {[
          { Icone: Clock, t: `Pedidos até as ${CORTE_MESMO_DIA}`, s: "Chegam no mesmo dia" },
          { Icone: Truck, t: "Frete grátis", s: `Acima de ${brl(MINIMO_FRETE_GRATIS)}` },
          { Icone: MapPin, t: `${CIDADES_ATENDIDAS.length} cidades`, s: "Recife e região metro" },
        ].map(({ Icone, t, s }) => (
          <div key={t} className="flex items-center gap-3 rounded-xl border border-borda bg-grafite-card p-4">
            <Icone size={26} className="shrink-0 text-amarelo" />
            <div>
              <div className="text-sm font-extrabold">{t}</div>
              <div className="text-xs text-texto-fraco">{s}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-black uppercase italic">Cidades atendidas</h2>
      <ul className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CIDADES_ATENDIDAS.map((cidade) => (
          <li
            key={cidade}
            className="flex items-center gap-2 rounded-xl border border-borda bg-grafite-card px-4 py-3 text-sm font-bold"
          >
            <MapPin size={16} className="shrink-0 text-amarelo" />
            {cidade}
          </li>
        ))}
      </ul>

      <div className="rounded-xl border border-zap/40 bg-zap/5 p-6">
        <h2 className="mb-2 text-lg font-black uppercase italic">Não achou sua cidade?</h2>
        <p className="mb-4 text-sm text-texto-suave">
          Chama no WhatsApp que a gente verifica a entrega no seu endereço.
        </p>
        <a
          href={`https://wa.me/${LOJA.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-zap px-6 py-3 text-sm font-extrabold text-white transition-colors hover:bg-zap-escuro"
        >
          Falar no WhatsApp · {LOJA.whatsappExibicao}
        </a>
      </div>

      <Link to="/produtos" className="mt-8 inline-block font-bold text-amarelo hover:underline">
        ← Ver produtos
      </Link>
    </div>
  );
}
