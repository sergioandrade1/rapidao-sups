import { supabase, temSupabase } from "../lib/supabase";
import { paraCentavos } from "../lib/pedido";

/**
 * Envio de pedido.
 *
 * O site manda os itens e o endereço; **não** manda o total. Quem soma é a
 * função `criar_pedido` no banco, lendo o preço real de cada produto. Total
 * calculado no navegador é total que o cliente consegue adulterar.
 */
export async function criarPedido(dados, itens) {
  const payload = {
    cliente_nome: dados.nome.trim(),
    cliente_telefone: dados.telefone,
    cliente_email: dados.email?.trim() || null,
    cep: dados.cep,
    rua: dados.rua.trim(),
    numero_endereco: dados.numero.trim(),
    complemento: dados.complemento?.trim() || null,
    bairro: dados.bairro.trim(),
    cidade: dados.cidade,
    referencia: dados.referencia?.trim() || null,
    forma_pagamento: dados.forma,
    precisa_troco: dados.forma === "dinheiro" && dados.precisaTroco,
    troco_para_centavos:
      dados.forma === "dinheiro" && dados.precisaTroco ? paraCentavos(dados.trocoPara) : null,
    observacao: dados.observacao?.trim() || null,
    itens: itens.map((i) => ({
      produto_slug: i.slug,
      variante_rotulo: i.variante?.rotulo ?? null,
      quantidade: i.quantidade,
    })),
  };

  // Sem banco configurado o checkout continua demonstrável, com número falso.
  if (!temSupabase) {
    await new Promise((r) => setTimeout(r, 400));
    return { numero: "LOCAL-0000", simulado: true };
  }

  const { data, error } = await supabase.rpc("criar_pedido", { dados: payload });

  if (error) {
    // A função usa `raise exception` com texto legível para regra de negócio
    // (cidade fora da área, produto esgotado). Repassar isso ajuda o cliente.
    throw new Error(error.message || "Não foi possível registrar o pedido.");
  }

  return data;
}
