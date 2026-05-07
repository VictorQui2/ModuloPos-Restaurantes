// Pantalla ADMIN · pedidos en vivo + modo editor para productos
// Comparte la paleta arcilla oscura y el lenguaje editorial de products.

const { useStore: useS2, Actions: A2, CATS: CATS2, DAY_STATS: DS } = window.POS_STORE;
const { Ico: I, pesos: $ } = window.POS_HELPERS;
const TX2 = window.TX;
const Dots2 = window.Dots;

// ─────────── Lista de pedidos en vivo ───────────
function OrdersList() {
  const [s] = useS2();
  const [filter, setFilter] = React.useState('todos');
  const [expanded, setExpanded] = React.useState(s.orders[0]?.id);

  const filters = [
    { id: 'todos', name: 'Todos' },
    { id: 'nuevo', name: 'Nuevos' },
    { id: 'preparando', name: 'Cocina' },
    { id: 'listo', name: 'Listos' },
  ];
  const visible = filter === 'todos' ? s.orders : s.orders.filter(o => o.status === filter);

  const statusDot = {
    nuevo: TX2.accent, preparando: TX2.accent2, listo: TX2.good, entregado: TX2.muted,
  };
  const statusLabel = {
    nuevo: 'nuevo', preparando: 'cocina', listo: 'listo', entregado: 'entregado',
  };

  return (
    <>
      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        borderBottom: `1px solid ${TX2.line}`,
      }}>
        {[
          { l: 'Ventas', v: $(DS.ventas), small: true, c: TX2.accent2 },
          { l: 'Pedidos', v: s.orders.length, c: TX2.ink },
          { l: 'Ticket', v: $(DS.ticket), c: TX2.ink },
          { l: 'T·prom', v: DS.tiempoProm + 'm', c: TX2.ink },
        ].map((st, i) => (
          <div key={i} style={{
            padding: '10px 8px', textAlign: 'center',
            borderRight: i < 3 ? `1px solid ${TX2.lineSoft}` : 'none',
          }}>
            <div style={{ fontFamily: TX2.mono, fontSize: 8, letterSpacing: '0.18em', color: TX2.muted, textTransform: 'uppercase' }}>
              {st.l}
            </div>
            <div style={{ fontFamily: TX2.serif, fontSize: st.small ? 15 : 18, marginTop: 2, fontWeight: 500, color: st.c }}>
              {st.v}
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{
        padding: '10px 22px', display: 'flex', gap: 14,
        borderBottom: `1px solid ${TX2.line}`, overflowX: 'auto',
      }}>
        {filters.map((f) => {
          const active = f.id === filter;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              flex: '0 0 auto', padding: '4px 0',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: TX2.serif, fontSize: 13,
              fontStyle: active ? 'italic' : 'normal',
              color: active ? TX2.ink : TX2.muted,
              borderBottom: active ? `2px solid ${TX2.accent}` : '2px solid transparent',
            }}>{f.name}</button>
          );
        })}
      </div>

      {/* Lista */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 22px 24px' }}>
        {visible.length === 0 && (
          <div style={{ padding: '30px 0', color: TX2.muted, fontFamily: TX2.serif, fontStyle: 'italic', fontSize: 13, textAlign: 'center' }}>
            · sin pedidos ·
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {visible.map((o) => {
            const isOpen = expanded === o.id;
            return (
              <div key={o.id} onClick={() => setExpanded(isOpen ? null : o.id)}
                style={{
                  background: TX2.surface,
                  border: `1px solid ${isOpen ? TX2.accent : TX2.line}`,
                  cursor: 'pointer', position: 'relative',
                  clipPath: 'polygon(0 0, 100% 0, 100% 96%, 96% 100%, 0 100%)',
                }}>
                <div style={{ padding: '10px 14px 6px', borderBottom: `1px dashed ${TX2.line}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: statusDot[o.status],
                        boxShadow: o.status === 'nuevo' ? `0 0 0 3px ${statusDot[o.status]}33` : 'none',
                      }} />
                      <span style={{ fontFamily: TX2.mono, fontSize: 11, letterSpacing: '0.1em', color: TX2.ink }}>{o.id}</span>
                      <span style={{ fontFamily: TX2.serif, fontStyle: 'italic', fontSize: 11, color: TX2.muted }}>· {statusLabel[o.status]}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: TX2.mono, fontSize: 10, color: TX2.muted }}>
                      {I.clock(11, TX2.muted)} {o.time}m
                    </div>
                  </div>
                </div>
                <div style={{ padding: '8px 14px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontFamily: TX2.serif, fontSize: 18, fontWeight: 500 }}>{o.mesa}</div>
                      <div style={{ fontSize: 11, color: TX2.muted, fontFamily: TX2.serif, fontStyle: 'italic' }}>
                        a/c {o.cliente} · {(o.pago||'').toLowerCase()}
                      </div>
                    </div>
                    <div style={{ fontFamily: TX2.serif, fontSize: 22, fontWeight: 500, color: TX2.accent2, fontStyle: 'italic' }}>
                      {$(o.total)}
                    </div>
                  </div>
                  {!isOpen && (
                    <div style={{ marginTop: 8, fontSize: 11.5, color: TX2.ink2, fontFamily: TX2.serif, fontStyle: 'italic' }}>
                      {o.items.map(it => `${it.qty}× ${it.name}`).join(', ')}
                    </div>
                  )}
                  {isOpen && (
                    <>
                      <Dots2 flex={undefined} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
                        {o.items.map((it, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                            <span style={{ fontFamily: TX2.mono, fontSize: 11, color: TX2.accent, minWidth: 18 }}>{it.qty}×</span>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontFamily: TX2.serif, fontSize: 13 }}>{it.name}</span>
                              {it.mods?.length > 0 && (
                                <div style={{ fontSize: 10, color: TX2.muted, fontFamily: TX2.mono, marginTop: 1 }}>
                                  {it.mods.map(m => '› ' + m).join('  ')}
                                </div>
                              )}
                            </div>
                            <Dots2 flex="0 0 30px" />
                            <span style={{ fontFamily: TX2.mono, fontSize: 11, color: TX2.ink2 }}>{$(it.price)}</span>
                          </div>
                        ))}
                      </div>
                      {o.nota && (
                        <div style={{
                          marginTop: 10, padding: '8px 10px',
                          background: TX2.bg2, borderLeft: `2px solid ${TX2.accent}`,
                          fontFamily: TX2.serif, fontStyle: 'italic',
                          fontSize: 11.5, color: TX2.accent,
                        }}>“{o.nota}”</div>
                      )}
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <button onClick={(e) => { e.stopPropagation(); A2.advanceOrder(o.id); }} style={{
                          flex: 1, padding: '9px 12px',
                          background: TX2.ink, color: TX2.bg, border: 'none',
                          fontFamily: TX2.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          letterSpacing: '0.02em',
                        }}>
                          {o.status === 'nuevo' ? 'INICIAR' :
                           o.status === 'preparando' ? 'MARCAR LISTO' :
                           o.status === 'listo' ? 'ENTREGAR' : 'ENTREGADO'}
                        </button>
                        <button onClick={(e) => e.stopPropagation()} style={{
                          padding: '9px 12px',
                          background: 'transparent', color: TX2.ink,
                          border: `1px solid ${TX2.ink}`,
                          fontFamily: TX2.sans, fontSize: 12, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 5,
                        }}>{I.print(12, TX2.ink)} Imprimir</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─────────── Modal de edición de producto ───────────
function ProductEditor({ product, onClose }) {
  const [draft, setDraft] = React.useState(product);
  const update = (patch) => setDraft({ ...draft, ...patch });
  const save = () => { A2.updateProduct(product.id, draft); onClose(); };
  const remove = () => {
    if (confirm(`¿Eliminar "${product.name}"?`)) { A2.removeProduct(product.id); onClose(); }
  };
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50,
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', background: TX2.bg, color: TX2.ink,
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        animation: 'slideUp .25s ease-out',
        display: 'flex', flexDirection: 'column', maxHeight: '92%',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: TX2.line }} />
        </div>
        <div style={{ padding: '0 22px 12px', borderBottom: `1px solid ${TX2.line}`, textAlign: 'center' }}>
          <div style={{ fontFamily: TX2.mono, fontSize: 9, letterSpacing: '0.2em', color: TX2.muted, textTransform: 'uppercase' }}>
            Editor de producto
          </div>
          <div style={{ fontFamily: TX2.serif, fontSize: 24, fontWeight: 500, marginTop: 2 }}>
            <span style={{ fontStyle: 'italic', color: TX2.accent }}>Editar</span> ficha
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Nombre">
            <input value={draft.name} onChange={(e) => update({ name: e.target.value })} style={inputStyle} />
          </Field>
          <Field label="Descripción">
            <textarea rows={2} value={draft.desc} onChange={(e) => update({ desc: e.target.value })}
              style={{ ...inputStyle, resize: 'none', boxSizing: 'border-box' }} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Precio">
              <input type="number" value={draft.price}
                onChange={(e) => update({ price: Number(e.target.value) || 0 })} style={inputStyle} />
            </Field>
            <Field label="Categoría">
              <select value={draft.cat} onChange={(e) => update({ cat: e.target.value })} style={inputStyle}>
                {CATS2.filter(c => c.id !== 'todos').map(c => (
                  <option key={c.id} value={c.id} style={{ background: TX2.bg }}>{c.name}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Etiqueta destacada (opcional)">
            <input value={draft.tag || ''} onChange={(e) => update({ tag: e.target.value || undefined })}
              placeholder="Top, Nuevo, Limitado…" style={inputStyle} />
          </Field>

          <label style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
            background: TX2.surface, border: `1px solid ${TX2.line}`, borderRadius: 6,
            cursor: 'pointer',
          }}>
            <div style={{
              width: 38, height: 22, borderRadius: 11, padding: 2,
              background: draft.available ? TX2.accent : TX2.surface2,
              transition: 'background .15s', flexShrink: 0,
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: TX2.bg,
                transform: draft.available ? 'translateX(16px)' : 'translateX(0)',
                transition: 'transform .15s',
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TX2.serif, fontSize: 14 }}>Disponible</div>
              <div style={{ fontFamily: TX2.serif, fontStyle: 'italic', fontSize: 11, color: TX2.muted }}>
                {draft.available ? 'visible para los clientes' : 'oculto temporalmente'}
              </div>
            </div>
            <input type="checkbox" checked={draft.available}
              onChange={(e) => update({ available: e.target.checked })} style={{ display: 'none' }} />
          </label>
        </div>
        <div style={{
          padding: '12px 22px 22px', borderTop: `1px solid ${TX2.line}`, background: TX2.bg2,
          display: 'flex', gap: 8,
        }}>
          <button onClick={remove} style={{
            padding: '12px 14px', background: 'transparent', color: TX2.muted,
            border: `1px solid ${TX2.line}`, borderRadius: 6, cursor: 'pointer',
            fontFamily: TX2.sans, fontSize: 12, fontWeight: 500,
          }}>Eliminar</button>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', background: 'transparent', color: TX2.ink,
            border: `1px solid ${TX2.ink}`, borderRadius: 6, cursor: 'pointer',
            fontFamily: TX2.sans, fontSize: 12, fontWeight: 500,
          }}>Cancelar</button>
          <button onClick={save} style={{
            flex: 1, padding: '12px', background: TX2.accent, color: TX2.bg, border: 'none',
            borderRadius: 6, cursor: 'pointer',
            fontFamily: TX2.sans, fontSize: 12, fontWeight: 600,
          }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', background: TX2.surface, border: `1px solid ${TX2.line}`, color: TX2.ink,
  padding: '10px 12px', borderRadius: 6, fontFamily: TX2.serif, fontSize: 14,
  outline: 'none', boxSizing: 'border-box',
};

function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontFamily: TX2.mono, fontSize: 9, letterSpacing: '0.16em', color: TX2.muted, textTransform: 'uppercase' }}>
        {label}
      </span>
      {children}
    </label>
  );
}

// ─────────── Modo editor: lista de productos editable ───────────
function ProductsEditor() {
  const [s] = useS2();
  const [cat, setCat] = React.useState('burgers');
  const [editing, setEditing] = React.useState(null);
  const list = s.products.filter(p => p.cat === cat);

  return (
    <>
      <div style={{
        padding: '10px 22px', display: 'flex', alignItems: 'center',
        gap: 10, borderBottom: `1px solid ${TX2.line}`, background: 'rgba(224,122,60,0.08)',
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: TX2.accent,
          animation: 'pulse 1.6s ease-in-out infinite',
        }} />
        <div style={{ fontFamily: TX2.serif, fontStyle: 'italic', fontSize: 13, color: TX2.accent }}>
          Modo editor activo
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: TX2.mono, fontSize: 9, letterSpacing: '0.1em', color: TX2.muted }}>
          {s.products.length} PRODUCTOS
        </span>
      </div>

      <div style={{
        padding: '8px 22px', display: 'flex', gap: 14, overflowX: 'auto',
        borderBottom: `1px solid ${TX2.line}`,
      }}>
        {CATS2.filter(c => c.id !== 'todos').map((c) => {
          const active = c.id === cat;
          return (
            <button key={c.id} onClick={() => setCat(c.id)} style={{
              flex: '0 0 auto', padding: '6px 0', position: 'relative',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: TX2.serif, fontSize: 14,
              fontStyle: active ? 'italic' : 'normal',
              color: active ? TX2.ink : TX2.muted,
            }}>
              {c.name}
              {active && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, background: TX2.accent }} />}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 22px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {list.map((p) => (
            <button key={p.id} onClick={() => setEditing(p)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px',
              background: TX2.surface, border: `1px solid ${TX2.line}`,
              borderRadius: 6, cursor: 'pointer', textAlign: 'left',
              color: TX2.ink, opacity: p.available ? 1 : 0.5,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: p.available ? TX2.good : TX2.muted, flexShrink: 0,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: TX2.serif, fontSize: 14, fontWeight: 500 }}>{p.name}</span>
                  {!p.available && (
                    <span style={{ fontFamily: TX2.mono, fontSize: 9, color: TX2.muted, letterSpacing: '0.06em' }}>OCULTO</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: TX2.muted, fontFamily: TX2.serif, fontStyle: 'italic', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.desc}
                </div>
              </div>
              <div style={{ fontFamily: TX2.serif, fontSize: 15, color: TX2.accent2, fontStyle: 'italic' }}>
                {$(p.price)}
              </div>
              <span style={{ color: TX2.muted, marginLeft: 4 }}>{I.chev(13, TX2.muted)}</span>
            </button>
          ))}
        </div>

        <button onClick={() => A2.addProduct(cat)} style={{
          marginTop: 14, width: '100%', padding: '12px',
          background: 'transparent', border: `1px dashed ${TX2.line}`,
          color: TX2.accent, fontFamily: TX2.serif, fontStyle: 'italic', fontSize: 13,
          borderRadius: 6, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          {I.plus(13, TX2.accent)} Añadir producto a {CATS2.find(c=>c.id===cat)?.name?.toLowerCase()}
        </button>
      </div>

      {editing && <ProductEditor product={editing} onClose={() => setEditing(null)} />}
    </>
  );
}

// ─────────── Pantalla admin ───────────
function AdminScreen() {
  const [s] = useS2();

  return (
    <div style={{
      width: '100%', height: '100%', background: TX2.bg,
      fontFamily: TX2.sans, color: TX2.ink, position: 'relative',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '12px 22px', borderBottom: `2px solid ${TX2.ink}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: TX2.mono, fontSize: 9, letterSpacing: '0.2em', color: TX2.muted, textTransform: 'uppercase' }}>
            Admin · libro
          </div>
          <div style={{ fontFamily: TX2.mono, fontSize: 9, letterSpacing: '0.2em', color: TX2.muted, textTransform: 'uppercase' }}>
            mié · 14
          </div>
        </div>
        <div style={{
          fontFamily: TX2.serif, fontSize: 30, lineHeight: 1, marginTop: 2,
          textAlign: 'center', letterSpacing: '-0.02em', fontWeight: 500,
        }}>
          {s.editMode
            ? <>Editor de <span style={{ fontStyle: 'italic', color: TX2.accent }}>menú</span></>
            : <>Comandas <span style={{ fontStyle: 'italic', color: TX2.accent }}>del día</span></>}
        </div>

        {/* Toggle modo editor */}
        <div style={{
          marginTop: 10, display: 'flex', gap: 0,
          background: TX2.surface, border: `1px solid ${TX2.line}`,
          borderRadius: 6, padding: 3, overflow: 'hidden',
        }}>
          <button onClick={() => !s.editMode || A2.toggleEdit()} style={{
            flex: 1, padding: '7px 10px', borderRadius: 4,
            background: !s.editMode ? TX2.accent : 'transparent',
            color: !s.editMode ? TX2.bg : TX2.ink2, border: 'none', cursor: 'pointer',
            fontFamily: TX2.sans, fontSize: 11.5, fontWeight: !s.editMode ? 600 : 500,
            letterSpacing: '0.02em',
          }}>Pedidos en vivo</button>
          <button onClick={() => s.editMode || A2.toggleEdit()} style={{
            flex: 1, padding: '7px 10px', borderRadius: 4,
            background: s.editMode ? TX2.accent : 'transparent',
            color: s.editMode ? TX2.bg : TX2.ink2, border: 'none', cursor: 'pointer',
            fontFamily: TX2.sans, fontSize: 11.5, fontWeight: s.editMode ? 600 : 500,
            letterSpacing: '0.02em',
          }}>Editor de menú</button>
        </div>
      </div>

      {s.editMode ? <ProductsEditor /> : <OrdersList />}
    </div>
  );
}

window.AdminScreen = AdminScreen;
