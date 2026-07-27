import Campo from "../ui/Campo";
import { mascararTelefone } from "../../lib/pedido";

/** Só nome e WhatsApp: o pedido é fechado por conversa, e-mail não teria uso. */
export default function EtapaIdentificacao({ dados, aoMudar, erros }) {
  return (
    <div className="flex flex-col gap-4">
      <Campo
        id="nome"
        rotulo="Nome completo"
        erro={erros.nome}
        value={dados.nome}
        onChange={(e) => aoMudar("nome", e.target.value)}
        placeholder="Como você se chama"
        autoComplete="name"
      />

      <Campo
        id="telefone"
        rotulo="WhatsApp"
        erro={erros.telefone}
        dica="É por aqui que a loja confirma o pedido e manda o PIX."
        value={dados.telefone}
        onChange={(e) => aoMudar("telefone", mascararTelefone(e.target.value))}
        placeholder="(81) 90000-0000"
        inputMode="tel"
        autoComplete="tel"
      />
    </div>
  );
}
