import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Logo from "./Logo";
import VitrineNav from "./VitrineNav";
import { categorias } from "../../data/categorias";
import { useCarrinho } from "../../context/CarrinhoContext";

function CampoBusca({ className = "", id }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [termo, setTermo] = useState(params.get("q") ?? "");

  function enviar(e) {
    e.preventDefault();
    const q = termo.trim();
    navigate(q ? `/busca?q=${encodeURIComponent(q)}` : "/produtos");
  }

  return (
    <form onSubmit={enviar} role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Buscar produtos
      </label>
      <input
        id={id}
        type="search"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="Buscar whey, creatina, pré-treino..."
        className="w-full rounded-lg border border-borda-clara bg-neutral-900 py-2.5 pl-4 pr-11 text-sm text-texto placeholder:text-texto-tenue focus:border-amarelo focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-amarelo"
      >
        <Search size={18} />
      </button>
    </form>
  );
}

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { totalItens } = useCarrinho();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-preto-header">
      <div className="container-site flex items-center gap-4 py-3.5">
        <button
          type="button"
          onClick={() => setMenuAberto((v) => !v)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          className="flex text-texto md:hidden"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" aria-label="Rapidão Suplementos — início">
          <Logo />
        </Link>

        {/* Busca inline só no desktop; no mobile ela aparece abaixo do header */}
        <CampoBusca id="busca-desktop" className="hidden max-w-[480px] flex-1 md:block" />

        <div className="ml-auto flex items-center gap-4 sm:gap-5">
          <button
            type="button"
            className="hidden flex-col items-center gap-0.5 text-[10px] text-texto transition-colors hover:text-amarelo md:flex"
          >
            <User size={22} />
            Conta
          </button>

          <Link
            to="/carrinho"
            aria-label={`Carrinho com ${totalItens} item(ns)`}
            className="relative flex flex-col items-center gap-0.5 text-[10px] text-texto transition-colors hover:text-amarelo"
          >
            <span className="relative">
              <ShoppingCart size={22} />
              {totalItens > 0 && (
                <span className="absolute -right-2.5 -top-2 flex size-[18px] items-center justify-center rounded-full bg-amarelo text-[11px] font-black text-black">
                  {totalItens}
                </span>
              )}
            </span>
            Carrinho
          </Link>
        </div>
      </div>

      {/* Busca no mobile — largura total, abaixo da logo */}
      <div className="container-site pb-3 md:hidden">
        <CampoBusca id="busca-mobile" />
      </div>

      <VitrineNav />

      {/* Menu mobile: catálogo completo de categorias */}
      {menuAberto && (
        <div className="max-h-[70vh] overflow-y-auto border-t border-borda-sutil bg-preto-fundo md:hidden">
          <div className="container-site flex flex-col py-2">
            {categorias.map((c) => (
              <Link
                key={c.slug}
                to={`/c/${c.slug}`}
                onClick={() => setMenuAberto(false)}
                className="flex items-center gap-3 border-b border-borda-sutil py-3 text-sm font-semibold text-neutral-200 hover:text-amarelo"
              >
                <span className="text-lg">{c.emoji}</span>
                {c.nome}
              </Link>
            ))}
            <Link
              to="/area-de-atuacao"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 py-3 text-sm font-semibold text-amarelo"
            >
              📍 Área de atuação
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
