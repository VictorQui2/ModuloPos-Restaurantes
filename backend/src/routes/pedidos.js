import { Router } from "express";
import { db } from "../db/index.js";
import { pedidos, pedidoDetalles, productos } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db.select().from(pedidos).orderBy(pedidos.fecha);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { clienteNombre, telefono, direccion, nota, negocioId, items } = req.body;
  const fecha = new Date().toISOString();
  const [pedido] = await db.insert(pedidos).values({ clienteNombre, telefono, direccion, nota, negocioId, fecha }).returning();
  if (items?.length) {
    await db.insert(pedidoDetalles).values(
      items.map((i) => ({
        pedidoId: pedido.id,
        productoId: i.productoId,
        cantidad: i.cantidad,
        adiciones: i.adiciones ? JSON.stringify(i.adiciones) : null,
      }))
    );
  }
  res.status(201).json(pedido);
});

router.put("/:id", async (req, res) => {
  const { estado } = req.body;
  const [row] = await db.update(pedidos).set({ estado }).where(eq(pedidos.id, Number(req.params.id))).returning();
  res.json(row);
});

router.get("/:id/detalle", async (req, res) => {
  const detalles = await db
    .select({ cantidad: pedidoDetalles.cantidad, producto: productos.nombre, precio: productos.precio, adiciones: pedidoDetalles.adiciones })
    .from(pedidoDetalles)
    .innerJoin(productos, eq(pedidoDetalles.productoId, productos.id))
    .where(eq(pedidoDetalles.pedidoId, Number(req.params.id)));
  res.json(detalles.map((d) => ({ ...d, adiciones: d.adiciones ? JSON.parse(d.adiciones) : [] })));
});

export default router;
