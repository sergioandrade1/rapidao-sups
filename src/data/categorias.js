/**
 * Categorias reais da loja (Vendizap), normalizadas em Title Case e com slug.
 * `destaque` marca as que aparecem no grid da home; o resto vive no catálogo.
 */
export const categorias = [
  { slug: "proteinas", nome: "Proteínas", emoji: "💪", destaque: true },
  { slug: "creatina", nome: "Creatina", emoji: "⚡", destaque: true },
  { slug: "pre-treino", nome: "Pré-treino", emoji: "🔥", destaque: true },
  { slug: "termogenicos", nome: "Termogênicos", emoji: "🏃", destaque: true },
  { slug: "vitaminas-e-minerais", nome: "Vitaminas e Minerais", emoji: "🌿", destaque: true },
  { slug: "lanches-fit", nome: "Lanches Fit", emoji: "🍫", destaque: true },
  { slug: "packs", nome: "Packs", emoji: "📦", destaque: true },
  { slug: "acessorios", nome: "Acessórios", emoji: "🎽", destaque: true },

  { slug: "albumina", nome: "Albumina", emoji: "🥚" },
  { slug: "carboidratos", nome: "Carboidratos", emoji: "🍚" },
  { slug: "hipercalorico", nome: "Hipercalórico", emoji: "🍶" },
  { slug: "proteinas-veganas", nome: "Proteínas Veganas", emoji: "🍃" },
  { slug: "bcaa", nome: "BCAA", emoji: "🧬" },
  { slug: "glutamina", nome: "Glutamina", emoji: "🧪" },
  { slug: "beta-alanina", nome: "Beta Alanina", emoji: "🧂" },
  { slug: "l-carnitina", nome: "L-Carnitina", emoji: "🔻" },
  { slug: "colageno", nome: "Colágeno", emoji: "✨" },
  { slug: "omega-3", nome: "Ômega 3", emoji: "🐟" },
  { slug: "coenzima-q10", nome: "Coenzima Q-10", emoji: "❤️" },
  { slug: "melatonina", nome: "Melatonina", emoji: "🌙" },
  { slug: "probioticos-e-enzimas", nome: "Probióticos e Enzimas", emoji: "🦠" },
  { slug: "diuretico", nome: "Diurético", emoji: "💧" },
  { slug: "pre-hormonais", nome: "Pré-hormonais", emoji: "⚗️" },
  { slug: "treine-em-casa", nome: "Treine em Casa", emoji: "🏠" },
];
// "Promoções" e "Packs" saíram daqui: viraram vitrines (ver data/vitrines.js).
// Categoria descreve o produto; vitrine é curadoria comercial.

export const categoriasDestaque = categorias.filter((c) => c.destaque);

export function acharCategoria(slug) {
  return categorias.find((c) => c.slug === slug) ?? null;
}
