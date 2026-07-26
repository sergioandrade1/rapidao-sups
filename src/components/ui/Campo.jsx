/**
 * Campo de formulário com rótulo e mensagem de erro.
 *
 * O erro é ligado ao input por `aria-describedby` e marcado com
 * `aria-invalid` — sem isso, quem usa leitor de tela ouve "campo inválido"
 * sem saber o motivo.
 */
export default function Campo({
  id,
  rotulo,
  erro,
  dica,
  className = "",
  children,
  ...props
}) {
  const idErro = erro ? `${id}-erro` : undefined;
  const idDica = dica ? `${id}-dica` : undefined;
  const descrito = [idErro, idDica].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-[13px] font-bold text-neutral-300">
        {rotulo}
      </label>

      {children ?? (
        <input
          id={id}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descrito}
          className={`w-full rounded-lg border bg-neutral-900 px-3 py-2.5 text-sm text-texto placeholder:text-texto-tenue focus:outline-none ${
            erro ? "border-alerta focus:border-alerta" : "border-borda-clara focus:border-amarelo"
          }`}
          {...props}
        />
      )}

      {dica && !erro && (
        <p id={idDica} className="mt-1 text-xs text-texto-fraco">
          {dica}
        </p>
      )}
      {erro && (
        <p id={idErro} className="mt-1 text-xs font-semibold text-alerta">
          {erro}
        </p>
      )}
    </div>
  );
}
