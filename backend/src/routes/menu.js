import { Router } from "express";
import { db } from "../db/index.js";
import { negocios, productos } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/:slug", async (req, res) => {
  const [negocio] = await db.select().from(negocios).where(eq(negocios.slug, req.params.slug));
  if (!negocio) return res.status(404).json({ error: "Negocio no encontrado" });

  const items = await db.select().from(productos).where(eq(productos.negocioId, negocio.id));
  const parsed = items.map((p) => ({ ...p, modificadores: p.modificadores ? JSON.parse(p.modificadores) : [] }));
  res.json({ negocio, productos: parsed });
});

export default router;
