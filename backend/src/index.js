import express from "express";
import cors from "cors";
import { db } from "./db/index.js";
import { sql } from "drizzle-orm";

import menuRouter from "./routes/menu.js";
import productosRouter from "./routes/productos.js";
import pedidosRouter from "./routes/pedidos.js";
import negociosRouter from "./routes/negocios.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

db.run(sql`CREATE TABLE IF NOT EXISTS negocios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
)`);
db.run(sql`CREATE TABLE IF NOT EXISTS productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  precio REAL NOT NULL,
  descripcion TEXT,
  imagen TEXT,
  categoria TEXT DEFAULT 'general',
  disponible INTEGER DEFAULT 1,
  modificadores TEXT,
  negocio_id INTEGER NOT NULL REFERENCES negocios(id)
)`);
db.run(sql`CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_nombre TEXT NOT NULL,
  telefono TEXT,
  direccion TEXT,
  nota TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  fecha TEXT NOT NULL,
  negocio_id INTEGER NOT NULL REFERENCES negocios(id)
)`);
db.run(sql`CREATE TABLE IF NOT EXISTS pedido_detalles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER NOT NULL REFERENCES pedidos(id),
  producto_id INTEGER NOT NULL REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  adiciones TEXT
)`);

app.use("/menu", menuRouter);
app.use("/productos", productosRouter);
app.use("/pedidos", pedidosRouter);
app.use("/negocios", negociosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`POS backend en puerto ${PORT}`));
