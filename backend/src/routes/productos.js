import { Router } from "express";
import { db } from "../db/index.js";
import { productos } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

function parseModificadores(row) {
  return { ...row, modificadores: row.modificadores ? JSON.parse(row.modificadores) : [] };
}

router.get("/", async (req, res) => {
  const rows = await db.select().from(productos);
  res.json(rows.map(parseModificadores));
});

router.post("/", async (req, res) => {
  const { nombre, precio, descripcion, imagen, categoria, disponible, modificadores, negocioId } = req.body;
  const [row] = await db.insert(productos).values({
    nombre, precio, descripcion, imagen,
    categoria: categoria || "general",
    disponible: disponible !== false,
    modificadores: modificadores ? JSON.stringify(modificadores) : null,
    negocioId,
  }).returning();
  res.status(201).json(parseModificadores(row));
});

router.put("/:id", async (req, res) => {
  const { nombre, precio, descripcion, imagen, categoria, disponible, modificadores } = req.body;
  const patch = {};
  if (nombre !== undefined) patch.nombre = nombre;
  if (precio !== undefined) patch.precio = precio;
  if (descripcion !== undefined) patch.descripcion = descripcion;
  if (imagen !== undefined) patch.imagen = imagen;
  if (categoria !== undefined) patch.categoria = categoria;
  if (disponible !== undefined) patch.disponible = disponible;
  if (modificadores !== undefined) patch.modificadores = JSON.stringify(modificadores);
  const [row] = await db.update(productos).set(patch).where(eq(productos.id, Number(req.params.id))).returning();
  res.json(parseModificadores(row));
});

router.delete("/:id", async (req, res) => {
  await db.delete(productos).where(eq(productos.id, Number(req.params.id)));
  res.status(204).send();
});

export default router;
