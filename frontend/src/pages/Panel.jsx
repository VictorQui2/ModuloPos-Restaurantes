import { useEffect, useState } from "react";
import axios from "axios";
import { TX } from "../design/tokens";
import { Ico, StripedPlaceholder, Dots, pesos, catTone } from "../design/helpers";
import { getPedidos, getDetallePedido, actualizarEstado, getMenu } from "../api";
import { useMediaQuery } from "../hooks/useMediaQuery";

const api = axios.create({ baseURL: "http://localhost:3000" });

const STATUS_DOT   = { pendiente: TX.accent, en_proceso: TX.accent2, entregado: TX.muted };
const STATUS_LABEL = { pendiente: "nuevo", en_proceso: "cocina", entregado: "entregado" };
const STATUS_FLOW  = { pendiente: "en_proceso", en_proceso: "entregado" };
const STATUS_BTN   = { pendiente: "INICIAR", en_proceso: "MARCAR LISTO" };

const inputStyle = {
  width: "100%", background: TX.surface, border: `1px solid ${TX.line}`, color: TX.ink,
  padding: "10px 12px", borderRadius: 6, fontFamily: TX.serif, fontSize: 14,
  outline: "none", boxSizing: "border-box",
};

// ─── Category combobox ───────────────────────────────────────────────────────
function CategoryCombobox({ value, onChange, opciones }) {
  const cats = opciones.filter((c) => c !== "todos");
  return (
    <div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Escribir o seleccionar…" style={inputStyle} />
      {cats.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
          {cats.map((cat) => (
            <button key={cat} onClick={() => onChange(cat)} style={{
              padding: "3px 12px", borderRadius: 20, border: `1px solid ${value === cat ? TX.accent : TX.line}`,
              background: value === cat ? TX.accent : "transparent", color: value === cat ? TX.bg : TX.ink2,
              fontFamily: TX.serif, fontStyle: "italic", fontSize: 11, cursor: "pointer",
            }}>{cat}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Additions manager ───────────────────────────────────────────────────────
function AdditionsManager({ adiciones, onChange }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  const agregar = () => {
    if (!nombre.trim()) return;
    onChange([...adiciones, { nombre: nombre.trim(), precio: Number(precio) || 0 }]);
    setNombre(""); setPrecio("");
  };

  return (
    <div>
      {adiciones.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
          {adiciones.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: TX.surface, border: `1px solid ${TX.line}`, borderRadius: 6 }}>
              <span style={{ flex: 1, fontFamily: TX.serif, fontSize: 13 }}>{a.nombre}</span>
              <span style={{ fontFamily: TX.mono, fontSize: 11, color: TX.accent2 }}>+{pesos(a.precio)}</span>
              <button onClick={() => onChange(adiciones.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: TX.muted, fontSize: 16, lineHeight: 1, padding: "0 4px" }}>×</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 6 }}>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} onKeyDown={(e) => e.key === "Enter" && agregar()}
          placeholder="Ej: Queso extra" style={{ ...inputStyle, flex: 2 }} />
        <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} onKeyDown={(e) => e.key === "Enter" && agregar()}
          placeholder="Precio" style={{ ...inputStyle, flex: 1 }} />
        <button onClick={agregar} style={{ padding: "0 12px", background: TX.surface2, border: `1px solid ${TX.line}`, borderRadius: 6, cursor: "pointer", color: TX.accent, display: "grid", placeItems: "center" }}>
          {Ico.plus(14, TX.accent)}
        </button>
      </div>
    </div>
  );
}

// ─── Product editor ──────────────────────────────────────────────────────────
function ProductEditor({ producto, onClose, onSave, onDelete, categoriaOptions, isDesktop }) {
  const [draft, setDraft] = useState({ ...producto });
  const [precioStr, setPrecioStr] = useState(String(producto.precio));
  const upd = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const handleSave = () => {
    const precio = parseFloat(precioStr);
    onSave(producto.id, { ...draft, precio: isNaN(precio) ? draft.precio : precio });
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.7)", zIndex: 50,
      display: "flex",
      alignItems: isDesktop ? "center" : "flex-end",
      justifyContent: "center",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: isDesktop ? 480 : "100%",
        background: TX.bg, color: TX.ink,
        borderRadius: isDesktop ? 16 : "20px 20px 0 0",
        animation: isDesktop ? "fadeIn .2s ease-out" : "slideUp .25s ease-out",
        display: "flex", flexDirection: "column",
        maxHeight: isDesktop ? "88vh" : "94vh",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: TX.line }} />
        </div>
        <div style={{ padding: "0 22px 12px", borderBottom: `1px solid ${TX.line}`, textAlign: "center" }}>
          <div style={{ fontFamily: TX.serif, fontSize: 22, fontWeight: 500 }}>
            <span style={{ fontStyle: "italic", color: TX.accent }}>Editar</span> producto
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.16em", color: TX.muted, textTransform: "uppercase" }}>Nombre</span>
            <input value={draft.nombre} onChange={(e) => upd({ nombre: e.target.value })} style={inputStyle} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.16em", color: TX.muted, textTransform: "uppercase" }}>Descripción</span>
            <textarea rows={2} value={draft.descripcion || ""} onChange={(e) => upd({ descripcion: e.target.value })} style={{ ...inputStyle, resize: "none" }} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.16em", color: TX.muted, textTransform: "uppercase" }}>Precio</span>
            <input
              type="text" inputMode="numeric" value={precioStr}
              onChange={(e) => setPrecioStr(e.target.value)}
              onBlur={() => { const n = parseFloat(precioStr); if (isNaN(n)) setPrecioStr(String(draft.precio)); }}
              style={inputStyle}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.16em", color: TX.muted, textTransform: "uppercase" }}>Categoría</span>
            <CategoryCombobox value={draft.categoria || ""} onChange={(v) => upd({ categoria: v })} opciones={categoriaOptions} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.16em", color: TX.muted, textTransform: "uppercase" }}>URL de imagen</span>
            <input value={draft.imagen || ""} onChange={(e) => upd({ imagen: e.target.value || null })} placeholder="https://…" style={inputStyle} />
          </label>
          {draft.imagen && (
            <img src={draft.imagen} alt="" style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 8, border: `1px solid ${TX.line}` }}
              onError={(e) => { e.currentTarget.style.display = "none"; }} />
          )}

          <div onClick={() => upd({ disponible: !draft.disponible })} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: TX.surface, border: `1px solid ${TX.line}`, borderRadius: 6, cursor: "pointer" }}>
            <div style={{ width: 38, height: 22, borderRadius: 11, padding: 2, background: draft.disponible ? TX.accent : TX.surface2, transition: "background .15s", flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: TX.bg, transform: draft.disponible ? "translateX(16px)" : "translateX(0)", transition: "transform .15s" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TX.serif, fontSize: 14 }}>Disponible</div>
              <div style={{ fontFamily: TX.serif, fontStyle: "italic", fontSize: 11, color: TX.muted }}>{draft.disponible ? "visible para clientes" : "oculto temporalmente"}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.16em", color: TX.muted, textTransform: "uppercase" }}>Adiciones opcionales</span>
            <AdditionsManager adiciones={draft.modificadores || []} onChange={(v) => upd({ modificadores: v })} />
          </div>
        </div>

        <div style={{ padding: "12px 22px 22px", borderTop: `1px solid ${TX.line}`, background: TX.bg2, display: "flex", gap: 8, borderRadius: isDesktop ? "0 0 16px 16px" : 0 }}>
          <button onClick={() => onDelete(producto.id)} style={{ padding: "12px 14px", background: "transparent", color: TX.muted, border: `1px solid ${TX.line}`, borderRadius: 6, cursor: "pointer", fontFamily: TX.sans, fontSize: 12 }}>Eliminar</button>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", background: "transparent", color: TX.ink, border: `1px solid ${TX.ink}`, borderRadius: 6, cursor: "pointer", fontFamily: TX.sans, fontSize: 12 }}>Cancelar</button>
          <button onClick={handleSave} style={{ flex: 1, padding: "12px", background: TX.accent, color: TX.bg, border: "none", borderRadius: 6, cursor: "pointer", fontFamily: TX.sans, fontSize: 12, fontWeight: 600 }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Nuevo producto modal ────────────────────────────────────────────────────
function NuevoProductoModal({ negocioId, onClose, onCreated, categoriaOptions, isDesktop }) {
  const [form, setForm] = useState({ nombre: "", precio: "", descripcion: "", categoria: "" });
  const ch = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async () => {
    if (!form.nombre || !form.precio) return;
    const { data } = await api.post("/productos", { ...form, precio: Number(form.precio), categoria: form.categoria || "general", negocioId });
    onCreated(data); onClose();
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.7)", zIndex: 50,
      display: "flex",
      alignItems: isDesktop ? "center" : "flex-end",
      justifyContent: "center",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: isDesktop ? 480 : "100%",
        background: TX.bg, color: TX.ink,
        borderRadius: isDesktop ? 16 : "20px 20px 0 0",
        animation: isDesktop ? "fadeIn .2s ease-out" : "slideUp .25s ease-out",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: TX.line }} />
        </div>
        <div style={{ padding: "0 22px 12px", borderBottom: `1px solid ${TX.line}`, textAlign: "center" }}>
          <div style={{ fontFamily: TX.serif, fontSize: 22, fontWeight: 500 }}>Nuevo <span style={{ fontStyle: "italic", color: TX.accent }}>producto</span></div>
        </div>
        <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
          <input name="nombre" placeholder="Nombre *" value={form.nombre} onChange={ch} style={inputStyle} />
          <input name="precio" type="number" placeholder="Precio *" value={form.precio} onChange={ch} style={inputStyle} />
          <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={ch} style={inputStyle} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.16em", color: TX.muted, textTransform: "uppercase" }}>Categoría</span>
            <CategoryCombobox value={form.categoria} onChange={(v) => setForm({ ...form, categoria: v })} opciones={categoriaOptions} />
          </div>
        </div>
        <div style={{ padding: "12px 22px 22px", borderTop: `1px solid ${TX.line}`, background: TX.bg2, display: "flex", gap: 8, borderRadius: isDesktop ? "0 0 16px 16px" : 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", background: "transparent", color: TX.ink, border: `1px solid ${TX.ink}`, borderRadius: 6, cursor: "pointer", fontFamily: TX.sans, fontSize: 12 }}>Cancelar</button>
          <button onClick={guardar} style={{ flex: 1, padding: "12px", background: TX.accent, color: TX.bg, border: "none", borderRadius: 6, cursor: "pointer", fontFamily: TX.sans, fontSize: 12, fontWeight: 600 }}>Crear</button>
        </div>
      </div>
    </div>
  );
}

