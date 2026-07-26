import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { CHAMADAS, CIDADES_ATENDIDAS, HORARIOS, LOJA } from "../../lib/loja";

const INSTITUCIONAL = [
  { rotulo: "Área de atuação", para: "/area-de-atuacao" },
  { rotulo: "Todos os produtos", para: "/produtos" },
  { rotulo: "Trocas e devoluções", para: "/area-de-atuacao" },
  { rotulo: "Política de privacidade", para: "/area-de-atuacao" },
];

const PAGAMENTOS = ["PIX", "VISA", "MASTER", "ELO", "BOLETO"];

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-amarelo bg-preto-fundo">
      <div className="container-site grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Zap size={22} className="fill-amarelo text-amarelo" />
            <span className="text-lg font-black italic">RAPIDÃO SUPLEMENTOS</span>
          </div>
          <p className="text-[13px] leading-relaxed text-texto-fraco">
            {CHAMADAS.ritmo}. Delivery de suplementos originais em Recife e região metropolitana.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-[13px] uppercase tracking-widest text-amarelo">Área de atuação</h4>
          <p className="text-[13px] leading-relaxed text-texto-suave">
            {CIDADES_ATENDIDAS.join(" · ")}
          </p>
          <Link
            to="/area-de-atuacao"
            className="mt-2 inline-block text-[13px] font-bold text-amarelo hover:underline"
          >
            Ver detalhes →
          </Link>
        </div>

        <div>
          <h4 className="mb-3 text-[13px] uppercase tracking-widest text-amarelo">Atendimento</h4>
          {HORARIOS.map((h) => (
            <div key={h} className="py-1 text-[13px] text-texto-suave">
              {h}
            </div>
          ))}
          <a
            href={`https://wa.me/${LOJA.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1 text-[13px] font-bold text-zap hover:underline"
          >
            WhatsApp: {LOJA.whatsappExibicao}
          </a>

          <div className="mt-3 flex flex-col gap-1">
            {INSTITUCIONAL.map((l) => (
              <Link key={l.rotulo} to={l.para} className="text-[13px] text-texto-suave hover:text-amarelo">
                {l.rotulo}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-[13px] uppercase tracking-widest text-amarelo">Pagamento</h4>
          <div className="flex flex-wrap gap-1.5">
            {PAGAMENTOS.map((p) => (
              <span
                key={p}
                className="rounded border border-borda-clara bg-neutral-900 px-2 py-1 text-[10px] font-bold text-neutral-300"
              >
                {p}
              </span>
            ))}
          </div>
          <a
            href={LOJA.linktree}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-[13px] text-texto-suave hover:text-amarelo"
          >
            Nossas redes sociais →
          </a>
        </div>
      </div>

      <div className="border-t border-borda-sutil px-5 py-4 text-center text-xs text-texto-tenue">
        © 2026 {LOJA.nome} · {LOJA.cidade} · Feito com ⚡ em Recife-PE
      </div>
    </footer>
  );
}
