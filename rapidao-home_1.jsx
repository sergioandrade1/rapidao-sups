import React, { useState } from "react";
import { ShoppingCart, Search, User, Zap, Menu, X, Truck, Clock, ShieldCheck, MapPin, Star, Plus } from "lucide-react";

const AMARELO = "#FFC800";
const AMARELO_ESCURO = "#E5A800";
const GRAFITE = "#141414";
const GRAFITE_CARD = "#1E1E1E";

const categorias = [
  { nome: "Whey Protein", emoji: "💪" },
  { nome: "Creatina", emoji: "⚡" },
  { nome: "Pré-treino", emoji: "🔥" },
  { nome: "Emagrecedores", emoji: "🏃" },
  { nome: "Vitaminas", emoji: "🌿" },
  { nome: "Acessórios", emoji: "🎽" },
];

const produtos = [
  { nome: "Whey Isolado ISO SIZE 900g", marca: "Synthesize", preco: 149.9, pix: 109.99, desc: 27, tag: "MAIS VENDIDO" },
  { nome: "Creatina Monohidratada 300g", marca: "Growth", preco: 89.9, pix: 69.9, desc: 22, tag: null },
  { nome: "Pré-treino Insane 300g", marca: "Dark Lab", preco: 119.9, pix: 94.9, desc: 21, tag: "FRETE GRÁTIS" },
  { nome: "Proteína uêvo 480g", marca: "uêvo", preco: 79.9, pix: 59.9, desc: 25, tag: "NOVIDADE" },
  { nome: "Whey Concentrado 1kg", marca: "Max Titanium", preco: 139.9, pix: 104.9, desc: 25, tag: null },
  { nome: "BCAA 2:1:1 120 caps", marca: "Integralmédica", preco: 59.9, pix: 44.9, desc: 25, tag: null },
];

function Badge({ children, cor = AMARELO, texto = "#000" }) {
  return (
    <span style={{ background: cor, color: texto, fontWeight: 800, fontSize: 10, letterSpacing: 0.5, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

function CardProduto({ p, onAdd }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: GRAFITE_CARD,
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${hover ? AMARELO : "#2A2A2A"}`,
        transition: "all .2s ease",
        transform: hover ? "translateY(-4px)" : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative", height: 180, background: "linear-gradient(135deg,#242424,#161616)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {p.tag && <div style={{ position: "absolute", top: 10, left: 10 }}><Badge cor={p.tag === "FRETE GRÁTIS" ? "#25D366" : AMARELO} texto={p.tag === "FRETE GRÁTIS" ? "#fff" : "#000"}>{p.tag}</Badge></div>}
        <div style={{ position: "absolute", top: 10, right: 10 }}><Badge cor="#FF3B3B" texto="#fff">-{p.desc}%</Badge></div>
        <div style={{ width: 90, height: 120, background: "#0d0d0d", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${AMARELO}`, boxShadow: hover ? `0 0 24px ${AMARELO}44` : "none", transition: "all .2s" }}>
          <Zap size={40} color={AMARELO} fill={AMARELO} />
        </div>
      </div>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <span style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>{p.marca}</span>
        <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: 0, lineHeight: 1.3, minHeight: 36 }}>{p.nome}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 2, marginTop: 2 }}>
          {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} color={AMARELO} fill={AMARELO} />)}
          <span style={{ color: "#666", fontSize: 11, marginLeft: 4 }}>(48)</span>
        </div>
        <div style={{ marginTop: "auto", paddingTop: 8 }}>
          <span style={{ color: "#666", fontSize: 12, textDecoration: "line-through" }}>R$ {p.preco.toFixed(2)}</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ color: AMARELO, fontSize: 24, fontWeight: 900, fontFamily: "'Arial Black',sans-serif" }}>R$ {p.pix.toFixed(2)}</span>
            <span style={{ color: "#25D366", fontSize: 11, fontWeight: 800 }}>no PIX</span>
          </div>
        </div>
        <button
          onClick={onAdd}
          style={{
            marginTop: 8, background: AMARELO, color: "#000", border: "none", borderRadius: 8,
            padding: "10px", fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", gap: 6, textTransform: "uppercase",
            letterSpacing: 0.3, transition: "background .2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = AMARELO_ESCURO)}
          onMouseLeave={(e) => (e.currentTarget.style.background = AMARELO)}
        >
          <Plus size={16} strokeWidth={3} /> Adicionar
        </button>
      </div>
    </div>
  );
}

