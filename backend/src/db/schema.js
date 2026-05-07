import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

export const negocios = sqliteTable("negocios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  telefono: text("telefono").notNull(),
  slug: text("slug").notNull().unique(),
});

export const productos = sqliteTable("productos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  precio: real("precio").notNull(),
  descripcion: text("descripcion"),
  imagen: text("imagen"),
  categoria: text("categoria").default("general"),
  disponible: integer("disponible", { mode: "boolean" }).default(true),
  modificadores: text("modificadores"), // JSON: [{nombre, precio}]
  negocioId: integer("negocio_id").notNull().references(() => negocios.id),
});

export const pedidos = sqliteTable("pedidos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clienteNombre: text("cliente_nombre").notNull(),
  telefono: text("telefono"),
  direccion: text("direccion"),
  nota: text("nota"),
  estado: text("estado").notNull().default("pendiente"),
  fecha: text("fecha").notNull(),
  negocioId: integer("negocio_id").notNull().references(() => negocios.id),
});

export const pedidoDetalles = sqliteTable("pedido_detalles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pedidoId: integer("pedido_id").notNull().references(() => pedidos.id),
  productoId: integer("producto_id").notNull().references(() => productos.id),
  cantidad: integer("cantidad").notNull(),
  adiciones: text("adiciones"), // JSON: [{nombre, precio}]
});
