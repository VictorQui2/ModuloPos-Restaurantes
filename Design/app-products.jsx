// Pantalla PRODUCTOS · paleta arcilla oscura · lenguaje editorial (V4)
// Cliente o staff toma el pedido. Modal de modificadores + carrito completo.

const TX = {
  bg:        '#1f1814',
  bg2:       '#2a221c',
  surface:   '#332921',
  surface2:  '#3d3128',
  ink:       '#f4ebd9',
  ink2:      'rgba(244,235,217,0.78)',
  muted:     'rgba(244,235,217,0.50)',
  line:      'rgba(244,235,217,0.14)',
  lineSoft:  'rgba(244,235,217,0.07)',
  accent:    '#e07a3c',
  accent2:   '#d4a574',
  good:      '#a8b572',
  serif:     '"Fraunces", "Playfair Display", "EB Garamond", Georgia, serif',
  sans:      '"DM Sans", "Outfit", system-ui, sans-serif',
  mono:      'ui-monospace, "JetBrains Mono", Menlo, monospace',
};
window.TX = TX;

const { StripedPlaceholder, Ico, pesos } = window.POS_HELPERS;
const { useStore, Actions, CATS } = window.POS_STORE;
const { MODIFIERS } = window.POS_DATA;

function Dots({ flex = 1 }) {
  return (
    <div style={{
      flex, height: 1, marginBottom: 4,
      backgroundImage: `radial-gradient(circle, ${TX.line} 1px, transparent 1px)`,
      backgroundSize: '4px 1px', backgroundRepeat: 'repeat-x',
    }} />
  );
}
window.Dots = Dots;

