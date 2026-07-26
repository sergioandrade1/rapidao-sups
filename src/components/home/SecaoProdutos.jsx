import { Link } from "react-router-dom";
import GridProdutos from "../produto/GridProdutos";

export default function SecaoProdutos({ titulo, produtos, carregando, erro, verTodos }) {
  return (
    <section className="container-site pb-15 pt-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="titulo-secao">{titulo}</h2>
        {verTodos && (
          <Link
            to={verTodos}
            className="shrink-0 text-sm font-bold text-amarelo hover:underline"
          >
            Ver todos →
          </Link>
        )}
      </div>

      <GridProdutos produtos={produtos} carregando={carregando} erro={erro} />
    </section>
  );
}