export default function RapidaoHome() {
  const [cart, setCart] = useState(0);
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div style={{ background: GRAFITE, minHeight: "100vh", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#fff" }}>
      {/* Faixa topo */}
      <div style={{ background: AMARELO, color: "#000", textAlign: "center", padding: "7px 12px", fontSize: 12.5, fontWeight: 800, letterSpacing: 0.3 }}>
        <Zap size={13} fill="#000" style={{ verticalAlign: "middle", marginRight: 4 }} />
        PEDIDO ATÉ 18H30 = ENTREGA NO MESMO DIA · FRETE GRÁTIS ACIMA DE R$ 89,99
      </div>

      {/* Header */}
      <header style={{ background: "#0d0d0d", borderBottom: "1px solid #222", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={() => setMenuAberto(!menuAberto)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex" }} className="mobile-menu-btn">
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#333,#111)", border: `2px solid ${AMARELO}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <span style={{ color: AMARELO, fontWeight: 900, fontSize: 18, fontStyle: "italic" }}>RS</span>
              <Zap size={12} color={AMARELO} fill={AMARELO} style={{ position: "absolute", top: 2, right: 4 }} />
            </div>
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 17, fontStyle: "italic", letterSpacing: -0.5 }}>RAPIDÃO</div>
              <div style={{ fontSize: 10, color: AMARELO, fontWeight: 700, letterSpacing: 2 }}>SUPLEMENTOS</div>
            </div>
          </div>

          <div style={{ flex: 1, maxWidth: 480, position: "relative" }} className="search-box">
            <input
              placeholder="Buscar whey, creatina, pré-treino..."
              style={{ width: "100%", background: "#1c1c1c", border: "1px solid #2e2e2e", borderRadius: 8, padding: "11px 44px 11px 16px", color: "#fff", fontSize: 14, outline: "none" }}
            />
            <Search size={18} color={AMARELO} style={{ position: "absolute", right: 14, top: 12 }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, marginLeft: "auto" }}>
            <button style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontSize: 10 }} className="account-btn">
              <User size={22} /> Conta
            </button>
            <button style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontSize: 10 }}>
              <div style={{ position: "relative" }}>
                <ShoppingCart size={22} />
                {cart > 0 && (
                  <span style={{ position: "absolute", top: -8, right: -10, background: AMARELO, color: "#000", borderRadius: "50%", width: 18, height: 18, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{cart}</span>
                )}
              </div>
              Carrinho
            </button>
          </div>
        </div>

        {/* Nav categorias */}
        <nav style={{ borderTop: "1px solid #1c1c1c", background: "#0a0a0a" }} className="cat-nav">
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", gap: 4, overflowX: "auto" }}>
            {categorias.map((c) => (
              <button key={c.nome} style={{ background: "none", border: "none", color: "#ccc", padding: "12px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", borderBottom: "2px solid transparent", transition: "all .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = AMARELO; e.currentTarget.style.borderBottomColor = AMARELO; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#ccc"; e.currentTarget.style.borderBottomColor = "transparent"; }}>
                {c.nome}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", background: "radial-gradient(circle at 70% 40%, #2a2400 0%, #0d0d0d 60%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 380px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#1c1c1c", border: `1px solid ${AMARELO}`, borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>
              <Zap size={14} color={AMARELO} fill={AMARELO} />
              <span style={{ fontSize: 12, fontWeight: 700, color: AMARELO }}>DELIVERY DE SUPLEMENTOS · RECIFE E REGIÃO</span>
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 0.95, margin: 0, fontStyle: "italic", letterSpacing: -1.5 }}>
              COMPROU ATÉ<br /><span style={{ color: AMARELO }}>ÀS 18H?</span><br />RECEBE HOJE.
            </h1>
            <p style={{ color: "#aaa", fontSize: 16, marginTop: 18, maxWidth: 420, lineHeight: 1.5 }}>
              Suplementos <strong style={{ color: "#fff" }}>100% originais</strong> com a entrega mais rápida da região. Do carrinho pra sua casa no mesmo dia.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
              <button style={{ background: AMARELO, color: "#000", border: "none", borderRadius: 8, padding: "15px 32px", fontWeight: 900, fontSize: 15, cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Comprar agora
              </button>
              <button style={{ background: "transparent", color: "#fff", border: "1px solid #444", borderRadius: 8, padding: "15px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                Ver ofertas 🔥
              </button>
            </div>
          </div>
          <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 280, height: 280, borderRadius: "50%", background: `conic-gradient(${AMARELO},#ff6b00,${AMARELO})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${AMARELO}33` }}>
              <div style={{ width: 250, height: 250, borderRadius: "50%", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Zap size={70} color={AMARELO} fill={AMARELO} />
                <span style={{ fontSize: 40, fontWeight: 900, fontStyle: "italic", color: "#fff" }}>18H</span>
                <span style={{ fontSize: 13, color: AMARELO, fontWeight: 800, letterSpacing: 1 }}>ENTREGA HOJE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faixa benefícios */}
      <section style={{ background: "#0a0a0a", borderTop: "1px solid #1c1c1c", borderBottom: "1px solid #1c1c1c" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
          {[
            { icon: <Clock size={26} color={AMARELO} />, t: "Entrega no mesmo dia", s: "Pedidos até 18h30" },
            { icon: <Truck size={26} color={AMARELO} />, t: "Frete grátis", s: "Acima de R$ 89,99" },
            { icon: <ShieldCheck size={26} color={AMARELO} />, t: "100% originais", s: "Direto da fábrica" },
            { icon: <MapPin size={26} color={AMARELO} />, t: "Recife e região", s: "Olinda, Paulista, Jaboatão..." },
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "#1c1c1c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{b.icon}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{b.t}</div>
                <div style={{ color: "#888", fontSize: 12 }}>{b.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 20px 20px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, fontStyle: "italic", margin: "0 0 20px", textTransform: "uppercase", letterSpacing: -0.5 }}>
          Categorias <span style={{ color: AMARELO }}>/</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14 }}>
          {categorias.map((c) => (
            <div key={c.nome} style={{ background: GRAFITE_CARD, border: "1px solid #262626", borderRadius: 12, padding: "24px 12px", textAlign: "center", cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = AMARELO; e.currentTarget.style.background = "#242424"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#262626"; e.currentTarget.style.background = GRAFITE_CARD; }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{c.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{c.nome}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Produtos */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, fontStyle: "italic", margin: 0, textTransform: "uppercase", letterSpacing: -0.5 }}>
            Mais vendidos <span style={{ color: AMARELO }}>🔥</span>
          </h2>
          <button style={{ background: "none", border: "none", color: AMARELO, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Ver todos →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 18 }}>
          {produtos.map((p, i) => <CardProduto key={i} p={p} onAdd={() => setCart(cart + 1)} />)}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0a0a0a", borderTop: `3px solid ${AMARELO}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Zap size={22} color={AMARELO} fill={AMARELO} />
              <span style={{ fontWeight: 900, fontStyle: "italic", fontSize: 18 }}>RAPIDÃO SUPLEMENTOS</span>
            </div>
            <p style={{ color: "#888", fontSize: 13, lineHeight: 1.6, margin: 0 }}>Delivery de suplementos originais com entrega rápida em Recife e região metropolitana.</p>
          </div>
          <div>
            <h4 style={{ color: AMARELO, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Institucional</h4>
            {["Sobre nós", "Área de atuação", "Trocas e devoluções", "Política de privacidade"].map((l) => (
              <div key={l} style={{ color: "#aaa", fontSize: 13, padding: "5px 0", cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <h4 style={{ color: AMARELO, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Atendimento</h4>
            {["Seg a Sex: 9h às 18h", "Sábado: 9h às 15h", "WhatsApp: (81) 9xxxx-xxxx"].map((l) => (
              <div key={l} style={{ color: "#aaa", fontSize: 13, padding: "5px 0" }}>{l}</div>
            ))}
          </div>
          <div>
            <h4 style={{ color: AMARELO, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Pagamento</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["PIX", "VISA", "MASTER", "ELO", "BOLETO"].map((p) => (
                <span key={p} style={{ background: "#1c1c1c", border: "1px solid #2e2e2e", borderRadius: 5, padding: "5px 9px", fontSize: 10, fontWeight: 700, color: "#ccc" }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1c1c1c", padding: "16px 20px", textAlign: "center", color: "#666", fontSize: 12 }}>
          © 2026 Rapidão Suplementos · CEP 52020-020 · Feito com ⚡ em Recife-PE
        </div>
      </footer>

      {/* WhatsApp flutuante */}
      <button style={{ position: "fixed", bottom: 24, right: 24, width: 58, height: 58, borderRadius: "50%", background: "#25D366", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(37,211,102,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5C9.6 8.5 9 7.1 8.8 6.5c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 .9-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.4 15.4 4 13.7 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z"/></svg>
      </button>

      <style>{`
        @media (max-width: 768px) {
          .search-box { display: none !important; }
          .account-btn { display: none !important; }
          .cat-nav { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
