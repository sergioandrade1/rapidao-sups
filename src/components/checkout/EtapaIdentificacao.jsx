import Campo from "../ui/Campo";
import { mascararTelefone } from "../../lib/pedido";

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
        dica="É por aqui que a gente confirma o pedido e manda o PIX."
        value={dados.telefone}
        onChange={(e) => aoMudar("telefone", mascararTelefone(e.target.value))}
        placeholder="(81) 90000-0000"
        inputMode="tel"
        autoComplete="tel"
      />

      <Campo
        id="email"
        rotulo="E-mail (opcional)"
        value={dados.email}
        onChange={(e) => aoMudar("email", e.target.value)}
        placeholder="para receber o comprovante"
        type="email"
        autoComplete="email"
      />
    </div>
  );
}
