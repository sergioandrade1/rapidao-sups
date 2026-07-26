import { Clock, MapPin, ShieldCheck, Truck } from "lucide-react";
import { brl } from "../../lib/formato";
import { MINIMO_FRETE_GRATIS } from "../../lib/frete";
import { CIDADES_ATENDIDAS, CORTE_MESMO_DIA } from "../../lib/loja";

const BENEFICIOS = [
  { Icone: Clock, titulo: "Entrega no mesmo dia", sub: `Pedidos até as ${CORTE_MESMO_DIA}` },
  { Icone: Truck, titulo: "Frete grátis", sub: `Acima de ${brl(MINIMO_FRETE_GRATIS)}` },
  { Icone: ShieldCheck, titulo: "100% originais", sub: "Rápido, prático e seguro" },
  // Listar as cidades vale mais que dizer "7 cidades": o cliente procura o nome
  // da dele. Fonte menor porque é linha de apoio, não manchete.
  { Icone: MapPin, titulo: "Recife e região", sub: CIDADES_ATENDIDAS.join(", ") },
];

export default function FaixaBeneficios() {
  return (
    <section className="border-y border-borda-sutil bg-preto-fundo">
      <div className="container-site grid grid-cols-1 gap-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFICIOS.map(({ Icone, titulo, sub }) => (
          <div key={titulo} className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-neutral-900">
              <Icone size={26} className="text-amarelo" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold">{titulo}</div>
              <div className="text-[11px] leading-snug text-texto-fraco">{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
