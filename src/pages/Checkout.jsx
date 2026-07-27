import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, MessageCircle, ShoppingCart } from "lucide-react";
import PassoIndicador from "../components/checkout/PassoIndicador";
import ResumoPedido from "../components/checkout/ResumoPedido";
import EtapaIdentificacao from "../components/checkout/EtapaIdentificacao";
import EtapaEntrega from "../components/checkout/EtapaEntrega";
import EtapaPagamento from "../components/checkout/EtapaPagamento";
import EtapaRevisao from "../components/checkout/EtapaRevisao";
import { useCarrinho } from "../context/CarrinhoContext";
import { useTitulo } from "../hooks/useTitulo";
import { criarPedido } from "../services/pedidos";
import { linkWhatsAppPedido, montarMensagemPedido } from "../lib/mensagemPedido";
import { brl } from "../lib/formato";
import {
  calcularTotais,
  validarEntrega,
  validarIdentificacao,
  validarPagamento,
} from "../lib/pedido";

const PASSOS = ["Identificação", "Entrega", "Pagamento", "Revisão"];
const CHAVE_RASCUNHO = "rapidao:checkout:v1";

const VAZIO = {
  nome: "",
  telefone: "",
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  referencia: "",
  forma: "pix",
  precisaTroco: false,
  trocoPara: "",
  observacao: "",
};

