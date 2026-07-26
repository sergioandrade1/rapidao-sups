import { LOJA } from "../../lib/loja";

const MENSAGEM = "Olá! Vim pelo site e quero fazer um pedido.";

export default function BotaoWhatsApp() {
  return (
    <a
      href={`https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(MENSAGEM)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-100 flex size-14 items-center justify-center rounded-full bg-zap shadow-[0_4px_16px_rgba(37,211,102,.5)] transition-colors hover:bg-zap-escuro"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5C9.6 8.5 9 7.1 8.8 6.5c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 .9-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
        <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.4 15.4 4 13.7 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z" />
      </svg>
    </a>
  );
}
