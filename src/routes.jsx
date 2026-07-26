import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Produto from "./pages/Produto";
import Carrinho from "./pages/Carrinho";
import Checkout from "./pages/Checkout";
import AreaAtuacao from "./pages/AreaAtuacao";
import NaoEncontrada from "./pages/NaoEncontrada";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NaoEncontrada />,
    children: [
      { index: true, element: <Home /> },
      { path: "produtos", element: <Catalogo /> },
      { path: "c/:categoria", element: <Catalogo /> },
      { path: "v/:vitrine", element: <Catalogo /> },
      { path: "busca", element: <Catalogo /> },
      { path: "p/:slug", element: <Produto /> },
      { path: "carrinho", element: <Carrinho /> },
      { path: "checkout", element: <Checkout /> },
      { path: "area-de-atuacao", element: <AreaAtuacao /> },
      { path: "*", element: <NaoEncontrada /> },
    ],
  },
]);
