// Estado global compartido entre Productos y Admin
// Hook useStore() — state + acciones, sincronizado vía window.__POS_STORE
// para que las dos pantallas vean los mismos productos y pedidos en vivo.

const { CATEGORIES: CATS, PRODUCTS: PROD0, ORDERS: ORD0, DAY_STATS } = window.POS_DATA;

// Singleton suscriptor estilo Zustand mínimo
function makeStore(initial) {
  let state = initial;
  const subs = new Set();
  return {
    get: () => state,
    set: (updater) => {
      state = typeof updater === 'function' ? { ...state, ...updater(state) } : { ...state, ...updater };
      subs.forEach((fn) => fn(state));
    },
    sub: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
}

if (!window.__POS_STORE) {
  window.__POS_STORE = makeStore({
    products: PROD0.map(p => ({ ...p, available: true })),
    orders:   ORD0.map(o => ({ ...o })),
    cart:     [
      { id: 'p1',  qty: 1, name: 'Smash Doble',      price: 145, mods: ['Sin cebolla'] },
      { id: 'p11', qty: 2, name: 'Limonada Mineral', price: 45 },
    ],
    mesa:     'Mesa 4',
    cliente:  'Andrea M.',
    nota:     '',
    tab:      'productos',  // 'productos' | 'admin'
    editMode: false,        // modo editor en admin
  });
}

function useStore(selector = (s) => s) {
  const store = window.__POS_STORE;
  const [v, setV] = React.useState(() => selector(store.get()));
  React.useEffect(() => {
    return store.sub((s) => setV(selector(s)));
  }, []);
  return [v, store.set];
}

// Acciones
const Actions = {
  setTab: (tab) => window.__POS_STORE.set({ tab }),
  toggleEdit: () => window.__POS_STORE.set((s) => ({ editMode: !s.editMode })),

  // Cart
  addToCart: (product, mods = []) => window.__POS_STORE.set((s) => {
    const exists = s.cart.find((c) => c.id === product.id && JSON.stringify(c.mods||[]) === JSON.stringify(mods));
    if (exists) {
      return { cart: s.cart.map(c => c === exists ? { ...c, qty: c.qty + 1 } : c) };
    }
    return { cart: [...s.cart, { id: product.id, name: product.name, price: product.price, qty: 1, mods }] };
  }),
  changeQty: (idx, delta) => window.__POS_STORE.set((s) => {
    const next = s.cart.map((c, i) => i === idx ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter(c => c.qty > 0);
    return { cart: next };
  }),
  removeFromCart: (idx) => window.__POS_STORE.set((s) => ({ cart: s.cart.filter((_, i) => i !== idx) })),
  clearCart: () => window.__POS_STORE.set({ cart: [], nota: '' }),
  setMesa: (mesa) => window.__POS_STORE.set({ mesa }),
  setCliente: (cliente) => window.__POS_STORE.set({ cliente }),
  setNota: (nota) => window.__POS_STORE.set({ nota }),

  // Confirmar pedido — añadir a la lista de orders
  confirmOrder: (pago) => window.__POS_STORE.set((s) => {
    if (s.cart.length === 0) return s;
    const nextNum = 129 + s.orders.filter(o => /^#A-\d+$/.test(o.id)).length;
    const newOrder = {
      id: `#A-${nextNum}`,
      mesa: s.mesa, cliente: s.cliente, pago,
      status: 'nuevo', time: 0,
      total: s.cart.reduce((sum, c) => sum + c.price * c.qty, 0),
      items: s.cart.map(c => ({ name: c.name, qty: c.qty, price: c.price * c.qty, mods: c.mods })),
      nota: s.nota || undefined,
    };
    return { orders: [newOrder, ...s.orders], cart: [], nota: '' };
  }),

  // Order status
  advanceOrder: (id) => window.__POS_STORE.set((s) => {
    const flow = { nuevo: 'preparando', preparando: 'listo', listo: 'entregado', entregado: 'entregado' };
    return { orders: s.orders.map(o => o.id === id ? { ...o, status: flow[o.status] } : o) };
  }),

  // Edit mode product actions
  toggleAvailable: (pid) => window.__POS_STORE.set((s) => ({
    products: s.products.map(p => p.id === pid ? { ...p, available: !p.available } : p),
  })),
  updateProduct: (pid, patch) => window.__POS_STORE.set((s) => ({
    products: s.products.map(p => p.id === pid ? { ...p, ...patch } : p),
  })),
  addProduct: (cat) => window.__POS_STORE.set((s) => {
    const id = 'p' + (Date.now() % 100000);
    return { products: [...s.products, { id, cat, name: 'Producto nuevo', price: 0, desc: 'Descripción', available: true }] };
  }),
  removeProduct: (pid) => window.__POS_STORE.set((s) => ({
    products: s.products.filter(p => p.id !== pid),
  })),
};

window.POS_STORE = { useStore, Actions, CATS, DAY_STATS };
