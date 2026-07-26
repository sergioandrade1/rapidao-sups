import Hero from "../components/home/Hero";
import FaixaBeneficios from "../components/home/FaixaBeneficios";
import CarrosselCategorias from "../components/home/CarrosselCategorias";
import SecaoDestaque from "../components/home/SecaoDestaque";
import SecaoProdutos from "../components/home/SecaoProdutos";
import FaixaAreaAtuacao from "../components/home/FaixaAreaAtuacao";
import { useAsync } from "../hooks/useAsync";
import { useTitulo } from "../hooks/useTitulo";
import {
  listarDestaques,
  listarMaisVendidos,
  listarPromocoes,
  listarProdutos,
} from "../services/produtos";

/**
 * Ordem das seções espelha a loja atual:
 * destaque → categorias → promoções → mais vendidos → catálogo.
 */
export default function Home() {
  useTitulo(null);

  const destaques = useAsync(() => listarDestaques(10), []);
  const promocoes = useAsync(() => listarPromocoes(8), []);
  const maisVendidos = useAsync(() => listarMaisVendidos(8), []);
  const catalogo = useAsync(() => listarProdutos({}), []);

  return (
    <>
      <Hero />
      <FaixaBeneficios />

      <SecaoDestaque
        titulo="Produtos em destaque"
        subtitulo="Os combos que mais saem — economia de verdade no PIX"
        verTodos="/v/kits-promocionais"
        produtos={destaques.dados}
        carregando={destaques.carregando}
        erro={destaques.erro}
      />

      <CarrosselCategorias />

      <SecaoProdutos
        titulo="Promoções"
        verTodos="/v/promocoes"
        produtos={promocoes.dados}
        carregando={promocoes.carregando}
        erro={promocoes.erro}
      />

      <SecaoProdutos
        titulo="Mais vendidos"
        verTodos="/v/top-20"
        produtos={maisVendidos.dados}
        carregando={maisVendidos.carregando}
        erro={maisVendidos.erro}
      />

      <FaixaAreaAtuacao />

      <SecaoProdutos
        titulo="Todos os produtos"
        verTodos="/produtos"
        produtos={catalogo.dados?.slice(0, 8)}
        carregando={catalogo.carregando}
        erro={catalogo.erro}
      />
    </>
  );
}
