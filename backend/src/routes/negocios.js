import { Router } from "express";
import { db } from "../db/index.js";
import { negocios } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db.select().from(negocios);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { nombre, telefono, slug } = req.body;
  const [row] = await db.insert(negocios).values({ nombre, telefono, slug }).returning();
  res.status(201).json(row);
});

router.put("/:id", async (req, res) => {
  const { nombre, telefono, slug } = req.body;
  const [row] = await db.update(negocios).set({ nombre, telefono, slug }).where(eq(negocios.id, Number(req.params.id))).returning();
  res.json(row);
});

router.delete("/:id", async (req, res) => {
  await db.delete(negocios).where(eq(negocios.id, Number(req.params.id)));
  res.status(204).send();
});

export default router;
