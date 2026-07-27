import { brl } from "./formato";
import { acharForma } from "./pedido";
import { LOJA } from "./loja";

/**
 * Monta a mensagem que o cliente envia para a loja no WhatsApp.
 *
 * O asterisco vira negrito no WhatsApp. A mensagem precisa ser legível de
 * relance no celular de quem separa o pedido, então: número primeiro, itens,
 * total, e endereço no fim (que é o bloco mais longo).
 */
export function montarMensagemPedido({ numero, dados, itens, totais }) {
  const forma = acharForma(dados.forma);
  const l = [];

  l.push(`*PEDIDO ${numero}*`);
  l.push("");

  l.push("*ITENS*");
  for (const item of itens) {
    const sabor = item.variante ? ` (${item.variante.rotulo})` : "";
    l.push(`• ${item.quantidade}x ${item.nome}${sabor} — ${brl(item.preco_centavos * item.quantidade)}`);
  }
  l.push("");

  l.push(`Subtotal: ${brl(totais.subtotal)}`);
  l.push(`Entrega: ${totais.freteGratis ? "grátis" : brl(totais.frete)}`);
  if (totais.acrescimo > 0) l.push(`Acréscimo cartão: ${brl(totais.acrescimo)}`);
  l.push(`*TOTAL: ${brl(totais.total)}*`);
  l.push("");

  l.push("*PAGAMENTO*");
  l.push(forma?.nome ?? dados.forma);
  if (forma?.permiteTroco && dados.precisaTroco) l.push(`Troco para ${dados.trocoPara}`);
  l.push("");

  l.push("*ENTREGA*");
  l.push(dados.nome);
  l.push(dados.telefone);
  l.push(`${dados.rua}, ${dados.numero}${dados.complemento ? ` - ${dados.complemento}` : ""}`);
  l.push(`${dados.bairro} - ${dados.cidade}`);
  l.push(`CEP ${dados.cep}`);
  if (dados.referencia) l.push(`Ref.: ${dados.referencia}`);

  if (dados.observacao) {
    l.push("");
    l.push("*OBSERVAÇÃO*");
    l.push(dados.observacao);
  }

  return l.join("\n");
}

/**
 * Link do WhatsApp com a mensagem pronta.
 *
 * O wa.me resolve sozinho para onde levar: no celular abre o aplicativo direto
 * na conversa; no computador oferece WhatsApp Web ou o programa instalado.
 * Devolve null quando não há número configurado (ambiente de teste).
 */
export function linkWhatsAppPedido(mensagem) {
  if (!LOJA.whatsapp) return null;
  return `https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
