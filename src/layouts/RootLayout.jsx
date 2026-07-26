import { Outlet, ScrollRestoration } from "react-router-dom";
import FaixaTopo from "../components/layout/FaixaTopo";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import BotaoWhatsApp from "../components/layout/BotaoWhatsApp";
import AvisoAdicionado from "../components/carrinho/AvisoAdicionado";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <FaixaTopo />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BotaoWhatsApp />
      <AvisoAdicionado />
      <ScrollRestoration />
    </div>
  );
}
