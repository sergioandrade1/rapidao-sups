import { createClient } from "@supabase/supabase-js";

/**
 * Cliente do Supabase.
 *
 * A chave `anon` é pública por natureza — ela vai no bundle e qualquer pessoa
 * consegue lê-la no navegador. Quem protege os dados é a RLS no banco, não o
 * segredo da chave. A `service_role` NUNCA pode aparecer aqui.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Sem credenciais o site cai no catálogo local em vez de quebrar. */
export const temSupabase = Boolean(url && chave);

export const supabase = temSupabase ? createClient(url, chave) : null;