// ─────────── Modal de modificadores ───────────
function ModifiersModal({ product, onClose }) {
  const [picks, setPicks] = React.useState({});
  const mods = MODIFIERS[product.cat] || [];

  const togglePick = (gIdx, optKey, multi) => {
    setPicks((p) => {
      const cur = p[gIdx] || (multi ? [] : null);
      if (multi) {
        const arr = cur.includes(optKey) ? cur.filter(k => k !== optKey) : [...cur, optKey];
        return { ...p, [gIdx]: arr };
      }
      return { ...p, [gIdx]: optKey };
    });
  };

  const extraTotal = mods.reduce((sum, group, gi) => {
    const sel = picks[gi];
    if (!sel) return sum;
    if (group.multi) {
      return sum + sel.reduce((s, key) => {
        const opt = group.options.find(o => o[0] === key);
        return s + (opt ? opt[1] : 0);
      }, 0);
    } else {
      const opt = group.options.find(o => o[0] === sel);
      return sum + (opt ? opt[1] : 0);
    }
  }, 0);
  const finalPrice = product.price + extraTotal;

  const collectMods = () => {
    const out = [];
    mods.forEach((g, gi) => {
      const sel = picks[gi];
      if (!sel) return;
      if (g.multi) sel.forEach(k => out.push(k));
      else if (sel) out.push(sel);
    });
    return out;
  };

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
      zIndex: 50, display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxHeight: '88%', background: TX.bg, color: TX.ink,
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        animation: 'slideUp .25s ease-out',
      }}>
        {/* handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: TX.line }} />
        </div>

        {/* header con imagen */}
        <div style={{ padding: '0 22px 10px' }}>
          <div style={{ width: '100%', height: 110, borderRadius: 8, overflow: 'hidden', marginBottom: 12, border: `1px solid ${TX.line}` }}>
            <StripedPlaceholder
              tone={product.cat === 'burgers' ? '#7a5c3a' : product.cat === 'tacos' ? '#8a6420' : product.cat === 'bebidas' ? '#5a6a3a' : product.cat === 'postres' ? '#7a4c40' : '#6a5840'}
              stripe="rgba(244,235,217,0.10)"
              label={product.cat}
            />
          </div>
          <div style={{ fontFamily: TX.serif, fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em' }}>
            {product.name}
          </div>
          <div style={{ fontFamily: TX.serif, fontStyle: 'italic', fontSize: 12, color: TX.ink2, marginTop: 2 }}>
            {product.desc}
          </div>
        </div>

        {/* groups */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 22px 16px' }}>
          {mods.length === 0 && (
            <div style={{ padding: '20px 0', color: TX.muted, fontFamily: TX.serif, fontStyle: 'italic', fontSize: 13, textAlign: 'center' }}>
              Sin modificadores · listo para añadir
            </div>
          )}
          {mods.map((group, gi) => (
            <div key={gi} style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: TX.serif, fontStyle: 'italic', fontSize: 13, color: TX.accent2 }}>
                  {group.name}
                </span>
                <span style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: '0.1em', color: TX.muted, textTransform: 'uppercase' }}>
                  {group.multi ? 'opcional · varios' : 'elige uno'}
                </span>
                <div style={{ flex: 1, height: 1, background: TX.line }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {group.options.map(([key, extra]) => {
                  const sel = picks[gi];
                  const active = group.multi ? (sel || []).includes(key) : sel === key;
                  return (
                    <button key={key} onClick={() => togglePick(gi, key, group.multi)}
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        padding: '10px 0', display: 'flex', alignItems: 'center', gap: 10,
                        color: TX.ink, textAlign: 'left',
                      }}>
                      <div style={{
                        width: 18, height: 18,
                        borderRadius: group.multi ? 4 : '50%',
                        border: `1.5px solid ${active ? TX.accent : TX.line}`,
                        background: active ? TX.accent : 'transparent',
                        display: 'grid', placeItems: 'center',
                        flexShrink: 0,
                      }}>
                        {active && (
                          <div style={{
                            width: group.multi ? 10 : 7, height: group.multi ? 10 : 7,
                            background: TX.bg, borderRadius: group.multi ? 1 : '50%',
                          }} />
                        )}
                      </div>
                      <span style={{ flex: 1, fontFamily: TX.serif, fontSize: 14 }}>{key}</span>
                      {extra > 0 && (
                        <span style={{ fontFamily: TX.mono, fontSize: 11, color: TX.accent2 }}>+{pesos(extra)}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ padding: '12px 22px 22px', borderTop: `1px solid ${TX.line}`, background: TX.bg2 }}>
          <button onClick={() => { Actions.addToCart(product, collectMods()); onClose(); }}
            style={{
              width: '100%', padding: '14px 16px',
              background: TX.accent, color: TX.bg, border: 'none', borderRadius: 8,
              fontFamily: TX.sans, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
            <span>Añadir al pedido</span>
            <span style={{ fontFamily: TX.serif, fontStyle: 'italic', fontSize: 16 }}>{pesos(finalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────── Drawer del carrito ───────────
function CartDrawer({ onClose, onCheckout }) {
  const [s] = useStore();
  const subtotal = s.cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const propina = Math.round(subtotal * 0.10);
  const total = subtotal + propina;

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
      zIndex: 50, display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxHeight: '92%', background: TX.bg, color: TX.ink,
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        animation: 'slideUp .25s ease-out',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: TX.line }} />
        </div>
        <div style={{ padding: '0 22px 12px', borderBottom: `1px solid ${TX.line}` }}>
          <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: '0.2em', color: TX.muted, textTransform: 'uppercase', textAlign: 'center' }}>
            Tu pedido
          </div>
          <div style={{ fontFamily: TX.serif, fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', textAlign: 'center', marginTop: 2 }}>
            <span style={{ fontStyle: 'italic', color: TX.accent }}>Resumen</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 22px' }}>
          {/* mesa + cliente */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: '0.16em', color: TX.muted, textTransform: 'uppercase' }}>Mesa</span>
              <input value={s.mesa} onChange={(e) => Actions.setMesa(e.target.value)}
                style={{ background: TX.surface, border: `1px solid ${TX.line}`, color: TX.ink, padding: '8px 10px', borderRadius: 6, fontFamily: TX.serif, fontSize: 14, outline: 'none' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: '0.16em', color: TX.muted, textTransform: 'uppercase' }}>Cliente</span>
              <input value={s.cliente} onChange={(e) => Actions.setCliente(e.target.value)}
                style={{ background: TX.surface, border: `1px solid ${TX.line}`, color: TX.ink, padding: '8px 10px', borderRadius: 6, fontFamily: TX.serif, fontSize: 14, outline: 'none' }} />
            </label>
          </div>

          {/* items */}
          {s.cart.length === 0 && (
            <div style={{ padding: '40px 0', color: TX.muted, fontFamily: TX.serif, fontStyle: 'italic', fontSize: 13, textAlign: 'center' }}>
              · vacío ·
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {s.cart.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontFamily: TX.serif, fontSize: 14, fontWeight: 500 }}>{c.name}</span>
                    <Dots />
                    <span style={{ fontFamily: TX.mono, fontSize: 11, color: TX.ink2 }}>{pesos(c.price * c.qty)}</span>
                  </div>
                  {c.mods?.length > 0 && (
                    <div style={{ fontFamily: TX.mono, fontSize: 10, color: TX.muted, marginTop: 2 }}>
                      {c.mods.map(m => '› ' + m).join('  ')}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <button onClick={() => Actions.changeQty(i, -1)} style={{
                      width: 24, height: 24, borderRadius: 6, background: TX.surface, color: TX.ink,
                      border: `1px solid ${TX.line}`, cursor: 'pointer', display: 'grid', placeItems: 'center',
                    }}>{Ico.minus(11, TX.ink)}</button>
                    <span style={{ fontFamily: TX.mono, fontSize: 13, minWidth: 18, textAlign: 'center' }}>{c.qty}</span>
                    <button onClick={() => Actions.changeQty(i, 1)} style={{
                      width: 24, height: 24, borderRadius: 6, background: TX.surface, color: TX.ink,
                      border: `1px solid ${TX.line}`, cursor: 'pointer', display: 'grid', placeItems: 'center',
                    }}>{Ico.plus(11, TX.ink)}</button>
                    <button onClick={() => Actions.removeFromCart(i)} style={{
                      marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer',
                      fontFamily: TX.serif, fontStyle: 'italic', fontSize: 11, color: TX.muted,
                    }}>quitar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* nota */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: '0.16em', color: TX.muted, textTransform: 'uppercase', marginBottom: 4 }}>
              Nota para la cocina
            </div>
            <textarea value={s.nota} onChange={(e) => Actions.setNota(e.target.value)} rows={2}
              placeholder="Alergias, preferencias…"
              style={{ width: '100%', background: TX.surface, border: `1px solid ${TX.line}`, color: TX.ink,
                padding: '10px 12px', borderRadius: 6, fontFamily: TX.serif, fontSize: 13,
                outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* totales */}
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px dashed ${TX.line}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: TX.serif, fontSize: 13, color: TX.ink2 }}>
              <span>Subtotal</span><span>{pesos(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: TX.serif, fontSize: 13, color: TX.ink2, marginTop: 4 }}>
              <span style={{ fontStyle: 'italic' }}>Propina sugerida (10%)</span><span>{pesos(propina)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: TX.serif, fontSize: 22, marginTop: 8, fontWeight: 500 }}>
              <span>Total</span><span style={{ fontStyle: 'italic', color: TX.accent }}>{pesos(total)}</span>
            </div>
          </div>
        </div>

        {/* CTA pago */}
        <div style={{ padding: '12px 22px 22px', borderTop: `1px solid ${TX.line}`, background: TX.bg2,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button onClick={() => onCheckout('Efectivo')} disabled={s.cart.length === 0} style={{
            padding: '12px', background: 'transparent', color: TX.ink,
            border: `1px solid ${TX.ink}`, borderRadius: 6,
            fontFamily: TX.sans, fontSize: 13, fontWeight: 500, cursor: s.cart.length ? 'pointer' : 'not-allowed',
            opacity: s.cart.length ? 1 : 0.4,
          }}>Cobrar · Efectivo</button>
          <button onClick={() => onCheckout('Tarjeta')} disabled={s.cart.length === 0} style={{
            padding: '12px', background: TX.accent, color: TX.bg, border: 'none', borderRadius: 6,
            fontFamily: TX.sans, fontSize: 13, fontWeight: 600, cursor: s.cart.length ? 'pointer' : 'not-allowed',
            opacity: s.cart.length ? 1 : 0.5,
          }}>Cobrar · Tarjeta</button>
        </div>
      </div>
    </div>
  );
}

// ─────────── Confirmación de pedido ───────────
function OrderConfirm({ orderId, total, pago, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 60,
      display: 'grid', placeItems: 'center', padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: TX.bg, color: TX.ink, padding: '28px 26px',
        border: `1px solid ${TX.line}`, maxWidth: 320, width: '100%',
        animation: 'fadeIn .25s ease-out', textAlign: 'center',
        clipPath: 'polygon(0 0, 100% 0, 100% 96%, 96% 100%, 0 100%)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: TX.accent,
          margin: '0 auto 14px', display: 'grid', placeItems: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={TX.bg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5 12 10 17 19 7" />
          </svg>
        </div>
        <div style={{ fontFamily: TX.serif, fontSize: 22, fontWeight: 500 }}>
          Pedido <span style={{ fontStyle: 'italic', color: TX.accent }}>confirmado</span>
        </div>
        <div style={{ fontFamily: TX.mono, fontSize: 11, color: TX.muted, marginTop: 6, letterSpacing: '0.1em' }}>
          {orderId} · {pago.toUpperCase()}
        </div>
        <div style={{ fontFamily: TX.serif, fontSize: 18, fontStyle: 'italic', color: TX.accent2, marginTop: 8 }}>
          {pesos(total)}
        </div>
        <div style={{ fontFamily: TX.serif, fontStyle: 'italic', fontSize: 12, color: TX.ink2, marginTop: 12, lineHeight: 1.5 }}>
          Enviado a la cocina. Lo verás en la pantalla de Admin.
        </div>
        <button onClick={onClose} style={{
          marginTop: 20, padding: '10px 22px', background: TX.ink, color: TX.bg,
          border: 'none', fontFamily: TX.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          letterSpacing: '0.04em',
        }}>NUEVO PEDIDO</button>
      </div>
    </div>
  );
}

// ─────────── Pantalla principal de productos ───────────
function ProductsScreen() {
  const [s] = useStore();
  const [cat, setCat] = React.useState('todos');
  const [search, setSearch] = React.useState('');
  const [openProduct, setOpenProduct] = React.useState(null);
  const [showCart, setShowCart] = React.useState(false);
  const [confirm, setConfirm] = React.useState(null);

  const filtered = s.products
    .filter((p) => cat === 'todos' || p.cat === cat)
    .filter((p) => p.available)
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const cartCount = s.cart.reduce((sum, c) => sum + c.qty, 0);
  const cartSubtotal = s.cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  const handleCheckout = (pago) => {
    const subtotal = s.cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    const total = subtotal + Math.round(subtotal * 0.10);
    Actions.confirmOrder(pago);
    const nextNum = 129 + s.orders.filter(o => /^#A-\d+$/.test(o.id)).length;
    setShowCart(false);
    setConfirm({ orderId: `#A-${nextNum}`, total, pago });
  };

  return (
    <div style={{
      width: '100%', height: '100%', background: TX.bg,
      fontFamily: TX.sans, color: TX.ink, position: 'relative',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* header */}
      <div style={{ padding: '12px 22px 10px', borderBottom: `1px solid ${TX.line}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: '0.2em', color: TX.muted, textTransform: 'uppercase' }}>
            Vol. iv
          </div>
          <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: '0.2em', color: TX.muted, textTransform: 'uppercase' }}>
            14:30 · {s.mesa}
          </div>
        </div>
        <div style={{
          fontFamily: TX.serif, fontSize: 36, lineHeight: 0.95,
          letterSpacing: '-0.02em', textAlign: 'center', marginTop: 2, fontWeight: 500,
        }}>
          La <span style={{ fontStyle: 'italic', color: TX.accent }}>Carta</span>
        </div>
        <div style={{ fontFamily: TX.serif, fontStyle: 'italic', fontSize: 11, textAlign: 'center', color: TX.ink2, marginTop: 2 }}>
          recetario de la casa · cocina abierta
        </div>
      </div>

      {/* Search funcional */}
      <div style={{
        padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: `1px solid ${TX.lineSoft}`,
      }}>
        {Ico.search(14, TX.ink)}
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="buscar en la carta…"
          style={{
            flex: 1, background: 'transparent', border: 'none', color: TX.ink,
            fontFamily: TX.serif, fontStyle: search ? 'normal' : 'italic', fontSize: 14,
            outline: 'none', padding: 0,
          }} />
      </div>

      {/* Tabs */}
      <div style={{
        padding: '8px 22px', display: 'flex', gap: 14, overflowX: 'auto',
        borderBottom: `1px solid ${TX.line}`,
      }}>
        {CATS.map((c) => {
          const active = c.id === cat;
          return (
            <button key={c.id} onClick={() => setCat(c.id)} style={{
              flex: '0 0 auto', padding: '6px 0', position: 'relative',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: TX.serif, fontSize: 14,
              fontStyle: active ? 'italic' : 'normal',
              fontWeight: active ? 500 : 400,
              color: active ? TX.ink : TX.muted,
            }}>
              {c.name}
              {active && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, bottom: 0,
                  height: 2, background: TX.accent,
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Lista */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 22px', paddingBottom: cartCount > 0 ? 110 : 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: TX.ink, margin: '0 0 12px' }}>
          <div style={{ flex: 1, height: 1, background: TX.line }} />
          <span style={{ fontFamily: TX.serif, fontStyle: 'italic', fontSize: 12, color: TX.ink2 }}>
            {cat === 'todos' ? 'destacados' : CATS.find(c=>c.id===cat)?.name?.toLowerCase()}
          </span>
          <div style={{ flex: 1, height: 1, background: TX.line }} />
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '30px 0', color: TX.muted, fontFamily: TX.serif, fontStyle: 'italic', fontSize: 13, textAlign: 'center' }}>
            · sin resultados ·
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((p) => (
            <button key={p.id} onClick={() => setOpenProduct(p)} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
              textAlign: 'left', color: TX.ink,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 4, flex: '0 0 auto',
                overflow: 'hidden', border: `1px solid ${TX.line}`,
              }}>
                <StripedPlaceholder
                  tone={p.cat === 'burgers' ? '#7a5c3a' : p.cat === 'tacos' ? '#8a6420' : p.cat === 'bebidas' ? '#5a6a3a' : p.cat === 'postres' ? '#7a4c40' : '#6a5840'}
                  stripe="rgba(244,235,217,0.10)"
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: TX.serif, fontSize: 16, fontWeight: 500, letterSpacing: '-0.01em' }}>
                    {p.name}
                  </span>
                  {p.tag && (
                    <span style={{ fontFamily: TX.serif, fontStyle: 'italic', fontSize: 10, color: TX.accent }}>
                      · {p.tag.toLowerCase()}
                    </span>
                  )}
                  <Dots />
                  <span style={{ fontFamily: TX.serif, fontSize: 15, fontWeight: 500, color: TX.accent2 }}>
                    {pesos(p.price)}
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: TX.ink2, marginTop: 3, lineHeight: 1.4, fontFamily: TX.serif }}>
                  {p.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart bar */}
      {cartCount > 0 && (
        <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
          <button onClick={() => setShowCart(true)} style={{
            width: '100%', background: TX.ink, color: TX.bg, borderRadius: 4,
            display: 'flex', alignItems: 'stretch', overflow: 'hidden',
            fontFamily: TX.sans, border: 'none', cursor: 'pointer', padding: 0,
            boxShadow: '0 8px 30px rgba(0,0,0,0.45)',
          }}>
            <div style={{ padding: '12px 16px', borderRight: `1px solid rgba(31,24,20,0.18)` }}>
              <div style={{ fontFamily: TX.mono, fontSize: 9, letterSpacing: '0.16em', color: 'rgba(31,24,20,0.55)', textAlign: 'left' }}>
                CUENTA
              </div>
              <div style={{ fontFamily: TX.serif, fontSize: 17, fontStyle: 'italic', color: TX.accent, marginTop: 1, textAlign: 'left' }}>
                {pesos(cartSubtotal)}
              </div>
            </div>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 16px',
            }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Revisar pedido ({cartCount})</span>
              {Ico.chev(14, TX.bg)}
            </div>
          </button>
        </div>
      )}

      {/* Modals */}
      {openProduct && <ModifiersModal product={openProduct} onClose={() => setOpenProduct(null)} />}
      {showCart && <CartDrawer onClose={() => setShowCart(false)} onCheckout={handleCheckout} />}
      {confirm && <OrderConfirm {...confirm} onClose={() => setConfirm(null)} />}
    </div>
  );
}

window.ProductsScreen = ProductsScreen;
