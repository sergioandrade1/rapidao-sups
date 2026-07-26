import { Zap } from "lucide-react";
import { MINIMO_FRETE_GRATIS } from "../../lib/frete";
import { brl } from "../../lib/formato";
import { useJanelaEntrega } from "../../hooks/useJanelaEntrega";

/**
 * Faixa do topo. O texto acompanha a janela de entrega — no celular o selo do
 * hero fica oculto, então é aqui que a urgência aparece.
 */
export default function FaixaTopo() {
  const janela = useJanelaEntrega();

  const mensagem = {
    aberto: `FALTAM ${janela.titulo.toUpperCase()} PARA RECEBER HOJE`,
    antes: `ABRIMOS ÀS 9H · PEDIDO ATÉ AS ${janela.corte} RECEBE NO MESMO DIA`,
    encerrado: `PEDIDOS DE HOJE SAEM AMANHÃ · CORTE ÀS ${janela.corte}`,
    domingo: "ENTREGAS DE SEGUNDA A SÁBADO",
  }[janela.estado];

  const urgente = janela.estado === "aberto" && janela.restanteMin <= 60;

  return (
    <div
      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-center text-[11px] font-extrabold leading-tight sm:text-[12.5px] ${
        urgente ? "bg-alerta text-white" : "bg-amarelo text-black"
      }`}
    >
      <Zap
        size={13}
        className={`hidden shrink-0 sm:block ${urgente ? "fill-white" : "fill-black"}`}
      />
      <span>
        {mensagem} · FRETE GRÁTIS ACIMA DE {brl(MINIMO_FRETE_GRATIS)}
      </span>
    </div>
  );
}
