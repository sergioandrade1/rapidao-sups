import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ShoppingCart } from "lucide-react";
import PassoIndicador from "../components/checkout/PassoIndicador";
import ResumoPedido from "../components/checkout/ResumoPedido";
import EtapaIdentificacao from "../components/checkout/EtapaIdentificacao";
import EtapaEntrega from "../components/checkout/EtapaEntrega";
import EtapaPagamento from "../components/checkout/EtapaPagamento";
import EtapaRevisao from "../components/checkout/EtapaRevisao";
import { useCarrinho } from "../context/CarrinhoContext";
import { useTitulo } from "../hooks/useTitulo";
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
  email: "",
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
  const [concluido, setConcluido] = useState(false);
  const topo = useRef(null);

  const { total } = calcularTotais(subtotal);

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

  function finalizar() {
    // Aqui entra o `insert` na tabela `pedidos` quando o backend existir.
    // Por ora o checkout é layout: confirma na tela e esvazia o carrinho.
    setConcluido(true);
    limpar();
  }

  /* ------------------------------ estados de saída ------------------------------ */

  if (concluido) {
    return (
      <div className="container-site flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-zap">
          <Check size={32} strokeWidth={3} className="text-white" />
        </div>
        <h1 className="titulo-secao">Pedido registrado</h1>
        <p className="max-w-md text-sm text-texto-suave">
          Obrigado, {dados.nome.split(" ")[0]}! Em breve a loja confirma tudo pelo WhatsApp{" "}
          {dados.telefone}.
        </p>
        <p className="max-w-md rounded-lg border border-borda bg-grafite-card px-4 py-3 text-xs text-texto-fraco">
          Esta tela ainda não envia o pedido de verdade — o registro no banco e o aviso à loja
          entram na próxima etapa do projeto.
        </p>
        <Link to="/produtos" className="btn-primario mt-2">
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

            <button type="submit" className="btn-primario mt-6 w-full py-3.5">
              {ultimo ? `Confirmar pedido · ${brl(total)}` : "Continuar"}
            </button>
          </form>
        </div>

        <ResumoPedido itens={itens} subtotal={subtotal} />
      </div>
    </div>
  );
}
