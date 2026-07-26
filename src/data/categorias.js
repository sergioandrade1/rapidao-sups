/**
 * Categorias reais da loja (Vendizap), normalizadas em Title Case e com slug.
 * `destaque` marca as que aparecem nos atalhos principais.
 *
 * O ícone de cada uma não fica aqui: é decisão de interface e vive em
 * `components/ui/IconeCategoria.jsx`, mapeado por slug. Assim a categoria vinda
 * do banco carrega só o dado, sem carregar aparência.
 */
export const categorias = [
  { slug: "proteinas", nome: "Proteínas", destaque: true },
  { slug: "creatina", nome: "Creatina", destaque: true },
  { slug: "pre-treino", nome: "Pré-treino", destaque: true },
  { slug: "termogenicos", nome: "Termogênicos", destaque: true },
  { slug: "vitaminas-e-minerais", nome: "Vitaminas e Minerais", destaque: true },
  { slug: "lanches-fit", nome: "Lanches Fit", destaque: true },
  { slug: "packs", nome: "Packs", destaque: true },
  { slug: "acessorios", nome: "Acessórios", destaque: true },

  { slug: "albumina", nome: "Albumina" },
  { slug: "carboidratos", nome: "Carboidratos" },
  { slug: "hipercalorico", nome: "Hipercalórico" },
  { slug: "proteinas-veganas", nome: "Proteínas Veganas" },
  { slug: "bcaa", nome: "BCAA" },
  { slug: "glutamina", nome: "Glutamina" },
  { slug: "beta-alanina", nome: "Beta Alanina" },
  { slug: "l-carnitina", nome: "L-Carnitina" },
  { slug: "colageno", nome: "Colágeno" },
  { slug: "omega-3", nome: "Ômega 3" },
  { slug: "coenzima-q10", nome: "Coenzima Q-10" },
  { slug: "melatonina", nome: "Melatonina" },
  { slug: "probioticos-e-enzimas", nome: "Probióticos e Enzimas" },
  { slug: "diuretico", nome: "Diurético" },
  { slug: "pre-hormonais", nome: "Pré-hormonais" },
  { slug: "treine-em-casa", nome: "Treine em Casa" },
];
// "Promoções" e "Packs" como vitrine ficam em data/vitrines.js.
// Categoria descreve o produto; vitrine é curadoria comercial.

export const categoriasDestaque = categorias.filter((c) => c.destaque);

export function acharCategoria(slug) {
  return categorias.find((c) => c.slug === slug) ?? null;
}
