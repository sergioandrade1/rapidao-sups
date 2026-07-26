import { useState } from "react";
import { Zap } from "lucide-react";

/**
 * Foto do produto com fallback.
 *
 * Nem todo produto tem imagem, e o CDN externo pode falhar — nos dois casos cai
 * no placeholder do raio, para o card nunca aparecer quebrado.
 */
export default function ImagemProduto({ produto, tamanhoPlaceholder = 40, className = "" }) {
  const [falhou, setFalhou] = useState(false);
  const src = produto.imagens?.[0];

  if (!src || falhou) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border-2 border-amarelo bg-grafite ${className}`}
      >
        <Zap size={tamanhoPlaceholder} className="fill-amarelo text-amarelo" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={produto.nome}
      loading="lazy"
      onError={() => setFalhou(true)}
      className={`object-contain ${className}`}
    />
  );
}
