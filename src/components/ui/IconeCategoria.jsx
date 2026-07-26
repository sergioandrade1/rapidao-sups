import {
  Activity,
  Apple,
  Beaker,
  Boxes,
  CircleDot,
  Cookie,
  Droplets,
  Dumbbell,
  Egg,
  FlaskConical,
  Flame,
  Heart,
  Home,
  Leaf,
  Milk,
  Moon,
  Package,
  Pill,
  Shirt,
  Sparkles,
  Wheat,
  Zap,
} from "lucide-react";

/**
 * Ícone de cada categoria.
 *
 * O mapa vive aqui, e não em `data/categorias.js`, porque é decisão de
 * interface: a categoria vinda do banco carrega só o slug. Categoria nova sem
 * entrada no mapa cai no ícone genérico em vez de quebrar a tela.
 */
const ICONES = {
  proteinas: Dumbbell,
  creatina: Zap,
  "pre-treino": Flame,
  termogenicos: Activity,
  "vitaminas-e-minerais": Leaf,
  "lanches-fit": Cookie,
  packs: Package,
  acessorios: Shirt,
  albumina: Egg,
  carboidratos: Wheat,
  hipercalorico: Milk,
  "proteinas-veganas": Leaf,
  bcaa: Beaker,
  glutamina: FlaskConical,
  "beta-alanina": Beaker,
  "l-carnitina": Droplets,
  colageno: Sparkles,
  "omega-3": Apple,
  "coenzima-q10": Heart,
  melatonina: Moon,
  "probioticos-e-enzimas": Pill,
  diuretico: Droplets,
  "pre-hormonais": FlaskConical,
  "treine-em-casa": Home,
  promocoes: Boxes,
};

export default function IconeCategoria({ slug, size = 28, className = "" }) {
  const Icone = ICONES[slug] ?? CircleDot;
  return <Icone size={size} className={className} strokeWidth={1.75} aria-hidden="true" />;
}
