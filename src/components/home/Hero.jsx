import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import SeloEntrega from "./SeloEntrega";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_70%_40%,#2a2400_0%,#0d0d0d_60%)]">
      <div className="container-site flex flex-wrap items-center gap-10 py-12 sm:py-15">
        <div className="flex-1 basis-[380px]">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-amarelo bg-neutral-900 px-3.5 py-1">
            <Zap size={14} className="fill-amarelo text-amarelo" />
            <span className="text-[11px] font-bold text-amarelo sm:text-xs">
              DELIVERY DE SUPLEMENTOS · RECIFE E REGIÃO
            </span>
          </div>

          <h1 className="text-[40px] font-black italic leading-[0.95] tracking-[-0.03em] sm:text-5xl lg:text-[52px]">
            PEDIU ATÉ
            <br />
            <span className="text-amarelo">AS 18:00?</span>
            <br />
            RECEBE HOJE.
          </h1>

          <p className="mt-4 max-w-105 text-[15px] leading-relaxed text-texto-suave sm:text-base">
            Suplementos <strong className="text-texto">100% originais</strong> com a entrega mais
            rápida da região. Rápido, prático e seguro 🛵💨
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/produtos" className="btn-primario px-8 py-4 text-[15px] font-black">
              Comprar agora
            </Link>
            <Link to="/v/promocoes" className="btn-secundario px-7 py-4 text-[15px]">
              Ver ofertas 🔥
            </Link>
          </div>
        </div>

        {/* Selo com contagem regressiva até o corte */}
        <div className="hidden flex-1 basis-[300px] justify-center sm:flex">
          <SeloEntrega />
        </div>
      </div>
    </section>
  );
}
