// Datos compartidos: productos y pedidos de ejemplo para un POS de comida rápida

const CATEGORIES = [
  { id: 'todos',    name: 'Todos',    icon: '◉' },
  { id: 'burgers',  name: 'Burgers',  icon: '◍' },
  { id: 'tacos',    name: 'Tacos',    icon: '◐' },
  { id: 'sides',    name: 'Sides',    icon: '◑' },
  { id: 'bebidas',  name: 'Bebidas',  icon: '◒' },
  { id: 'postres',  name: 'Postres',  icon: '◓' },
];

const PRODUCTS = [
  // Burgers
  { id: 'p1',  cat: 'burgers', name: 'Smash Doble',         price: 145, desc: 'Doble carne, queso americano, cebolla caramelizada', tag: 'Top' },
  { id: 'p2',  cat: 'burgers', name: 'Clásica',             price: 110, desc: 'Carne 150g, lechuga, tomate, salsa de la casa' },
  { id: 'p3',  cat: 'burgers', name: 'BBQ Bacon',           price: 165, desc: 'Tocino crujiente, salsa BBQ, aros de cebolla' },
  { id: 'p4',  cat: 'burgers', name: 'Veggie',              price: 125, desc: 'Patty de garbanzo y betabel, aguacate' },

  // Tacos
  { id: 'p5',  cat: 'tacos',   name: 'Pastor (3 pz)',       price: 95,  desc: 'Tortilla de maíz, piña, cebolla, cilantro', tag: 'Nuevo' },
  { id: 'p6',  cat: 'tacos',   name: 'Birria (3 pz)',       price: 120, desc: 'Consomé, queso fundido, cebolla morada' },
  { id: 'p7',  cat: 'tacos',   name: 'Asada (3 pz)',        price: 110, desc: 'Arrachera, guacamole, salsa verde' },

  // Sides
  { id: 'p8',  cat: 'sides',   name: 'Papas Rústicas',      price: 55,  desc: 'Con sal de mar y romero' },
  { id: 'p9',  cat: 'sides',   name: 'Aros de Cebolla',     price: 65,  desc: 'Empanizado casero, salsa ranch' },
  { id: 'p10', cat: 'sides',   name: 'Elote Asado',         price: 50,  desc: 'Mayonesa, queso cotija, chile' },

  // Bebidas
  { id: 'p11', cat: 'bebidas', name: 'Limonada Mineral',    price: 45,  desc: 'Hierbabuena fresca' },
  { id: 'p12', cat: 'bebidas', name: 'Horchata',            price: 40,  desc: 'Receta de la casa, canela' },
  { id: 'p13', cat: 'bebidas', name: 'Cerveza Artesanal',   price: 75,  desc: 'IPA local, 355ml' },
  { id: 'p14', cat: 'bebidas', name: 'Agua Mineral',        price: 30,  desc: '500ml' },

  // Postres
  { id: 'p15', cat: 'postres', name: 'Brownie con Helado',  price: 75,  desc: 'Vainilla, salsa de chocolate' },
  { id: 'p16', cat: 'postres', name: 'Flan de la Casa',     price: 60,  desc: 'Cajeta artesanal' },
];

// Modificadores por producto (genéricos para demo)
const MODIFIERS = {
  burgers: [
    { name: 'Tamaño',  options: [['Regular', 0], ['Grande', 25]] },
    { name: 'Extras',  multi: true, options: [['Tocino', 18], ['Queso extra', 12], ['Aguacate', 15], ['Huevo', 10]] },
    { name: 'Quitar',  multi: true, options: [['Sin cebolla', 0], ['Sin tomate', 0], ['Sin salsa', 0]] },
  ],
  tacos: [
    { name: 'Tortilla', options: [['Maíz', 0], ['Harina', 5]] },
    { name: 'Salsa',    multi: true, options: [['Verde', 0], ['Roja', 0], ['Habanero', 0]] },
  ],
  bebidas: [
    { name: 'Tamaño', options: [['350ml', 0], ['500ml', 10]] },
    { name: 'Hielo',  options: [['Normal', 0], ['Poco', 0], ['Sin hielo', 0]] },
  ],
};

// Pedidos en vivo para la pantalla admin
const ORDERS = [
  { id: '#A-128', mesa: 'Mesa 4',     status: 'nuevo',      time: 1,  total: 285,
    items: [
      { name: 'Smash Doble', qty: 1, mods: ['Sin cebolla', '+Tocino'], price: 163 },
      { name: 'Papas Rústicas', qty: 1, price: 55 },
      { name: 'Limonada Mineral', qty: 1, price: 45 },
      { name: 'Horchata', qty: 1, price: 40 },
    ],
    nota: 'Cliente alérgico al gluten — confirmar pan',
    cliente: 'Andrea M.', pago: 'Tarjeta',
  },
  { id: '#A-127', mesa: 'Para llevar', status: 'preparando', time: 6,  total: 195,
    items: [
      { name: 'Tacos Pastor (3 pz)', qty: 2, price: 190 },
    ],
    cliente: 'Joel R.', pago: 'Efectivo',
  },
  { id: '#A-126', mesa: 'Mesa 7',     status: 'preparando', time: 9,  total: 410,
    items: [
      { name: 'BBQ Bacon', qty: 2, mods: ['Grande'], price: 380 },
      { name: 'Aros de Cebolla', qty: 1, price: 65 },
      { name: 'Cerveza Artesanal', qty: 2, price: 150 },
    ],
    cliente: 'Mesa 7', pago: 'Tarjeta',
  },
  { id: '#A-125', mesa: 'Mesa 2',     status: 'listo',      time: 14, total: 175,
    items: [
      { name: 'Tacos Birria (3 pz)', qty: 1, price: 120 },
      { name: 'Horchata', qty: 1, price: 40 },
      { name: 'Flan', qty: 0.5, price: 30 },
    ],
    cliente: 'Carla V.', pago: 'Tarjeta',
  },
  { id: '#A-124', mesa: 'Mesa 5',     status: 'listo',      time: 17, total: 220,
    items: [
      { name: 'Veggie Burger', qty: 1, price: 125 },
      { name: 'Elote Asado', qty: 1, price: 50 },
      { name: 'Limonada', qty: 1, price: 45 },
    ],
    cliente: 'Sofía L.', pago: 'Efectivo',
  },
  { id: '#A-123', mesa: 'Mesa 1',     status: 'entregado',  time: 24, total: 305,
    items: [
      { name: 'Clásica', qty: 1, price: 110 },
      { name: 'Smash Doble', qty: 1, price: 145 },
      { name: 'Agua Mineral', qty: 1, price: 30 },
    ],
    cliente: 'Diego P.', pago: 'Tarjeta',
  },
];

const DAY_STATS = {
  ventas: 12480,
  pedidos: 47,
  ticket: 265,
  tiempoProm: 12,
};

window.POS_DATA = { CATEGORIES, PRODUCTS, MODIFIERS, ORDERS, DAY_STATS };