// ─── Orders list ─────────────────────────────────────────────────────────────
function OrdersList({ isDesktop }) {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [expanded, setExpanded] = useState(null);
  const [detalles, setDetalles] = useState({});

  const cargar = () => getPedidos().then((r) => setPedidos(r.data));
  useEffect(() => { cargar(); const t = setInterval(cargar, 10000); return () => clearInterval(t); }, []);

  const verDetalle = async (id) => {
    if (detalles[id]) return setDetalles((d) => ({ ...d, [id]: undefined }));
    const r = await getDetallePedido(id);
    setDetalles((d) => ({ ...d, [id]: r.data }));
  };

  const avanzar = async (id, estado) => {
    const next = STATUS_FLOW[estado];
    if (!next) return;
    await actualizarEstado(id, next);
    setPedidos((prev) => prev.map((p) => p.id === id ? { ...p, estado: next } : p));
  };

  const FILTROS = [
    { id: "todos", label: "Todos" },
    { id: "pendiente", label: "Nuevos" },
    { id: "en_proceso", label: "Cocina" },
    { id: "entregado", label: "Entregados" },
  ];
  const visibles = filtro === "todos" ? pedidos : pedidos.filter((p) => p.estado === filtro);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: `1px solid ${TX.line}` }}>
        {[
          { l: "Pedidos", v: pedidos.length },
          { l: "Nuevos", v: pedidos.filter((p) => p.estado === "pendiente").length, c: TX.accent },
          { l: "En cocina", v: pedidos.filter((p) => p.estado === "en_proceso").length, c: TX.accent2 },
        ].map((st, i) => (
          <div key={i} style={{ padding: "10px 8px", textAlign: "center", borderRight: i < 2 ? `1px solid ${TX.lineSoft}` : "none" }}>
            <div style={{ fontFamily: TX.mono, fontSize: 8, letterSpacing: "0.18em", color: TX.muted, textTransform: "uppercase" }}>{st.l}</div>
            <div style={{ fontFamily: TX.serif, fontSize: 18, marginTop: 2, fontWeight: 500, color: st.c || TX.ink }}>{st.v}</div>
          </div>
        ))}
      </div>
      {/* Filtros */}
      <div style={{ padding: "10px 22px", display: "flex", gap: 14, borderBottom: `1px solid ${TX.line}`, overflowX: "auto" }}>
        {FILTROS.map((f) => {
          const active = f.id === filtro;
          return (
            <button key={f.id} onClick={() => setFiltro(f.id)} style={{
              flex: "0 0 auto", padding: "4px 0", background: "transparent", border: "none", cursor: "pointer",
              fontFamily: TX.serif, fontSize: 13, fontStyle: active ? "italic" : "normal",
              color: active ? TX.ink : TX.muted, borderBottom: active ? `2px solid ${TX.accent}` : "2px solid transparent",
            }}>{f.label}</button>
          );
        })}
      </div>
      {/* Lista */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 22px 24px" }}>
        {visibles.length === 0 && (
          <div style={{ padding: "30px 0", color: TX.muted, fontFamily: TX.serif, fontStyle: "italic", fontSize: 13, textAlign: "center" }}>· sin pedidos ·</div>
        )}
        <div style={{
          display: isDesktop ? "grid" : "flex",
          gridTemplateColumns: isDesktop ? "repeat(auto-fill, minmax(340px, 1fr))" : undefined,
          flexDirection: isDesktop ? undefined : "column",
          gap: 14, alignItems: "start",
        }}>
          {visibles.map((o) => {
            const isOpen = expanded === o.id;
            return (
              <div key={o.id} onClick={() => { setExpanded(isOpen ? null : o.id); if (!isOpen) verDetalle(o.id); }}
                style={{ background: TX.surface, border: `1px solid ${isOpen ? TX.accent : TX.line}`, cursor: "pointer", clipPath: "polygon(0 0, 100% 0, 100% 96%, 96% 100%, 0 100%)" }}>
                <div style={{ padding: "10px 14px 6px", borderBottom: `1px dashed ${TX.line}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_DOT[o.estado], boxShadow: o.estado === "pendiente" ? `0 0 0 3px ${STATUS_DOT[o.estado]}33` : "none" }} />
                      <span style={{ fontFamily: TX.mono, fontSize: 11, color: TX.ink }}>#{o.id}</span>
                      <span style={{ fontFamily: TX.serif, fontStyle: "italic", fontSize: 11, color: TX.muted }}>· {STATUS_LABEL[o.estado]}</span>
                    </div>
                    <span style={{ fontFamily: TX.mono, fontSize: 10, color: TX.muted }}>
                      {new Date(o.fecha).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
                <div style={{ padding: "8px 14px 12px" }}>
                  <div style={{ fontFamily: TX.serif, fontSize: 18, fontWeight: 500 }}>{o.clienteNombre}</div>
                  {o.telefono && <div style={{ fontSize: 11, color: TX.muted, fontFamily: TX.serif, fontStyle: "italic" }}>{o.telefono}</div>}
                  {o.direccion && <div style={{ fontSize: 11, color: TX.ink2, fontFamily: TX.serif, marginTop: 2 }}>{o.direccion}</div>}
                  {isOpen && detalles[o.id] && (
                    <>
                      <div style={{ height: 1, background: TX.line, margin: "10px 0 8px" }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {detalles[o.id].map((d, i) => (
                          <div key={i}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                              <span style={{ fontFamily: TX.mono, fontSize: 11, color: TX.accent, minWidth: 18 }}>{d.cantidad}×</span>
                              <span style={{ fontFamily: TX.serif, fontSize: 13, flex: 1 }}>{d.producto}</span>
                              <Dots flex="0 0 20px" />
                              <span style={{ fontFamily: TX.mono, fontSize: 11, color: TX.ink2 }}>{pesos(d.precio * d.cantidad)}</span>
                            </div>
                            {d.adiciones?.length > 0 && (
                              <div style={{ paddingLeft: 24, marginTop: 2 }}>
                                {d.adiciones.map((a, j) => (
                                  <div key={j} style={{ display: "flex", gap: 4, fontFamily: TX.mono, fontSize: 10, color: TX.muted }}>
                                    <span>›</span><span>{a.nombre}</span>
                                    {a.precio > 0 && <span style={{ color: TX.accent2 }}>+{pesos(a.precio)}</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {o.nota && (
                        <div style={{ marginTop: 10, padding: "8px 10px", background: TX.bg2, borderLeft: `2px solid ${TX.accent}`, fontFamily: TX.serif, fontStyle: "italic", fontSize: 11.5, color: TX.accent }}>
                          "{o.nota}"
                        </div>
                      )}
                      {o.estado !== "entregado" && (
                        <button onClick={(e) => { e.stopPropagation(); avanzar(o.id, o.estado); }} style={{
                          marginTop: 12, width: "100%", padding: "9px 12px", background: TX.ink, color: TX.bg, border: "none",
                          fontFamily: TX.sans, fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em",
                        }}>{STATUS_BTN[o.estado]}</button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Menu editor ─────────────────────────────────────────────────────────────
function MenuEditor({ negocio, isDesktop }) {
  const [productos, setProductos] = useState([]);
  const [cat, setCat] = useState("todos");
  const [editando, setEditando] = useState(null);
  const [nuevoModal, setNuevoModal] = useState(false);

  const cargar = () => getMenu(negocio.slug).then((r) => setProductos(r.data.productos));
  useEffect(() => { cargar(); }, []);

  const categorias = ["todos", ...new Set(productos.map((p) => p.categoria).filter(Boolean))];
  const lista = cat === "todos" ? productos : productos.filter((p) => p.categoria === cat);

  const guardar = async (id, draft) => {
    const { data } = await api.put(`/productos/${id}`, draft);
    setProductos((prev) => prev.map((p) => p.id === id ? data : p));
    setEditando(null);
  };

  const eliminar = async (id) => {
    await api.delete(`/productos/${id}`);
    setProductos((prev) => prev.filter((p) => p.id !== id));
    setEditando(null);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "10px 22px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${TX.line}`, background: "rgba(224,122,60,0.08)" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: TX.accent, animation: "pulse 1.6s ease-in-out infinite" }} />
        <div style={{ fontFamily: TX.serif, fontStyle: "italic", fontSize: 13, color: TX.accent }}>Modo editor activo</div>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.1em", color: TX.muted }}>{productos.length} PRODUCTOS</span>
      </div>
      {/* Categorías */}
      <div style={{ padding: "8px 22px", display: "flex", gap: 14, overflowX: "auto", borderBottom: `1px solid ${TX.line}` }}>
        {categorias.map((c) => {
          const active = c === cat;
          return (
            <button key={c} onClick={() => setCat(c)} style={{
              flex: "0 0 auto", padding: "6px 0", position: "relative",
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: TX.serif, fontSize: 14, fontStyle: active ? "italic" : "normal", color: active ? TX.ink : TX.muted,
            }}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
              {active && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: TX.accent }} />}
            </button>
          );
        })}
      </div>
      {/* Lista */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 22px 24px" }}>
        <div style={{
          display: isDesktop ? "grid" : "flex",
          gridTemplateColumns: isDesktop ? "repeat(auto-fill, minmax(300px, 1fr))" : undefined,
          flexDirection: isDesktop ? undefined : "column",
          gap: 6, alignItems: "start",
        }}>
          {lista.map((p) => (
            <button key={p.id} onClick={() => setEditando(p)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
              width: "100%",
              background: TX.surface, border: `1px solid ${TX.line}`, borderRadius: 6,
              cursor: "pointer", textAlign: "left", color: TX.ink, opacity: p.disponible ? 1 : 0.5,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.disponible ? TX.good : TX.muted, flexShrink: 0 }} />
              <div style={{ width: 40, height: 40, borderRadius: 4, overflow: "hidden", flexShrink: 0, border: `1px solid ${TX.line}` }}>
                {p.imagen ? <img src={p.imagen} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <StripedPlaceholder tone={catTone(p.categoria)} stripe="rgba(244,235,217,0.10)" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: TX.serif, fontSize: 14, fontWeight: 500 }}>{p.nombre}</div>
                <div style={{ fontSize: 11, color: TX.muted, fontFamily: TX.serif, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.modificadores?.length > 0 ? `${p.modificadores.length} adición${p.modificadores.length > 1 ? "es" : ""}` : p.descripcion}
                </div>
              </div>
              <div style={{ fontFamily: TX.serif, fontSize: 15, color: TX.accent2, fontStyle: "italic" }}>{pesos(p.precio)}</div>
              {Ico.chev(13, TX.muted)}
            </button>
          ))}
        </div>
        <button onClick={() => setNuevoModal(true)} style={{
          marginTop: 14, width: "100%", padding: "12px",
          background: "transparent", border: `1px dashed ${TX.line}`,
          color: TX.accent, fontFamily: TX.serif, fontStyle: "italic", fontSize: 13,
          borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          {Ico.plus(13, TX.accent)} Añadir producto
        </button>
      </div>

      {editando && (
        <ProductEditor
          producto={editando}
          onClose={() => setEditando(null)}
          onSave={guardar}
          onDelete={eliminar}
          categoriaOptions={categorias}
          isDesktop={isDesktop}
        />
      )}
      {nuevoModal && (
        <NuevoProductoModal
          negocioId={negocio.id}
          onClose={() => setNuevoModal(false)}
          onCreated={(p) => setProductos((prev) => [...prev, p])}
          categoriaOptions={categorias}
          isDesktop={isDesktop}
        />
      )}
    </div>
  );
}

// ─── Negocio editor ───────────────────────────────────────────────────────────
function NegocioEditor({ negocio, onGuardado, isDesktop }) {
  const [draft, setDraft] = useState({ nombre: negocio.nombre, telefono: negocio.telefono, slug: negocio.slug });
  const [guardado, setGuardado] = useState(false);
  const ch = (e) => setDraft({ ...draft, [e.target.name]: e.target.value });

  const guardar = async () => {
    await api.put(`/negocios/${negocio.id}`, draft);
    setGuardado(true);
    onGuardado({ ...negocio, ...draft });
    setTimeout(() => setGuardado(false), 2000);
  };

  const menuUrl = `${window.location.origin}/menu/${draft.slug}`;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px 32px", display: "flex", flexDirection: "column", alignItems: isDesktop ? "center" : "stretch" }}>
      <div style={{ width: "100%", maxWidth: isDesktop ? 540 : "none", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.18em", color: TX.muted, textTransform: "uppercase" }}>Datos del negocio</div>

          {[
            { name: "nombre", label: "Nombre del negocio" },
            { name: "telefono", label: "WhatsApp (con código de país)" },
            { name: "slug", label: "URL del menú (solo letras, números, guiones)" },
          ].map(({ name, label }) => (
            <label key={name} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.14em", color: TX.muted, textTransform: "uppercase" }}>{label}</span>
              <input name={name} value={draft[name]} onChange={ch} style={inputStyle} />
            </label>
          ))}
        </div>

        <div style={{ padding: "14px 16px", background: TX.surface, border: `1px solid ${TX.line}`, borderRadius: 8 }}>
          <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.14em", color: TX.muted, textTransform: "uppercase", marginBottom: 6 }}>Link del menú para clientes</div>
          <div style={{ fontFamily: TX.serif, fontStyle: "italic", fontSize: 13, color: TX.accent2, wordBreak: "break-all", lineHeight: 1.5 }}>
            {menuUrl}
          </div>
          <button onClick={() => navigator.clipboard?.writeText(menuUrl)} style={{
            marginTop: 10, padding: "6px 14px", background: "transparent", border: `1px solid ${TX.line}`,
            color: TX.ink2, borderRadius: 6, cursor: "pointer", fontFamily: TX.sans, fontSize: 11,
          }}>Copiar enlace</button>
        </div>

        <button onClick={guardar} style={{
          padding: "13px", background: guardado ? TX.good : TX.accent, color: TX.bg, border: "none",
          borderRadius: 8, fontFamily: TX.sans, fontSize: 14, fontWeight: 600, cursor: "pointer",
          transition: "background .3s",
        }}>
          {guardado ? "¡Guardado!" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

// ─── Admin screen ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "pedidos", label: "Pedidos" },
  { id: "menu",    label: "Menú" },
  { id: "negocio", label: "Negocio" },
];

function AdminScreen({ negocio: negocioInit, isDesktop }) {
  const [tab, setTab] = useState("pedidos");
  const [negocio, setNegocio] = useState(negocioInit);

  const titles = {
    pedidos: <>Comandas <span style={{ fontStyle: "italic", color: TX.accent }}>del día</span></>,
    menu:    <>Editor de <span style={{ fontStyle: "italic", color: TX.accent }}>menú</span></>,
    negocio: <>Mi <span style={{ fontStyle: "italic", color: TX.accent }}>negocio</span></>,
  };

  if (isDesktop) {
    return (
      <div style={{ width: "100%", height: "100%", background: TX.bg, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{
          width: 220, flexShrink: 0,
          borderRight: `1px solid ${TX.line}`,
          background: TX.bg2,
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{ padding: "24px 20px 18px", borderBottom: `1px solid ${TX.line}` }}>
            <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.2em", color: TX.muted, textTransform: "uppercase" }}>Admin · panel</div>
            <div style={{ fontFamily: TX.serif, fontSize: 20, marginTop: 6, fontWeight: 500, color: TX.ink, lineHeight: 1.1 }}>{negocio.nombre}</div>
            <div style={{ fontFamily: TX.mono, fontSize: 9, color: TX.muted, marginTop: 4 }}>
              {new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "short" })}
            </div>
          </div>
          <nav style={{ flex: 1, padding: "10px 0" }}>
            {TABS.map(({ id, label }) => {
              const active = tab === id;
              return (
                <button key={id} onClick={() => setTab(id)} style={{
                  display: "flex", alignItems: "center",
                  width: "100%", padding: "11px 20px",
                  background: active ? "rgba(224,122,60,0.10)" : "transparent",
                  border: "none",
                  borderLeft: active ? `3px solid ${TX.accent}` : "3px solid transparent",
                  cursor: "pointer", outline: "none",
                  color: active ? TX.ink : TX.muted,
                  fontFamily: TX.serif, fontSize: 14, fontStyle: active ? "italic" : "normal",
                  textAlign: "left",
                }}>{label}</button>
              );
            })}
          </nav>
        </div>
        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 28px 14px", borderBottom: `2px solid ${TX.ink}`, flexShrink: 0 }}>
            <div style={{ fontFamily: TX.serif, fontSize: 28, lineHeight: 1, fontWeight: 500, letterSpacing: "-0.02em" }}>
              {titles[tab]}
            </div>
          </div>
          {tab === "pedidos" && <OrdersList isDesktop={isDesktop} />}
          {tab === "menu"    && <MenuEditor negocio={negocio} isDesktop={isDesktop} />}
          {tab === "negocio" && <NegocioEditor negocio={negocio} onGuardado={setNegocio} isDesktop={isDesktop} />}
        </div>
      </div>
    );
  }

  // Mobile
  return (
    <div style={{ width: "100%", height: "100%", background: TX.bg, fontFamily: TX.sans, color: TX.ink, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "12px 22px", borderBottom: `2px solid ${TX.ink}` }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.2em", color: TX.muted, textTransform: "uppercase" }}>Admin · panel</div>
          <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.2em", color: TX.muted, textTransform: "uppercase" }}>
            {new Date().toLocaleDateString("es-CO", { weekday: "short", day: "numeric" })}
          </div>
        </div>
        <div style={{ fontFamily: TX.serif, fontSize: 26, lineHeight: 1, marginTop: 2, textAlign: "center", letterSpacing: "-0.02em", fontWeight: 500 }}>
          {titles[tab]}
        </div>
        <div style={{ marginTop: 10, display: "flex", background: TX.surface, border: `1px solid ${TX.line}`, borderRadius: 6, padding: 3, gap: 2 }}>
          {TABS.map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, padding: "7px 4px", borderRadius: 4,
              background: tab === id ? TX.accent : "transparent",
              color: tab === id ? TX.bg : TX.ink2, border: "none", cursor: "pointer",
              fontFamily: TX.sans, fontSize: 11, fontWeight: tab === id ? 600 : 500,
            }}>{label}</button>
          ))}
        </div>
      </div>
      {tab === "pedidos" && <OrdersList isDesktop={false} />}
      {tab === "menu"    && <MenuEditor negocio={negocio} isDesktop={false} />}
      {tab === "negocio" && <NegocioEditor negocio={negocio} onGuardado={setNegocio} isDesktop={false} />}
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function Panel() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [negocio, setNegocio] = useState(null);

  useEffect(() => {
    api.get("/negocios").then((r) => r.data[0] && setNegocio(r.data[0])).catch(() => {});
  }, []);

  if (!negocio) return (
    <div style={{ height: "100%", background: TX.bg, display: "grid", placeItems: "center", fontFamily: TX.serif, fontStyle: "italic", color: TX.muted, fontSize: 14 }}>
      cargando…
    </div>
  );

  return (
    <div style={{ height: "100%", background: TX.bg }}>
      <AdminScreen negocio={negocio} isDesktop={isDesktop} />
    </div>
  );
}