/** Rascunho salvo: ninguém quer redigitar o endereço porque atualizou a página. */
function rascunhoInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE_RASCUNHO);
    return salvo ? { ...VAZIO, ...JSON.parse(salvo) } : VAZIO;
  } catch {
    return VAZIO;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const { itens, subtotal, limpar } = useCarrinho();
  useTitulo("Checkout");

  const [passo, setPasso] = useState(0);
  const [dados, setDados] = useState(rascunhoInicial);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [falha, setFalha] = useState(null);
  const [pedido, setPedido] = useState(null);
  const topo = useRef(null);

  const totais = calcularTotais(subtotal, dados.forma);
  const { total } = totais;

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(dados));
    } catch {
      // Modo privado: o formulário segue funcionando sem rascunho.
    }
  }, [dados]);

  // Ao trocar de etapa, leva o foco para o topo — no celular a pessoa ficaria
  // olhando o meio do formulário sem perceber que a etapa mudou.
  useEffect(() => {
    topo.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [passo]);

  function mudar(campo, valor) {
    setDados((d) => ({ ...d, [campo]: valor }));
    setErros((e) => (e[campo] ? { ...e, [campo]: undefined } : e));
  }

  function validarPassoAtual() {
    if (passo === 0) return validarIdentificacao(dados);
    if (passo === 1) return validarEntrega(dados);
    if (passo === 2) return validarPagamento(dados, total);
    return {};
  }

  function avancar() {
    const achados = validarPassoAtual();
    const temErro = Object.values(achados).some(Boolean);

    if (temErro) {
      setErros(achados);
      return;
    }

    setErros({});
    if (passo < PASSOS.length - 1) setPasso(passo + 1);
    else finalizar();
  }

  async function finalizar() {
    setEnviando(true);
    setFalha(null);

    try {
      const resultado = await criarPedido(dados, itens);

      // A mensagem é montada ANTES de limpar o carrinho — depois os itens somem.
      const mensagem = montarMensagemPedido({
        numero: resultado.numero,
        dados,
        itens,
        totais,
      });

      setPedido({ ...resultado, mensagem, link: linkWhatsAppPedido(mensagem) });
      limpar();
      // O rascunho some junto: manter endereço salvo depois do pedido feito
      // faria o próximo checkout começar com dados possivelmente velhos.
      try {
        localStorage.removeItem(CHAVE_RASCUNHO);
      } catch {
        /* storage indisponível: nada a limpar */
      }
    } catch (e) {
      setFalha(e.message);
    } finally {
      setEnviando(false);
    }
  }

  /* ------------------------------ estados de saída ------------------------------ */

  if (pedido) {
    return (
      <div className="container-site flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-zap">
          <Check size={32} strokeWidth={3} className="text-white" />
        </div>

        <h1 className="titulo-secao">Pedido recebido</h1>

        <p className="rounded-lg border border-amarelo bg-amarelo/10 px-5 py-2.5 text-lg font-black tracking-wider text-amarelo">
          {pedido.numero}
        </p>

        <p className="max-w-md text-sm text-texto-suave">
          Falta um passo, {dados.nome.split(" ")[0]}: envie o pedido pra loja no WhatsApp. A
          mensagem já vai pronta.
        </p>

        {pedido.total_centavos && (
          <p className="text-sm">
            Total: <strong className="text-amarelo">{brl(pedido.total_centavos)}</strong>
          </p>
        )}

        {pedido.link ? (
          <a
            href={pedido.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-zap px-8 py-4 text-base font-extrabold text-white transition-colors hover:bg-zap-escuro"
          >
            <MessageCircle size={20} />
            Enviar pedido no WhatsApp
          </a>
        ) : (
          <div className="w-full max-w-md">
            <p className="mb-2 rounded-lg border border-borda bg-grafite-card px-4 py-3 text-xs text-texto-fraco">
              WhatsApp desativado no ambiente de teste. Esta é a mensagem que seria enviada:
            </p>
            <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-lg border border-borda bg-preto-fundo p-3 text-left text-[11px] leading-relaxed text-neutral-300">
              {pedido.mensagem}
            </pre>
          </div>
        )}

        {pedido.simulado && (
          <p className="max-w-md text-xs text-texto-fraco">
            Banco não configurado: número de exemplo, pedido não gravado.
          </p>
        )}

        <Link to="/produtos" className="mt-2 text-sm font-bold text-amarelo hover:underline">
          Voltar às compras
        </Link>
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div className="container-site flex flex-col items-center gap-4 py-20 text-center">
        <ShoppingCart size={56} className="text-neutral-700" />
        <h1 className="titulo-secao">Carrinho vazio</h1>
        <p className="max-w-sm text-sm text-texto-suave">
          Não dá pra fechar pedido sem produto. Escolha seus suplementos primeiro.
        </p>
        <Link to="/produtos" className="btn-primario mt-2">
          Ver produtos
        </Link>
      </div>
    );
  }

  /* --------------------------------- formulário -------------------------------- */

  const ultimo = passo === PASSOS.length - 1;

  return (
    <div className="container-site py-8" ref={topo}>
      <button
        type="button"
        onClick={() => (passo === 0 ? navigate("/carrinho") : setPasso(passo - 1))}
        className="mb-4 flex items-center gap-1.5 text-sm font-bold text-neutral-400 hover:text-amarelo"
      >
        <ArrowLeft size={16} />
        {passo === 0 ? "Voltar ao carrinho" : "Etapa anterior"}
      </button>

      <h1 className="titulo-secao mb-6">Finalizar pedido</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <PassoIndicador passos={PASSOS} atual={passo} aoVoltarPara={setPasso} />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              avancar();
            }}
            noValidate
          >
            {passo === 0 && <EtapaIdentificacao dados={dados} aoMudar={mudar} erros={erros} />}
            {passo === 1 && <EtapaEntrega dados={dados} aoMudar={mudar} erros={erros} />}
            {passo === 2 && (
              <EtapaPagamento dados={dados} aoMudar={mudar} erros={erros} total={total} />
            )}
            {passo === 3 && <EtapaRevisao dados={dados} aoVoltarPara={setPasso} />}

            {falha && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-alerta bg-alerta/10 px-4 py-3 text-sm font-semibold text-alerta"
              >
                {falha}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="btn-primario mt-6 w-full py-3.5 disabled:cursor-wait disabled:bg-neutral-700 disabled:text-neutral-400"
            >
              {enviando
                ? "Enviando..."
                : ultimo
                  ? `Confirmar pedido · ${brl(total)}`
                  : "Continuar"}
            </button>
          </form>
        </div>

        <ResumoPedido itens={itens} subtotal={subtotal} forma={dados.forma} />
      </div>
    </div>
  );
}
