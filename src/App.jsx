import { RouterProvider } from "react-router-dom";
import { CarrinhoProvider } from "./context/CarrinhoContext";
import { router } from "./routes";

export default function App() {
  return (
    <CarrinhoProvider>
      <RouterProvider router={router} />
    </CarrinhoProvider>
  );
}
