const VARIANTES = {
  amarelo: "bg-amarelo text-black",
  verde: "bg-zap text-white",
  alerta: "bg-alerta text-white",
};

/** Etiqueta curta usada sobre a imagem do produto (tag e desconto). */
export default function Badge({ children, variante = "amarelo" }) {
  return (
    <span
      className={`${VARIANTES[variante]} rounded px-2 py-[3px] text-[10px] font-extrabold uppercase tracking-wide`}
    >
      {children}
    </span>
  );
}
