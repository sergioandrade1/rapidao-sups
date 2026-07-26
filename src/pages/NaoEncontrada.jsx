import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function NaoEncontrada() {
  return (
    <div className="container-site flex flex-col items-center gap-4 py-24 text-center">
      <Zap size={64} className="fill-amarelo text-amarelo" />
      <h1 className="text-5xl font-black italic">404</h1>
      <p className="max-w-sm text-texto-suave">
        Essa página correu mais rápido que a gente. Volte pro início ou veja o catálogo.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primario">
          Ir pro início
        </Link>
        <Link to="/produtos" className="btn-secundario">
          Ver produtos
        </Link>
      </div>
    </div>
  );
}
