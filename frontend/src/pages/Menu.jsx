import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TX } from "../design/tokens";
import { Ico, StripedPlaceholder, Dots, pesos, catTone } from "../design/helpers";
import { getMenu, crearPedido } from "../api";
import { useMediaQuery } from "../hooks/useMediaQuery";

// ─── Product modal ────────────────────────────────────────────────────────────
function ProductModal({ producto, onClose, onAgregar }) {
  const mods = producto.modificadores || [];
  const [seleccionadas, setSeleccionadas] = useState([]);
  const toggleMod = (mod) => setSeleccionadas((prev) =>
    prev.find((m) => m.nombre === mod.nombre) ? prev.filter((m) => m.nombre !== mod.nombre) : [...prev, mod]
  );
  const precioFinal = producto.precio + seleccionadas.reduce((s, m) => s + m.precio, 0);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 520, background: TX.bg, color: TX.ink,
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        display: "flex", flexDirection: "column", maxHeight: "88vh", overflow: "hidden",
        animation: "slideUp .25s ease-out",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: TX.line }} />
        </div>
        <div style={{ padding: "0 22px 10px" }}>
          <div style={{ width: "100%", height: 110, borderRadius: 8, overflow: "hidden", marginBottom: 12, border: `1px solid ${TX.line}` }}>
            {producto.imagen
              ? <img src={producto.imagen} alt={producto.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <StripedPlaceholder tone={catTone(producto.categoria)} stripe="rgba(244,235,217,0.10)" label={producto.categoria} />
            }
          </div>
          <div style={{ fontFamily: TX.serif, fontSize: 24, fontWeight: 500 }}>{producto.nombre}</div>
          {producto.descripcion && <div style={{ fontFamily: TX.serif, fontStyle: "italic", fontSize: 12, color: TX.ink2, marginTop: 2 }}>{producto.descripcion}</div>}
        </div>
        {mods.length > 0 && (
          <div style={{ flex: 1, overflowY: "auto", padding: "0 22px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily: TX.serif, fontStyle: "italic", fontSize: 13, color: TX.accent2 }}>Adiciones opcionales</span>
              <div style={{ flex: 1, height: 1, background: TX.line }} />
            </div>
            {mods.map((mod) => {
              const activo = seleccionadas.some((m) => m.nombre === mod.nombre);
              return (
                <button key={mod.nombre} onClick={() => toggleMod(mod)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "10px 0", display: "flex", alignItems: "center", gap: 10, color: TX.ink, textAlign: "left", width: "100%" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, border: `1.5px solid ${activo ? TX.accent : TX.line}`, background: activo ? TX.accent : "transparent", display: "grid", placeItems: "center" }}>
                    {activo && <div style={{ width: 10, height: 10, background: TX.bg, borderRadius: 1 }} />}
                  </div>
                  <span style={{ flex: 1, fontFamily: TX.serif, fontSize: 14 }}>{mod.nombre}</span>
                  {mod.precio > 0 && <span style={{ fontFamily: TX.mono, fontSize: 11, color: TX.accent2 }}>+{pesos(mod.precio)}</span>}
                </button>
              );
            })}
          </div>
        )}
        <div style={{ padding: "12px 22px 22px", borderTop: `1px solid ${TX.line}`, background: TX.bg2 }}>
          <button onClick={() => { onAgregar(producto, seleccionadas); onClose(); }} style={{ width: "100%", padding: "14px 16px", background: TX.accent, color: TX.bg, border: "none", borderRadius: 8, fontFamily: TX.sans, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Añadir al pedido</span>
            <span style={{ fontFamily: TX.serif, fontStyle: "italic", fontSize: 16 }}>{pesos(precioFinal)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Confirmación ─────────────────────────────────────────────────────────────
function OrderConfirm({ total, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 60, display: "grid", placeItems: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: TX.bg, color: TX.ink, padding: "28px 26px", border: `1px solid ${TX.line}`, maxWidth: 320, width: "100%", animation: "fadeIn .25s ease-out", textAlign: "center", clipPath: "polygon(0 0, 100% 0, 100% 96%, 96% 100%, 0 100%)" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#25D366", margin: "0 auto 14px", display: "grid", placeItems: "center" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={TX.bg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12 10 17 19 7" /></svg>
        </div>
        <div style={{ fontFamily: TX.serif, fontSize: 22, fontWeight: 500 }}>Pedido <span style={{ fontStyle: "italic", color: TX.accent }}>confirmado</span></div>
        <div style={{ fontFamily: TX.serif, fontStyle: "italic", fontSize: 15, color: TX.accent2, marginTop: 8 }}>{pesos(total)}</div>
        <div style={{ fontFamily: TX.serif, fontStyle: "italic", fontSize: 12, color: TX.ink2, marginTop: 12, lineHeight: 1.5 }}>WhatsApp abierto. El negocio procesará tu pedido.</div>
        <button onClick={onClose} style={{ marginTop: 20, padding: "10px 22px", background: TX.ink, color: TX.bg, border: "none", fontFamily: TX.sans, fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em" }}>NUEVO PEDIDO</button>
      </div>
    </div>
  );
}

// ─── Cart drawer (mobile) ─────────────────────────────────────────────────────
function CartDrawer({ items, onQuitar, onCambiarCantidad, total, onClose, onConfirmar }) {
  const [form, setForm] = useState({ clienteNombre: "", telefono: "", direccion: "", nota: "" });
  const ch = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 520, maxHeight: "92vh", background: TX.bg, color: TX.ink, borderTopLeftRadius: 20, borderTopRightRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden", animation: "slideUp .25s ease-out" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: TX.line }} />
        </div>
        <div style={{ padding: "0 22px 12px", borderBottom: `1px solid ${TX.line}`, textAlign: "center" }}>
          <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.2em", color: TX.muted, textTransform: "uppercase" }}>Tu pedido</div>
          <div style={{ fontFamily: TX.serif, fontSize: 28, fontWeight: 500, marginTop: 2 }}><span style={{ fontStyle: "italic", color: TX.accent }}>Resumen</span></div>
        </div>
        <CartItems items={items} onQuitar={onQuitar} onCambiarCantidad={onCambiarCantidad} total={total} form={form} ch={ch} />
        <div style={{ padding: "12px 22px 22px", borderTop: `1px solid ${TX.line}`, background: TX.bg2 }}>
          <button onClick={() => form.clienteNombre && onConfirmar(form)} disabled={!form.clienteNombre} style={{ width: "100%", padding: "14px", background: form.clienteNombre ? "#25D366" : TX.surface2, color: form.clienteNombre ? "#fff" : TX.muted, border: "none", borderRadius: 8, fontFamily: TX.sans, fontSize: 14, fontWeight: 600, cursor: form.clienteNombre ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {Ico.whatsapp(16, "currentColor")} Enviar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart items compartido ────────────────────────────────────────────────────
function CartItems({ items, onQuitar, onCambiarCantidad, total, form, ch }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "14px 22px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.length === 0 && <div style={{ padding: "30px 0", color: TX.muted, fontFamily: TX.serif, fontStyle: "italic", fontSize: 13, textAlign: "center" }}>· vacío ·</div>}
        {items.map((c, i) => {
          const extra = (c.adicionesSeleccionadas || []).reduce((s, a) => s + a.precio, 0);
          return (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontFamily: TX.serif, fontSize: 14, fontWeight: 500 }}>{c.nombre}</span>
                <Dots />
                <span style={{ fontFamily: TX.mono, fontSize: 11, color: TX.ink2 }}>{pesos((c.precio + extra) * c.cantidad)}</span>
              </div>
              {c.adicionesSeleccionadas?.length > 0 && (
                <div style={{ paddingLeft: 4, marginTop: 2 }}>
                  {c.adicionesSeleccionadas.map((a, j) => (
                    <div key={j} style={{ display: "flex", gap: 4, fontFamily: TX.mono, fontSize: 10, color: TX.muted }}>
                      <span>+</span><span>{a.nombre}</span>
                      {a.precio > 0 && <span style={{ color: TX.accent2 }}>{pesos(a.precio)}</span>}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                <button onClick={() => onCambiarCantidad(i, -1)} style={{ width: 24, height: 24, borderRadius: 6, background: TX.surface, color: TX.ink, border: `1px solid ${TX.line}`, cursor: "pointer", display: "grid", placeItems: "center" }}>{Ico.minus(11, TX.ink)}</button>
                <span style={{ fontFamily: TX.mono, fontSize: 13, minWidth: 18, textAlign: "center" }}>{c.cantidad}</span>
                <button onClick={() => onCambiarCantidad(i, 1)} style={{ width: 24, height: 24, borderRadius: 6, background: TX.surface, color: TX.ink, border: `1px solid ${TX.line}`, cursor: "pointer", display: "grid", placeItems: "center" }}>{Ico.plus(11, TX.ink)}</button>
                <button onClick={() => onQuitar(i)} style={{ marginLeft: "auto", background: "transparent", border: "none", cursor: "pointer", fontFamily: TX.serif, fontStyle: "italic", fontSize: 11, color: TX.muted }}>quitar</button>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px dashed ${TX.line}`, display: "flex", justifyContent: "space-between", fontFamily: TX.serif, fontSize: 20, fontWeight: 500 }}>
        <span>Total</span><span style={{ fontStyle: "italic", color: TX.accent }}>{pesos(total)}</span>
      </div>
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.16em", color: TX.muted, textTransform: "uppercase" }}>Tus datos</div>
        {[{ name: "clienteNombre", ph: "Nombre *" }, { name: "telefono", ph: "Teléfono" }, { name: "direccion", ph: "Dirección (opcional)" }].map(({ name, ph }) => (
          <input key={name} name={name} placeholder={ph} value={form[name]} onChange={ch}
            style={{ background: TX.surface, border: `1px solid ${TX.line}`, color: TX.ink, padding: "10px 12px", borderRadius: 6, fontFamily: TX.serif, fontSize: 14, outline: "none", width: "100%" }} />
        ))}
        <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.16em", color: TX.muted, textTransform: "uppercase", marginTop: 4 }}>Nota adicional</div>
        <textarea name="nota" rows={2} placeholder="Ej: sin cebolla, bien cocido…" value={form.nota} onChange={ch}
          style={{ width: "100%", background: TX.surface, border: `1px solid ${TX.line}`, color: TX.ink, padding: "10px 12px", borderRadius: 6, fontFamily: TX.serif, fontSize: 13, outline: "none", resize: "none" }} />
      </div>
    </div>
  );
}

// ─── Cart panel (desktop sidebar) ────────────────────────────────────────────
function CartPanel({ items, onQuitar, onCambiarCantidad, total, onConfirmar }) {
  const [form, setForm] = useState({ clienteNombre: "", telefono: "", direccion: "", nota: "" });
  const ch = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", borderLeft: `1px solid ${TX.line}` }}>
      <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${TX.line}` }}>
        <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.2em", color: TX.muted, textTransform: "uppercase" }}>Tu pedido</div>
        <div style={{ fontFamily: TX.serif, fontSize: 22, fontWeight: 500, marginTop: 2 }}>
          <span style={{ fontStyle: "italic", color: TX.accent }}>Resumen</span>
        </div>
      </div>
      <CartItems items={items} onQuitar={onQuitar} onCambiarCantidad={onCambiarCantidad} total={total} form={form} ch={ch} />
      <div style={{ padding: "12px 20px 20px", borderTop: `1px solid ${TX.line}`, background: TX.bg2 }}>
        <button onClick={() => form.clienteNombre && onConfirmar(form)} disabled={!form.clienteNombre} style={{ width: "100%", padding: "13px", background: form.clienteNombre ? "#25D366" : TX.surface2, color: form.clienteNombre ? "#fff" : TX.muted, border: "none", borderRadius: 8, fontFamily: TX.sans, fontSize: 13, fontWeight: 600, cursor: form.clienteNombre ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {Ico.whatsapp(16, "currentColor")} Enviar por WhatsApp
        </button>
      </div>
    </div>
  );
}

// ─── Menu screen ──────────────────────────────────────────────────────────────
function MenuScreen({ negocio, productos: productosRaw }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [cat, setCat] = useState("todos");
  const [search, setSearch] = useState("");
  const [openProducto, setOpenProducto] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [items, setItems] = useState([]);

  const categorias = ["todos", ...new Set(productosRaw.map((p) => p.categoria).filter(Boolean))];

  const agregar = (p, adicionesSeleccionadas = []) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === p.id && JSON.stringify(i.adicionesSeleccionadas) === JSON.stringify(adicionesSeleccionadas));
      if (idx >= 0) return prev.map((i, n) => n === idx ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { ...p, cantidad: 1, adicionesSeleccionadas }];
    });
  };

  const cambiarCantidad = (idx, delta) => setItems((prev) =>
    prev.map((i, n) => n === idx ? { ...i, cantidad: Math.max(0, i.cantidad + delta) } : i).filter((i) => i.cantidad > 0)
  );
  const quitar = (idx) => setItems((prev) => prev.filter((_, n) => n !== idx));

  const total = items.reduce((acc, i) => {
    const extra = (i.adicionesSeleccionadas || []).reduce((s, a) => s + a.precio, 0);
    return acc + (i.precio + extra) * i.cantidad;
  }, 0);
  const cartCount = items.reduce((acc, i) => acc + i.cantidad, 0);

  const confirmarPedido = async (form) => {
    try {
      await crearPedido({ clienteNombre: form.clienteNombre, telefono: form.telefono, direccion: form.direccion, nota: form.nota, negocioId: negocio.id, items: items.map((i) => ({ productoId: i.id, cantidad: i.cantidad, adiciones: i.adicionesSeleccionadas || [] })) });
    } catch (_) {}
    const lineas = items.map((i) => {
      const adds = (i.adicionesSeleccionadas || []).map((a) => a.nombre).join(", ");
      return `- ${i.cantidad}x ${i.nombre}${adds ? ` [${adds}]` : ""}`;
    }).join("%0A");
    const msg = ["Hola, quiero pedir:", lineas, "", `Nombre: ${form.clienteNombre}`, form.telefono && `Tel: ${form.telefono}`, form.direccion && `Dirección: ${form.direccion}`, form.nota && `Nota: ${form.nota}`].filter(Boolean).join("%0A");
    window.open(`https://wa.me/${negocio.telefono}?text=${msg}`, "_blank");
    setItems([]); setShowCart(false); setConfirm({ total });
  };

  const filtrados = productosRaw.filter((p) => p.disponible).filter((p) => cat === "todos" || p.categoria === cat).filter((p) => !search || p.nombre.toLowerCase().includes(search.toLowerCase()));

  const productList = (
    <div style={{ flex: 1, overflowY: "auto", padding: isDesktop ? "16px 28px" : "14px 22px", paddingBottom: !isDesktop && cartCount > 0 ? 110 : undefined }}>
      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(auto-fill, minmax(280px, 1fr))" : "1fr", gap: isDesktop ? 16 : 14 }}>
        {filtrados.length === 0 && <div style={{ padding: "30px 0", color: TX.muted, fontFamily: TX.serif, fontStyle: "italic", fontSize: 13, textAlign: "center", gridColumn: "1/-1" }}>· sin resultados ·</div>}
        {filtrados.map((p) => (
          <button key={p.id} onClick={() => setOpenProducto(p)} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: isDesktop ? TX.surface : "transparent", border: isDesktop ? `1px solid ${TX.line}` : "none", borderRadius: isDesktop ? 10 : 0, padding: isDesktop ? 12 : 0, borderBottom: !isDesktop ? `1px solid ${TX.lineSoft}` : "none", paddingBottom: !isDesktop ? 14 : undefined, cursor: "pointer", textAlign: "left", color: TX.ink }}>
            <div style={{ width: isDesktop ? 72 : 64, height: isDesktop ? 72 : 64, borderRadius: 6, flex: "0 0 auto", overflow: "hidden", border: `1px solid ${TX.line}` }}>
              {p.imagen ? <img src={p.imagen} alt={p.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <StripedPlaceholder tone={catTone(p.categoria)} stripe="rgba(244,235,217,0.10)" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontFamily: TX.serif, fontSize: 15, fontWeight: 500 }}>{p.nombre}</span>
                {p.modificadores?.length > 0 && <span style={{ fontFamily: TX.serif, fontStyle: "italic", fontSize: 10, color: TX.accent }}>· adiciones</span>}
                <Dots />
                <span style={{ fontFamily: TX.serif, fontSize: 14, fontWeight: 500, color: TX.accent2 }}>{pesos(p.precio)}</span>
              </div>
              {p.descripcion && <div style={{ fontSize: 11.5, color: TX.ink2, marginTop: 3, lineHeight: 1.4, fontFamily: TX.serif }}>{p.descripcion}</div>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: TX.bg, fontFamily: TX.sans, color: TX.ink, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: isDesktop ? "16px 28px 12px" : "12px 22px 10px", borderBottom: `1px solid ${TX.line}`, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.2em", color: TX.muted, textTransform: "uppercase" }}>menú digital</div>
          <div style={{ fontFamily: TX.serif, fontSize: isDesktop ? 32 : 28, lineHeight: 1, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 2 }}>
            <span style={{ fontStyle: "italic", color: TX.accent }}>{negocio.nombre}</span>
          </div>
        </div>
        {!isDesktop && cartCount > 0 && (
          <button onClick={() => setShowCart(true)} style={{ background: TX.accent, border: "none", borderRadius: 8, padding: "8px 14px", color: TX.bg, fontFamily: TX.sans, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            {Ico.bag(16, TX.bg)} {cartCount}
          </button>
        )}
      </div>

      {/* Search + categories */}
      <div style={{ borderBottom: `1px solid ${TX.line}`, flexShrink: 0 }}>
        <div style={{ padding: isDesktop ? "10px 28px" : "10px 22px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${TX.lineSoft}` }}>
          {Ico.search(14, TX.muted)}
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="buscar en el menú…"
            style={{ flex: 1, background: "transparent", border: "none", color: TX.ink, fontFamily: TX.serif, fontStyle: search ? "normal" : "italic", fontSize: 14, outline: "none", padding: 0 }} />
        </div>
        <div style={{ padding: isDesktop ? "8px 28px" : "8px 22px", display: "flex", gap: 14, overflowX: "auto" }}>
          {categorias.map((c) => {
            const active = c === cat;
            return (
              <button key={c} onClick={() => setCat(c)} style={{ flex: "0 0 auto", padding: "6px 0", position: "relative", background: "transparent", border: "none", cursor: "pointer", fontFamily: TX.serif, fontSize: 14, fontStyle: active ? "italic" : "normal", fontWeight: active ? 500 : 400, color: active ? TX.ink : TX.muted }}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
                {active && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: TX.accent }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {productList}

        {/* Desktop cart panel */}
        {isDesktop && (
          <div style={{ width: 320, flexShrink: 0 }}>
            <CartPanel items={items} onQuitar={quitar} onCambiarCantidad={cambiarCantidad} total={total} onConfirmar={confirmarPedido} />
          </div>
        )}

        {/* Mobile cart bar */}
        {!isDesktop && cartCount > 0 && (
          <div style={{ position: "absolute", bottom: 14, left: 14, right: 14 }}>
            <button onClick={() => setShowCart(true)} style={{ width: "100%", background: TX.ink, color: TX.bg, borderRadius: 4, display: "flex", alignItems: "stretch", overflow: "hidden", border: "none", cursor: "pointer", padding: 0, boxShadow: "0 8px 30px rgba(0,0,0,0.45)" }}>
              <div style={{ padding: "12px 16px", borderRight: "1px solid rgba(31,24,20,0.18)" }}>
                <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.16em", color: "rgba(31,24,20,0.55)" }}>CUENTA</div>
                <div style={{ fontFamily: TX.serif, fontSize: 17, fontStyle: "italic", color: TX.accent, marginTop: 1 }}>{pesos(total)}</div>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Ver pedido ({cartCount})</span>
                {Ico.chev(14, TX.bg)}
              </div>
            </button>
          </div>
        )}
      </div>

      {openProducto && <ProductModal producto={openProducto} onClose={() => setOpenProducto(null)} onAgregar={agregar} />}
      {!isDesktop && showCart && <CartDrawer items={items} onQuitar={quitar} onCambiarCantidad={cambiarCantidad} total={total} onClose={() => setShowCart(false)} onConfirmar={confirmarPedido} />}
      {confirm && <OrderConfirm total={confirm.total} onClose={() => setConfirm(null)} />}
    </div>
  );
}

export default function Menu() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => { getMenu(slug).then((r) => setData(r.data)); }, [slug]);

  if (!data) return (
    <div style={{ height: "100%", display: "grid", placeItems: "center", background: TX.bg, fontFamily: TX.serif, fontStyle: "italic", color: TX.muted, fontSize: 14 }}>
      cargando…
    </div>
  );

  return (
    <div style={{ height: "100%", background: TX.bg }}>
      <MenuScreen negocio={data.negocio} productos={data.productos} />
    </div>
  );
}
